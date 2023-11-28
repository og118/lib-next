from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import DatabaseConnectionPool
from app.routes import router

app = FastAPI(title="lib-next")
app.include_router(router, prefix="/api/v1")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"])


@app.on_event('startup')
async def init():
    print("Performing init tasks")
    loaded = load_dotenv(dotenv_path='.env')
    print(f"Loaded .env file: {loaded}")
    await DatabaseConnectionPool.create()
    print("Initialized database connection pool")


@app.on_event('shutdown')
async def finalise():
    await DatabaseConnectionPool.close()
    print("Closed database connection pool")


@app.get("/")
async def root():
    return {"message": "Welcome to Lib-Next"}