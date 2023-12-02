from fastapi import APIRouter

from app.entities.transctions import CreateTransactionInput, TransactionStatus
from app.services.transaction_service import TransactionService
from app.utils.logging_utils import logger

router: APIRouter = APIRouter()


@router.post(path="")
async def create_transaction(create_transaction_input: CreateTransactionInput):
    logger.info(f"Creating new transaction: {create_transaction_input}")
    user_id: int = create_transaction_input.user_id
    book_id: int = create_transaction_input.book_id
    transaction_service = TransactionService()
    logger.info("Validating that the transaction is possible")
    is_in_stock: bool = await transaction_service.validate_book_stock(book_id)
    if not is_in_stock:
        raise Exception("Book is not in stock")
    logger.info("Validated that the book is in stock")
    is_transaction_possible: bool = (
        await transaction_service.validate_transaction_possible(user_id)
    )
    if not is_transaction_possible:
        raise Exception("Transaction not possible")
    logger.info("Validated that the transaction is possible")
    transaction = await transaction_service.create_transaction(user_id, book_id)
    return transaction


@router.get(path="")
async def get_all_transactions():
    try:
        # TODO: Add pagination
        transactions = await TransactionService().get_all_transactions()
    except Exception as e:
        logger.info(f"Error while getting all transactions - {e}")
        return []
    return transactions


@router.get(path="/{transaction_id}")
async def get_transaction(transaction_id: int):
    try:
        transaction = await TransactionService().get_transaction(transaction_id)
    except Exception as e:
        logger.info(f"Error while getting transaction with id: {transaction_id} - {e}")
        return None
    return transaction


@router.patch(path="/{transaction_id}")
async def update_transaction(transaction_id: int, status: TransactionStatus):
    try:
        transaction = await TransactionService().update_transaction_status(
            transaction_id, status
        )
    except Exception as e:
        logger.info(f"Error while updating transaction with id: {transaction_id} - {e}")
        return None
    return transaction


@router.get(path="/users/{user_id}")
async def get_all_transactions_for_user(user_id: int):
    try:
        transactions = await TransactionService().get_all_transactions_for_user(user_id)
    except Exception as e:
        logger.info(f"Error while getting transactions for user_id: {user_id} - {e}")
        return []
    return transactions


@router.get(path="/books/{book_id}")
async def get_all_transactions_for_book(book_id: int):
    try:
        transactions = await TransactionService().get_all_transactions_for_book(book_id)
    except Exception as e:
        logger.info(f"Error while getting transactions for book_id: {book_id} - {e}")
        return []
    return transactions
