
## Backend
### Setup Requirements
- python 3.8+
  - pip3
  - virtualenv
- IDE like PyCharm, Visual Studio Code
- git
- [postgresql](https://www.postgresql.org/download/)

### Setup
To set the virtual environment and install dependencies run

```bash
virtualenv -p python3 venv  # to be created only once
source venv/bin/activate
pip install -r requirements.txt
```

Create a `.env` file in the same folder as `.env.dev`. This file will contain all the environment
variables and secrets that are loaded when the application server starts.

**NOTE** - Ensure that any other `.env.*` file with production / staging environment credentials
is not committed in the repo.


### PostgreSQL Setup

After successful installation of postgresql, run the following commands **one by one** on the command prompt

```bash
sudo service postgresql start # start the postgresql service
sudo -i -u postgres # postgres shell login as postgres user
createuser testuser  # create new user 'testuser'
createdb testdb -O testuser  # create new db using user 'testuser'
psql testdb  # start postgres shell and use database 'testdb'
alter user testuser with password 'test';  # attach password 'test' to user 'testuser'
create schema test;  # create new schema on testdb
grant all privileges on database testdb to testuser;
grant all privileges on schema test to testuser;
```

These commands setup a basic postgres user, database, and a schema for local development environment. This needs to be run only once, while setting up the backend. For accessing the database for development and testing purposes, use the following command:

```bash
sudo -i -u postgres
psql testdb
```

## Library Documentation

Please refer to the documentation provided by the frameworks and packages used in the project.

- [fastapi](https://fastapi.tiangolo.com/) - main application framework
- [pydantic](https://pydantic-docs.helpmanual.io/) - all entities and models are pydantic objects
- [asyncpg](https://magicstack.github.io/asyncpg/current/) - async connector in python for PostgreSQL

## Starting Local Server

To start the app server in development mode (with auto reload on code changes) locally run

```bash
uvicorn app.main:app --reload
```

### Swagger Docs

Visit http://127.0.0.1:8000/docs in your browser to view the swagger doc and try out the APIs.
