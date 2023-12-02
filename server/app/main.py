from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import DatabaseConnectionPool
from app.routes import router
from app.utils.logging_utils import logger


async def database_connection(app: FastAPI):
    logger.info("Initialising database connection pool")
    load_status = load_dotenv(dotenv_path=".env")
    logger.info(f"Loaded .env file: {load_status}")
    await DatabaseConnectionPool.create()
    logger.info("Initialized database connection pool")

    yield

    logger.info("Closing database connection pool")
    await DatabaseConnectionPool.close()


app = FastAPI(title="lib-next", lifespan=database_connection)
app.include_router(router, prefix="/api/v1")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {"message": "Welcome to Lib-Next"}
