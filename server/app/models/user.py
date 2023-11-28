from datetime import datetime

from pydantic import BaseModel, Field


class User(BaseModel):
    id: int = Field(..., description="Primary key - integer id of the user")
    email: str = Field(..., description="Email id of the user")
    name: str = Field(None, description="Name of the user")
    created_at: datetime = Field(..., description="Datetime when the user signed up to the platform")