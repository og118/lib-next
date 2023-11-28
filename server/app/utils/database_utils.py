from os import environ


def generate_dsn() -> str:
    db_type = environ.get("DB_TYPE")

    if db_type == 'heroku':
        return environ.get("DATABASE_URL")

    driver = environ.get("DB_DRIVER")
    user = environ.get("DB_USER")
    password = environ.get("DB_PASSWORD")
    database = environ.get("DB_NAME")

    if db_type == 'CLOUD_SQL':
        socket_dir = environ.get("DB_SOCKET_DIR")
        instance_connection_name = environ.get("INSTANCE_CONNECTION_NAME")
        return f"{driver}://{user}:{password}@/{database}?host={socket_dir}/{instance_connection_name}"

    host = environ.get("DB_HOST")
    port = environ.get("DB_PORT")
    return f"{driver}://{user}:{password}@{host}:{port}/{database}"
