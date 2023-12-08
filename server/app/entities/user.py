from typing import Optional
from pydantic import BaseModel, Field


class CreateUserInput(BaseModel):
    name: str = Field(None, description="Name of the user")
    email: str = Field(None, description="Email of the user")

class UpdateUserInput(CreateUserInput):
    name: Optional[str] = Field(None, description="Name of the user")
    email: Optional[str] = Field(None, description="Email of the user")