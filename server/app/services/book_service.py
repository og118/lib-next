import os
from typing import Dict, Any


from asyncpg import Pool, Record

from app.database import DatabaseConnectionPool
from app.models.book import Book
from app.utils.deserialization_utils import deserialize_records


class BookService:

    def __init__(self):
        self.pool: Pool = DatabaseConnectionPool.get()
        self.schema: str = os.environ.get('DB_SCHEMA')

    async def create_new_book(self,
                              create_book_input_dict: Dict[str, Any]) -> Book:
        """Creates a new book in the database.

        Args:
            title: title of the book
            authors: author(s) of the book
            isbn: ISBN of the book,
            isbn13: ISBN13 of the book,
            lang_code: Language code of the book,
            num_pages: Number of pages in the book,
            publication_date: Date of publication,
            publisher: Publisher of the book

        Returns:
            book: pydantic model object of the book. See app.models.book.Book for more details.
        """

        keys = [key for key in create_book_input_dict.keys()]
        key_fields = ', '.join(keys)
        vals = [f'${x[0]+1}' for x in enumerate(keys)]
        val_fields = ', '.join(vals)

        print(f"Creating new book: {create_book_input_dict}")
        query = f"INSERT INTO {self.schema}.book " \
                f"({key_fields}) " \
                f"VALUES ({val_fields}) RETURNING *;"

        params = [val for val in create_book_input_dict.values()]
        print(params)

        async with self.pool.acquire() as connection:
            async with connection.transaction():
                print(
                    f"Acquired connection and opened transaction to insert new book via query: {query}"
                )
                book_record: Record = await connection.fetchrow(query, *params)

        print(f"Book: {create_book_input_dict['title']} successfully inserted in the db")
        return deserialize_records(book_record, Book)


    async def get_book_by_id(self, id: int) -> Book:
        """Fetches a book with given id from the database.

            Args:
                id:  id of the book

            Returns:
                book: pydantic model object of the book. See app.models.book.Book for more details.
        """

        query = f"SELECT * FROM {self.schema}.book WHERE id = $1;"

        async with self.pool.acquire() as connection:
            async with connection.transaction():
                print(
                    f"Acquired connection and opened transaction to fetch book via query: {query}"
                )
                book_record: Record = await connection.fetchrow(query, id)
        if not book_record:
            # TODO: handle exceptions in general
            raise Exception(f"Book {id} not found")
        return deserialize_records(book_record, Book)