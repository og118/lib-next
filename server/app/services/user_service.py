import os
from typing import Tuple

from asyncpg import Pool, Record

from app.database import DatabaseConnectionPool
from app.models.user import User
from app.utils.deserialization_utils import deserialize_records


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

        print(f"Creating new user: {email}")
        query = (
            f"INSERT INTO {self.schema}.user (name, email) "
            f"VALUES ($1, $2) RETURNING *;"
        )

        params: Tuple[str, str] = (name, email.lower())

        async with self.pool.acquire() as connection:
            async with connection.transaction():
                print(
                    f"Acquired connection and opened transaction to insert new user via query: {query}"
                )
                user_record: Record = await connection.fetchrow(query, *params)

        print(f"User: {email} successfully inserted in the db")
        return deserialize_records(user_record, User)

    async def get_user_by_id(self, id: int) -> User:
        """Fetches a user with given id from the database.

        Args:
            id:  id of the user

        Returns:
            user: pydantic model object of the user. See app.models.user.User for more details.
        """

        query = f"SELECT * FROM {self.schema}.user WHERE id = $1;"

        async with self.pool.acquire() as connection:
            async with connection.transaction():
                print(
                    f"Acquired connection and opened transaction to fetch uuser via query: {query}"
                )
                user_record: Record = await connection.fetchrow(query, id)
        if not user_record:
            # TODO: handle exceptions in general
            raise Exception(f"User {id} not found")
        return deserialize_records(user_record, User)

    async def update_user_by_id(self, id: int, name: str) -> User:
        """Updates a user with given id from the database.

        Args:
            id:  id of the user
            name: name of the user

        Returns:
            user: pydantic model object of the user. See app.models.user.User for more details.
        """

        query = f"UPDATE {self.schema}.user SET name = $1 WHERE id = $2 RETURNING *;"

        async with self.pool.acquire() as connection:
            async with connection.transaction():
                print(
                    f"Acquired connection and opened transaction to update user via query: {query}"
                )
                user_record: Record = await connection.fetchrow(query, name, id)
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
                print(
                    f"Acquired connection and opened transaction to delete user via query: {query}"
                )
                user_record: Record = await connection.fetchrow(query, id)
        if not user_record:
            raise Exception(f"User {id} not found")

        return deserialize_records(user_record, User)
