#!/usr/bin/python3

import asyncio
import os
import sys
import time

import asyncpg
from dotenv import load_dotenv


async def drop_all_tables_if_present(connection):
    query = f"""SELECT tablename FROM pg_tables WHERE schemaname = '{schema_name}';"""
    print(f"Executing query: {query}")
    result = await connection.fetch(query)

    tables = [f"{schema_name}.{row['tablename']}" for row in result]
    tables = ", ".join(tables)
    query = f"DROP TABLE IF EXISTS {tables} CASCADE;"
    print(f"Executing query: {query}")
    await connection.execute(query)

    # Fetch all defined enums
    enum_query = """
    SELECT n.nspname AS schema, t.typname AS type
    FROM pg_type t
    LEFT JOIN pg_catalog.pg_namespace n ON n.oid = t.typnamespace
    WHERE (
        t.typrelid = 0 OR (
            SELECT c.relkind = 'c' FROM pg_catalog.pg_class c WHERE c.oid = t.typrelid
    )) AND NOT EXISTS (
        SELECT 1 FROM pg_catalog.pg_type el 
        WHERE el.oid = t.typelem AND el.typarray = t.oid
    ) AND n.nspname NOT IN ('pg_catalog', 'information_schema');
"""
    enum_details = await connection.fetch(enum_query)
    enums = [f"{row['schema']}.{row['type']}" for row in enum_details]
    enums = ", ".join(enums)
    enum_query = f"DROP TYPE IF EXISTS {enums} CASCADE;"
    print(f"Executing query: {enum_query}")
    await connection.execute(enum_query)


async def create_user_table(connection):
    query = f"""CREATE TABLE {schema_name}.user (
        id              SERIAL PRIMARY KEY,
        name            VARCHAR(64) NULL,
        email           VARCHAR(64) UNIQUE NOT NULL,
        created_at      TIMESTAMP NOT NULL DEFAULT NOW()
        updated_at      TIMESTAMP NOT NULL DEFAULT NOW(),
    );"""

    print(f"Executing query: {query}")
    await connection.execute(query)


async def create_book_table(connection):
    query = f"""CREATE TABLE {schema_name}.book (
        id                      SERIAL PRIMARY KEY,
        title                   VARCHAR(255) NOT NULL,
        authors                 VARCHAR(255)[] NOT NULL,
        isbn                    VARCHAR(13) UNIQUE NULL,
        isbn13                  VARCHAR(13) UNIQUE NULL,
        language_code           VARCHAR(10) NULL,
        num_pages               INT NULL,
        stock_quantity          INT NOT NULL DEFAULT 0,
        publication_date        DATE NULL,
        publisher               VARCHAR(255) NULL,
        created_at              TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at              TIMESTAMP NOT NULL DEFAULT NOW(),
        CONSTRAINT              book_title_authors_key UNIQUE (title, authors)
    );"""

    print(f"Executing query: {query}")
    await connection.execute(query)


async def create_tranasction_table(connection):
    enum_query = f"""CREATE TYPE {schema_name}.transaction_status 
    AS ENUM ('PENDING', 'COMPLETED');
    """
    print(f"Executing query: {enum_query}")
    await connection.execute(enum_query)
    query = f"""CREATE TABLE {schema_name}.transaction (
        id                      SERIAL PRIMARY KEY,
        user_id                 INT NOT NULL,
        book_id                 INT NOT NULL,
        status                  {schema_name}.transaction_status NOT NULL DEFAULT 'PENDING',
        created_at              TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at              TIMESTAMP NOT NULL DEFAULT NOW(),
        CONSTRAINT              transaction_mapping_user_id_fk FOREIGN KEY (user_id) REFERENCES {schema_name}.user (id),
        CONSTRAINT              transaction_mapping_book_id_fk FOREIGN KEY (book_id) REFERENCES {schema_name}.book (id)
    );"""

    print(f"Executing query: {query}")
    await connection.execute(query)


def verify_local_environment():
    if (
        host_name != "localhost"
        and host_name != "127.0.0.1"
        and host_name != "postgres"
    ):
        answer: str = input(
            f"Environment using host: {host_name} seems to be non local. "
            f"Are you sure you want to proceed? Type - Yes to continue or No to abort"
        )
        if answer.lower() == "yes":
            print(
                f"You have chosen to proceed with environment using host: {host_name}"
            )
            time.sleep(1)
        else:
            print(
                f"You have chosen not to proceed with environment using host: {host_name}"
            )
            sys.exit(0)
    elif db_name != "testdb":
        answer: str = input(
            f"Database: {db_name} seems to be other than the testdb. "
            f"Are you sure you want to proceed? Type - Yes to continue or No to abort"
        )
        if answer.lower() == "yes":
            print(
                f"You have chosen to proceed with environment using database: {db_name}"
            )
            time.sleep(1)
        else:
            print(
                f"You have chosen not to proceed with environment using database: {db_name}"
            )
            sys.exit(0)
    else:
        print(
            f"Environment using host: {host_name} and database: {db_name} seems to be local testing."
        )


async def create_connection():
    return await asyncpg.connect(
        host=os.environ.get("DB_HOST"),
        port=os.environ.get("DB_PORT"),
        database=os.environ.get("DB_NAME"),
        user=os.environ.get("DB_USER"),
        password=os.environ.get("DB_PASSWORD"),
        timeout=int(os.environ.get("CONNECTION_TIMEOUT", 10)),
        command_timeout=int(os.environ.get("QUERY_TIMEOUT", 60)),
    )


async def rebuild_schema():
    connection = await create_connection()

    print(f"Dropping all tables in schema: {schema_name}")
    await drop_all_tables_if_present(connection)
    print(f"Dropped all tables in schema: {schema_name}")

    print(f"Recreating all tables in schema: {schema_name}")
    await create_user_table(connection)
    await create_book_table(connection)
    await create_tranasction_table(connection)

    await connection.close()
    print(f"Closed connection")


if __name__ == "__main__":
    load_dotenv()

    host_name = os.environ.get("DB_HOST")
    db_name = os.environ.get("DB_NAME")
    schema_name = os.environ.get("DB_SCHEMA")

    verify_local_environment()

    asyncio.run(rebuild_schema())
