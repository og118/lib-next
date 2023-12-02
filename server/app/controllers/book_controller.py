from app.entities.book import CreateBookInput, UpdateBookInput
from app.models.book import Book
from app.services.book_service import BookService
from app.utils.logging_utils import logger
from fastapi import APIRouter

router: APIRouter = APIRouter()


@router.post(path="")
async def create_book(create_book_input: CreateBookInput):
    logger.info(f"Recieved a request to create a new book entry")
    book: Book = await BookService().create_new_book(
        create_book_input.model_dump(exclude_none=True)
    )
    logger.info(f"Successfully created a new book entry with id: {book.id}")
    return book


@router.get(path="")
async def get_books():
    logger.info(f"Recieved a request to fetch all books")
    try:
        books: list[Book] = await BookService().get_all_books()
    except Exception as e:
        # Implement better exception handling
        return {}
    logger.info(f"Successfully fetched all books")
    return books


@router.get(path="/{id}")
async def get_book(id: int):
    logger.info(f"Recieved a request to fetch book with id: {id}")
    try:
        book: book = await BookService().get_book_by_id(id)
    except Exception as e:
        # Implement better exception handling
        return {}
    logger.info(f"Successfully fetched book with id: {id}")
    return book


@router.patch(path="/{id}")
async def update_book(id: int, update_book_input: UpdateBookInput):
    logger.info(f"Recieved a request to update book with id: {id}")
    try:
        book: Book = await BookService().update_book_by_id(
            id, update_book_input.model_dump(exclude_none=True)
        )
    except Exception as e:
        # Implement better exception handling
        return {}
    logger.info(f"Successfully updated book with id: {id}")
    return book


@router.delete(path="/{id}")
async def delete_book(id: int):
    logger.info(f"Recieved a request to delete book with id: {id}")
    try:
        book: Book = await BookService().delete_book_by_id(id)
    except Exception as e:
        # Implement better exception handling
        return {}
    logger.info(f"Successfully deleted book with id: {id}")
    return book
