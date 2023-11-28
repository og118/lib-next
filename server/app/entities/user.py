from pydantic import BaseModel, Field


class CreateUserInput(BaseModel):
    name: str = Field(None, description="Name of the user")
    email: str = Field(None, description="Email of the user")
    
