from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import DatabaseConnectionPool
from app.routes import router


async def database_connection(app: FastAPI):
    print("Initialising database connection pool")
    load_status = load_dotenv(dotenv_path=".env")
    print(f"Loaded .env file: {load_status}")
    await DatabaseConnectionPool.create()
    print("Initialized database connection pool")

    yield

    print("Closing database connection pool")
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
