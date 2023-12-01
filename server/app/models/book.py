from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, Field


class Book(BaseModel):
    id: int = Field(..., description="Primary key - integer id of the book")
    title: str = Field(..., description="Primary key - title of the book")
    authors: List[str] = Field(..., description="Author(s) of the book")
    isbn: Optional[str] = Field(None, description="ISBN of the book")
    isbn13: Optional[str] = Field(None, description="ISBN13 of the book")
    language_code: Optional[str] = Field(None, description="Language code of the book")
    num_pages: Optional[int] = Field(None, description="Number of pages in the book")
    stock_quantity: int = Field(
        ..., description="Number of books in stock in the platform"
    )
    publication_date: Optional[datetime] = Field(
        None, description="Publication date of the book"
    )
    publisher: Optional[str] = Field(None, description="Publisher of the book")
    created_at: datetime = Field(
        ..., description="Datetime when the book was added to the platform"
    )
    updated_at: datetime = Field(
        ..., description="Datetime when the book was last updated"
    )
