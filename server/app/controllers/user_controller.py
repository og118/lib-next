from fastapi import APIRouter

from app.entities.user import CreateUserInput
from app.models.user import User
from app.services.user_service import UserService

router: APIRouter = APIRouter()


@router.post(path="")
async def create_user(create_user_input: CreateUserInput):
    email, name = create_user_input.email, create_user_input.name

    user: User = await UserService().create_new_user(email, name)
    return user


@router.get(path="")
async def get_user(id: int):
    try:
        user: User = await UserService().get_user_by_id(id)
    except Exception as e:
        # Implement better exception handling
        return {}
    return user