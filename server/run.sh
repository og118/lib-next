#!/usr/bin/bash

# Activate the virtual env
source venv/bin/activate

if [ $# -eq 0 ]
  then
    echo "Please provide the environment dev or prod"
    return 1
fi

cp .env.$1 .env
echo "Copied the $1 environment file"
echo $env

# Run the app
echo "Starting the app"
uvicorn app.main:app --reload --port 8000