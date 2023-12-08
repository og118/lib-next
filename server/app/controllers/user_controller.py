from app.entities.user import CreateUserInput, UpdateUserInput
from app.models.user import User
from app.services.user_service import UserService
from app.utils.logging_utils import logger
from fastapi import APIRouter

router: APIRouter = APIRouter()


@router.post(path="")
async def create_user(create_user_input: CreateUserInput):
    logger.info(f"Recieved a request to create a new user entry")
    email, name = create_user_input.email, create_user_input.name

    user: User = await UserService().create_new_user(email, name)
    logger.info(f"Successfully created a new user entry with id: {user.id}")
    return user


@router.get(path="/{id}")
async def get_user(id: int):
    logger.info(f"Recieved a request to fetch user with id: {id}")
    try:
        user: User = await UserService().get_user_by_id(id)
    except Exception as e:
        # Implement better exception handling
        logger.error(e)
        return {}
    logger.info(f"Successfully fetched user with id: {id}")
    return user


@router.get(path="")
async def get_all_users():
    logger.info(f"Recieved a request to fetch all users")
    try:
        users: list[User] = await UserService().get_all_users()
    except Exception as e:
        # Implement better exception handling
        logger.error(e)
        return {}
    logger.info(f"Successfully fetched all users")
    return users


@router.patch(path="/{id}")
async def update_user(id: int, update_user_input: UpdateUserInput):
    logger.info(f"Recieved a request to update user with id: {id}")

    name = update_user_input.name
    email = update_user_input.email
    
    if name is None and email is None:
        return {'message': 'Nothing to update'}

    try:
        user: User = await UserService().update_user_by_id(id, update_user_input.model_dump(exclude_none=True))
    except Exception as e:
        # Implement better exception handling
        logger.error(e)
        return {}
    logger.info(f"Successfully updated user with id: {id}")
    return user


@router.delete(path="/{id}")
async def delete_user(id: int):
    logger.info(f"Recieved a request to delete user with id: {id}")
    try:
        user: User = await UserService().delete_user_by_id(id)
    except Exception as e:
        # Implement better exception handling
        logger.error(e)
        return {}
    logger.info(f"Successfully deleted user with id: {id}")
    return user
