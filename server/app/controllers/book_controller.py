from fastapi import APIRouter

from app.entities.book import CreateBookInput
from app.models.book import Book
from app.services.book_service import BookService

router: APIRouter = APIRouter()


@router.post(path="")
async def create_book(create_book_input: CreateBookInput):

    book: Book = await BookService().create_new_book(create_book_input.dict(exclude_none=True))
    return book


@router.get(path="")
async def get_book(id: int):
    try:
        book: book = await BookService().get_book_by_id(id)
    except Exception as e:
        # Implement better exception handling
        return {}
    return book
