import os

from asyncpg import Pool

from app.database import DatabaseConnectionPool
from app.entities.transctions import TransactionStatus
from app.models.transactions import Transactions
from app.utils.deserialization_utils import deserialize_records


class TransactionService:
    def __init__(self):
        self.pool: Pool = DatabaseConnectionPool.get()
        self.schema: str = os.environ.get("DB_SCHEMA")

    async def validate_book_stock(self, user_id, book_id) -> bool:
        """Validates if the book is in stock.

        Args:
            user_id: id of the user
            book_id: id of the book

        Returns:
            True if book is in stock else False
        """
        print(f"Validating book stock for book_id: {book_id}")

        query = f"""
        WITH book_stock AS (
            SELECT stock_quantity
            FROM {self.schema}.book
            WHERE id = $1
        ), transaction_stock AS (
            SELECT COUNT(*)
            FROM {self.schema}.transaction
            WHERE book_id = $1
            AND status = '{TransactionStatus.PENDING.value}'
        )
        SELECT (book_stock.stock_quantity - transaction_stock.count) AS stock_count
            FROM book_stock, transaction_stock;
"""

        async with self.pool.acquire() as connection:
            print(
                f"Acquired connection and opened transaction to validate book stock via query: {query}"
            )
            book_stock_count = await connection.fetchrow(query, book_id)

        print(f"Book stock count: {book_stock_count[0]}")
        return book_stock_count[0] > 0

    async def validate_transaction_possible(self, user_id) -> bool:
        """Validates if the transaction is possible.
        For example if the user has borrowed books whose charge exceeds the limit.
        This is done by first counting the number of days the user has borrowed books for.
        Then multiplying the number of days by the charge per day.
        Finally checking if the total charge exceeds the limit.

        Args:
            user_id: id of the user

        Returns:
            True if transaction is possible else False
        """
        print(f"Validating transaction for user_id: {user_id}")

        query = f"""
        WITH user_transaction AS (
            SELECT COUNT(*), SUM(book.charge_per_day)
            FROM {self.schema}.transaction
            INNER JOIN {self.schema}.book
            ON transaction.book_id = book.id
            WHERE user_id = $1
            AND status = '{TransactionStatus.PENDING.value}'
        ), user_charge_limit AS (
            SELECT charge_limit
            FROM {self.schema}.user
            WHERE id = $1
        )"""
        return True

    async def create_transaction(self, user_id: int, book_id: int):
        """
        Creates a new Transaction in the database.

        Args:
            user_id: id of the user
            book_id: id of the book

        Returns:
            book: pydantic model object of the book. See app.models.book.Book for more details.
        """
        print(f"Creating new transaction for book_id: {book_id} and user_id: {user_id}")

        query = f"""
        INSERT INTO {self.schema}.transaction
        (book_id, user_id, status)
        VALUES ($1, $2, '{TransactionStatus.PENDING.value}')
        RETURNING *;
        """
        async with self.pool.acquire() as connection:
            async with connection.transaction():
                print(
                    f"Acquired connection and opened transaction to insert new transaction via query: {query}"
                )
                transaction_record = await connection.fetchrow(query, book_id, user_id)

        print(f"Transaction: {transaction_record} successfully inserted in the db")
        return deserialize_records(transaction_record, Transactions)

    async def get_all_transactions(self):
        """
        Gets all transactions.

        Returns:
            transactions: list of pydantic model objects of the transactions. See app.models.transactions.Transactions for more details.
        """
        print(f"Getting all transactions")

        query = f"""
        SELECT * FROM {self.schema}.transaction
        """
        async with self.pool.acquire() as connection:
            print(
                f"Acquired connection and opened transaction to get all transactions via query: {query}"
            )
            transaction_records = await connection.fetch(query)

        print(f"Transactions: {transaction_records} successfully fetched from the db")
        return deserialize_records(transaction_records, Transactions)

    async def get_transaction(self, transaction_id: int):
        """
        Gets a transaction.

        Args:
            transaction_id: id of the transaction

        Returns:
            transaction: pydantic model object of the transaction. See app.models.transactions.Transactions for more details.
        """
        print(f"Getting transaction with id: {transaction_id}")

        query = f"""
        SELECT * FROM {self.schema}.transaction
        WHERE id = $1
        """
        async with self.pool.acquire() as connection:
            print(
                f"Acquired connection and opened transaction to get transaction via query: {query}"
            )
            transaction_record = await connection.fetchrow(query, transaction_id)

        print(f"Transaction: {transaction_record} successfully fetched from the db")
        return deserialize_records(transaction_record, Transactions)

    async def update_transaction_status(
        self, transaction_id: int, status: TransactionStatus
    ):
        """
        Updates the status of a transaction.

        Args:
            transaction_id: id of the transaction
            status: status of the transaction

        Returns:
            transaction: pydantic model object of the transaction. See app.models.transactions.Transactions for more details.
        """
        print(f"Updating transaction with id: {transaction_id}")

        query = f"""
        UPDATE {self.schema}.transaction
        SET status = $1, updated_at = NOW()
        WHERE id = $2
        RETURNING *;
        """
        async with self.pool.acquire() as connection:
            async with connection.transaction():
                print(
                    f"Acquired connection and opened transaction to update transaction via query: {query}"
                )
                transaction_record = await connection.fetchrow(
                    query, status.value, transaction_id
                )

        print(f"Transaction: {transaction_record} successfully updated in the db")
        return deserialize_records(transaction_record, Transactions)

    async def get_all_transactions_for_user(self, user_id: int):
        """
        Gets all transactions for a user.

        Args:
            user_id: id of the user

        Returns:
            transactions: list of pydantic model objects of the transactions. See app.models.transactions.Transactions for more details.
        """
        print(f"Getting all transactions for user_id: {user_id}")

        query = f"""
        SELECT * FROM {self.schema}.transaction
        WHERE user_id = $1
        """
        async with self.pool.acquire() as connection:
            print(
                f"Acquired connection and opened transaction to get all transactions for user via query: {query}"
            )
            transaction_records = await connection.fetch(query, user_id)

        print(f"Transactions: {transaction_records} successfully fetched from the db")
        return deserialize_records(transaction_records, Transactions)

    async def get_all_transactions_for_book(self, book_id: int):
        """
        Gets all transactions for a book.

        Args:
            book_id: id of the book

        Returns:
            transactions: list of pydantic model objects of the transactions. See app.models.transactions.Transactions for more details.
        """
        print(f"Getting all transactions for book_id: {book_id}")

        query = f"""
        SELECT * FROM {self.schema}.transaction
        WHERE book_id = $1
        """
        async with self.pool.acquire() as connection:
            print(
                f"Acquired connection and opened transaction to get all transactions for book via query: {query}"
            )
            transaction_records = await connection.fetch(query, book_id)

        print(f"Transactions: {transaction_records} successfully fetched from the db")
        return deserialize_records(transaction_records, Transactions)
