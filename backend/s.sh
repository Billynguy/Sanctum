#!/bin/bash

if [ ! -d .venv ]; then
    echo "Creating new Python virtual environment in .venv..."
    python3 -m venv .venv
fi

echo "Activating virtual environment"
source .venv/bin/activate

echo "Installing dependencies"

pip show boto3 > /dev/null 2>&1
if [ $? -ne 0 ]; then
    pip install --upgrade boto3
fi

pip show Flask > /dev/null 2>&1
if [ $? -ne 0 ]; then
    pip install --upgrade Flask
fi

pip show flask_cors > /dev/null 2>&1
if [ $? -ne 0 ]; then
    pip install --upgrade flask_cors
fi

echo "Connecting to AWS"
aws sso login --profile dev

echo "Starting server..."
python app.py