from os import environ

import asyncpg
from asyncpg import create_pool

from app.utils.database_utils import generate_dsn
from app.utils.logging_utils import logger


class DatabaseConnectionPool:
    instance: asyncpg.Pool = None

    def __init__(self):
        raise NotImplementedError(f"DatabaseConnectionPool cannot be instantiated")

    @classmethod
    async def create(cls):
        """Initialises the shared instance variable holding the connection pool for the Postgres database.

        The connection pool has the following configuration:
            - minimum number of active connections maintained at all times = 5
            - maximum number of active connections at any point of time = 100
            - maximum time to wait before a connection is acquired = 10 s
            - maximum time to wait before a query finishes execution = 1 min
            - maximum time to wait before a connection in the pool is removed = 8 min
        """

        if cls.instance:
            logger.info("Database connection pool instance already initialised")
            return

        logger.info("Creating database connection pool instance")
        cls.instance = await create_pool(
            dsn=generate_dsn(),
            min_size=5,
            max_size=40,
            timeout=int(environ.get("CONNECTION_TIMEOUT", 10)),
            command_timeout=int(environ.get("QUERY_TIMEOUT", 60)),
            max_inactive_connection_lifetime=480,
        )

    @classmethod
    def get(cls):
        """Returns the connection pool instance.

        Raises:
            ValueError: if the connection pool instance has not been initialised before being requested for
        """

        logger.info("Acquiring database connection pool instance")
        if not cls.instance:
            raise ValueError(
                "Connection pool instance was not initialised on application startup"
            )
        return cls.instance

    @classmethod
    async def close(cls):
        """Gracefully closes all open and active connections in the connection pool.

        Invoked automatically at application shutdown.
        """

        logger.info(f"Closing all connections in the connection pool")
        await cls.instance.close()
