import os
from typing import Dict, Tuple, List

from app.database import DatabaseConnectionPool
from app.models.user import User
from app.utils.deserialization_utils import deserialize_records
from app.utils.logging_utils import logger
from asyncpg import Pool, Record


class UserService:
    def __init__(self):
        self.pool: Pool = DatabaseConnectionPool.get()
        self.schema: str = os.environ.get("DB_SCHEMA")

    async def create_new_user(self, email: str, name: str = "No-Name") -> User:
        """Creates a new user in the database.

        Args:
            name: name of the user
            email: email id of the new user

        Returns:
            user: pydantic model object of the user. See app.models.user.User for more details.
        """

        logger.info(f"Creating new user: {email}")
        query = (
            f"INSERT INTO {self.schema}.user (name, email) "
            f"VALUES ($1, $2) RETURNING *;"
        )

        params: Tuple[str, str] = (name, email.lower())

        async with self.pool.acquire() as connection:
            async with connection.transaction():
                logger.info(
                    f"Acquired connection and opened transaction to insert new user via query: {query}"
                )
                user_record: Record = await connection.fetchrow(query, *params)

        logger.info(f"User: {email} successfully inserted in the db")
        return deserialize_records(user_record, User)

    async def get_all_users(self) -> List[User]:
        """Fetches all users from the database.

        Returns:
            users: list of pydantic model objects of the users. See app.models.user.User for more details.
        """

        query = f"SELECT * FROM {self.schema}.user ORDER BY id;"

        async with self.pool.acquire() as connection:
            logger.info(
                f"Acquired connection and opened transaction to fetch all users via query: {query}"
            )
            user_records: list[Record] = await connection.fetch(query)
        if not user_records:
            return []
        return deserialize_records(user_records, User)

    async def get_user_by_id(self, id: int) -> User:
        """Fetches a user with given id from the database.

        Args:
            id:  id of the user

        Returns:
            user: pydantic model object of the user. See app.models.user.User for more details.
        """

        query = f"SELECT * FROM {self.schema}.user WHERE id = $1;"

        async with self.pool.acquire() as connection:
            logger.info(
                f"Acquired connection and opened transaction to fetch uuser via query: {query}"
            )
            user_record: Record = await connection.fetchrow(query, id)
        if not user_record:
            # TODO: handle exceptions in general
            raise Exception(f"User {id} not found")
        return deserialize_records(user_record, User)

    async def update_user_by_id(self, id: int, update_user_input_dict: Dict[str, str]) -> User:
        """Updates a user with given id from the database.

        Args:
            id:  id of the user
            name: name of the user
            email: email of the user

        Returns:
            user: pydantic model object of the user. See app.models.user.User for more details.
        """

        params: List[str] = [val for val in update_user_input_dict.values()]
        key_fields: List[str] = list(
            map(
                lambda x: f"{x[1]} = ${x[0] + 2}",
                enumerate(update_user_input_dict.keys()),
            )
        )
        key_fields.insert(0, "updated_at = NOW()")
        update_clause: str = ", ".join(key_fields)
        query = (
            f"UPDATE {self.schema}.user SET {update_clause} WHERE id = $1 RETURNING *;"
        )

        async with self.pool.acquire() as connection:
            async with connection.transaction():
                logger.info(
                    f"Acquired connection and opened transaction to update user via query: {query}"
                )
                user_record: Record = await connection.fetchrow(query, id, *params)
        if not user_record:
            raise Exception(f"User {id} not found")

        return deserialize_records(user_record, User)

    async def delete_user_by_id(self, id: int) -> User:
        """Deletes a user with given id from the database.

        Args:
            id:  id of the user

        Returns:
            user: pydantic model object of the user. See app.models.user.User for more details.
        """

        query = f"DELETE FROM {self.schema}.user WHERE id = $1 RETURNING *;"

        async with self.pool.acquire() as connection:
            async with connection.transaction():
                logger.info(
                    f"Acquired connection and opened transaction to delete user via query: {query}"
                )
                user_record: Record = await connection.fetchrow(query, id)

        logger.info(f"User: {id} successfully deleted from the db")
        if not user_record:
            raise Exception(f"User {id} not found")

        return deserialize_records(user_record, User)
