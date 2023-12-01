from fastapi import APIRouter

from app.entities.book import CreateBookInput, UpdateBookInput
from app.models.book import Book
from app.services.book_service import BookService

router: APIRouter = APIRouter()


@router.post(path="")
async def create_book(create_book_input: CreateBookInput):
    book: Book = await BookService().create_new_book(
        create_book_input.model_dump(exclude_none=True)
    )
    return book


@router.get(path="")
async def get_book(id: int):
    try:
        book: book = await BookService().get_book_by_id(id)
    except Exception as e:
        # Implement better exception handling
        return {}
    return book


@router.patch(path="")
async def update_book(id: int, update_book_input: UpdateBookInput):
    try:
        book: Book = await BookService().update_book_by_id(
            id, update_book_input.model_dump(exclude_none=True)
        )
    except Exception as e:
        # Implement better exception handling
        return {}
    return book


@router.delete(path="")
async def delete_book(id: int):
    try:
        book: Book = await BookService().delete_book_by_id(id)
    except Exception as e:
        # Implement better exception handling
        return {}
    return book
