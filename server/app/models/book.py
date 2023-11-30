from datetime import datetime
from typing import List
from pydantic import BaseModel, Field


class Book(BaseModel):
    id: int = Field(...,
                        description="Primary key - integer id of the book")
    title: str = Field(..., description="Primary key - title of the book")
    authors: List[str] = Field(..., description="Author(s) of the book")
    isbn: str = Field(None, description="ISBN of the book")
    isbn13: str = Field(None, description="ISBN13 of the book")
    language_code: str = Field(None, description="Language code of the book")
    num_pages: int = Field(None, description="Number of pages in the book")
    publication_date: datetime = Field(None,
                                  description="Publication date of the book")
    publisher: str = Field(None, description="Publisher of the book")
    created_at: datetime = Field(
        ..., description="Datetime when the book was added to the platform")
