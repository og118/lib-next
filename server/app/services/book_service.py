from datetime import datetime
import os
from typing import Any, Dict, List

from app.database import DatabaseConnectionPool
from app.models.book import Book
from app.utils.deserialization_utils import deserialize_records
from app.utils.logging_utils import logger
from asyncpg import Pool, Record


class BookService:
    def __init__(self):
        self.pool: Pool = DatabaseConnectionPool.get()
        self.schema: str = os.environ.get("DB_SCHEMA")

    async def create_new_book(self, create_book_input_dict: Dict[str, Any]) -> Book:
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
        key_fields = ", ".join(keys)
        vals = [f"${x[0]+1}" for x in enumerate(keys)]
        val_fields = ", ".join(vals)

        logger.info(f"Creating new book: {create_book_input_dict}")
        query = (
            f"INSERT INTO {self.schema}.book "
            f"({key_fields}) "
            f"VALUES ({val_fields}) RETURNING *;"
        )

        params = [val for val in create_book_input_dict.values()]

        async with self.pool.acquire() as connection:
            async with connection.transaction():
                logger.info(
                    f"Acquired connection and opened transaction to insert new book via query: {query}"
                )
                book_record: Record = await connection.fetchrow(query, *params)

        logger.info(
            f"Book: {create_book_input_dict['title']} successfully inserted in the db"
        )
        return deserialize_records(book_record, Book)

    async def create_new_book_batch(self, create_book_batch_input_dict: List[Dict[str, Any]]) -> Book:
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
        vals = [[val for val in x.values()] for x in create_book_batch_input_dict]

        vals = list((
            0,
            x['title'],
            x['authors'],
            x['isbn'],
            x['isbn13'],
            x['language_code'],
            x['num_pages'],
            0,
            datetime.now(),
            x['publisher'],
            datetime.now(),
            datetime.now()
        ) for x in create_book_batch_input_dict)

        logger.info(f"Creating new {len(vals)} book(s)")
        query = f"""INSERT INTO {self.schema}.book 
        (title, authors, isbn, isbn13, language_code, num_pages, publication_date, publisher)
        (
            SELECT r.title, r.authors, r.isbn, r.isbn13, r.language_code, r.num_pages, 
                    r.publication_date, r.publisher
            FROM unnest($1::{self.schema}.book[]) as r
        )
        ON CONFLICT DO NOTHING
        RETURNING *;
        """

        async with self.pool.acquire() as connection:
            async with connection.transaction():
                logger.info(
                    f"Acquired connection and opened transaction to insert new book via query: {query}"
                )
                book_record: List[Record] = await connection.fetch(query, vals)

        logger.info(
            f"Book: {len(book_record)} successfully inserted in the db"
        )
        return deserialize_records(book_record, Book)


    async def get_all_books(self) -> List[Book]:
        """Fetches all books from the database.

        Returns:
            books: list of pydantic model objects of the books. See app.models.book.Book for more details.
        """

        query = f"SELECT * FROM {self.schema}.book ORDER BY created_at DESC;"

        async with self.pool.acquire() as connection:
            logger.info(
                f"Acquired connection and opened transaction to fetch all books via query: {query}"
            )
            books_record: List[Record] = await connection.fetch(query)

        logger.info(f"Successfully fetched all books with count: {len(books_record)}")
        if not books_record:
            return []
        return deserialize_records(books_record, Book)


    async def get_book_by_id(self, id: int) -> Book:
        """Fetches a book with given id from the database.

        Args:
            id:  id of the book

        Returns:
            book: pydantic model object of the book. See app.models.book.Book for more details.
        """

        query = f"SELECT * FROM {self.schema}.book WHERE id = $1;"

        async with self.pool.acquire() as connection:
            logger.info(
                f"Acquired connection and opened transaction to fetch book via query: {query}"
            )
            book_record: Record = await connection.fetchrow(query, id)

        if not book_record:
            # TODO: handle exceptions in general
            raise Exception(f"Book {id} not found")
        return deserialize_records(book_record, Book)

    async def update_book_by_id(
        self, id: int, update_book_input_dict: Dict[str, Any]
    ) -> Book:
        """Updates a book with given id from the database.

        Args:
            id:  id of the book
            update_book_input_dict:
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

        logger.info(f"Updating book: {update_book_input_dict}")

        params: List[Any] = [val for val in update_book_input_dict.values()]
        key_fields: List[str] = list(
            map(
                lambda x: f"{x[1]} = ${x[0] + 2}",
                enumerate(update_book_input_dict.keys()),
            )
        )
        key_fields.insert(0, "updated_at = NOW()")
        update_clause: str = ", ".join(key_fields)
        query = (
            f"UPDATE {self.schema}.book SET {update_clause} WHERE id = $1 RETURNING *;"
        )

        async with self.pool.acquire() as connection:
            async with connection.transaction():
                logger.info(
                    f"Acquired connection and opened transaction to update book via query: {query}"
                )
                book_record: Record = await connection.fetchrow(query, id, *params)
        if not book_record:
            raise Exception(f"Book {id} not found")

        return deserialize_records(book_record, Book)

    async def delete_book_by_id(self, id: int) -> Book:
        """Deletes a book with given id from the database.

        Args:
            id:  id of the book

        Returns:
            book: pydantic model object of the book. See app.models.book.Book for more details.
        """

        query = f"DELETE FROM {self.schema}.book WHERE id = $1 RETURNING *;"

        async with self.pool.acquire() as connection:
            async with connection.transaction():
                logger.info(
                    f"Acquired connection and opened transaction to delete book via query: {query}"
                )
                book_record: Record = await connection.fetchrow(query, id)
        if not book_record:
            raise Exception(f"Book {id} not found")

        return deserialize_records(book_record, Book)
