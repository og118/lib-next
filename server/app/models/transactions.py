from datetime import datetime

from pydantic import BaseModel, Field

from app.entities.transctions import TransactionStatus


class Transactions(BaseModel):
    id: int = Field(..., description="Primary key - integer id of the book")
    user_id: int = Field(..., description="Primary key - integer id of the user")
    book_id: int = Field(..., description="Primary key - integer id of the book")
    status: TransactionStatus = Field(
        TransactionStatus.PENDING, description="Status of the transaction"
    )
    created_at: datetime = Field(
        ..., description="Datetime when the book was added to the platform"
    )
    updated_at: datetime = Field(
        ..., description="Datetime when the book was last updated"
    )
