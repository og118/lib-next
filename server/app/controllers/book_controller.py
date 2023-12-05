from datetime import datetime
from typing import List, Optional
from app.entities.book import CreateBookInput, UpdateBookInput
from app.models.book import Book, FrappeBook
from app.services.book_service import BookService
from app.utils.logging_utils import logger
from fastapi import APIRouter, Query
import requests

router: APIRouter = APIRouter()


@router.post(path="")
async def create_book(create_book_input: CreateBookInput):
    logger.info(f"Recieved a request to create a new book entry")
    book: Book = await BookService().create_new_book(
        create_book_input.model_dump(exclude_none=True)
    )
    logger.info(f"Successfully created a new book entry with id: {book.id}")
    return book


@router.get(path="/import/frappe")
async def fetch_book_from_frappe_api(limit: int = Query(10), includes: Optional[str] = Query(None)):
    logger.info(f"Recieved a request to import books from frappe API with following filters {limit, includes}")

    url: str = "https://frappe.io/api/method/frappe-library"
    page_size: int = 20
    page: int = limit//page_size+1
    params_arr: List[dict] = [{"page": pg+1, "title": includes} for pg in range(page)]

    try:
        processed_response: List[dict] = []
        for params in params_arr:
            logger.info(f"Fetching from Frappe API with the following params: {params['page'], params['title']}")
            response = requests.get(url, params=params)
            processed_response+=response.json()['message']

        # Process json from the response 
        for item in processed_response:
            item['publication_date'] = datetime.strptime(item['publication_date'], f"%m/%d/%Y")
            item['authors'] = item['authors'].split('/')
        
        # De-serialize the dictionary into List[FrappeBook] model
        books: List[FrappeBook] = [FrappeBook(**{k.strip(): v for k, v in book_dict.items() if k.strip() in FrappeBook.__annotations__}) \
                        for book_dict in processed_response]

    except requests.exceptions.RequestException as e:
        logger.error(f"Error making API request: {e}")

    logger.info(f"Successfully fetched {len(books)} new books from frappe API")
    return {'count': len(books[:limit]), "books": books[:limit]}


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
