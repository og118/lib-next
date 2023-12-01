from enum import Enum

from pydantic import BaseModel, Field


class TransactionStatus(str, Enum):
    PENDING = "PENDING"
    COMPLETED = "COMPLETED"


class CreateTransactionInput(BaseModel):
    user_id: int = Field(..., description="Primary key - integer id of the user")
    book_id: int = Field(..., description="Primary key - integer id of the book")
