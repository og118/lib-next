from app.controllers import book_controller, transaction_controller, user_controller
from fastapi import APIRouter

router = APIRouter()
router.include_router(user_controller.router, prefix="/users", tags=["user"])
router.include_router(book_controller.router, prefix="/books", tags=["book"])
router.include_router(
    transaction_controller.router, prefix="/transactions", tags=["transaction"]
)
