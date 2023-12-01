from fastapi import APIRouter

from app.controllers import book_controller, transaction_controller, user_controller

router = APIRouter()
router.include_router(user_controller.router, prefix="/user", tags=["user"])
router.include_router(book_controller.router, prefix="/book", tags=["book"])
router.include_router(
    transaction_controller.router, prefix="/transaction", tags=["transaction"]
)
