@echo off

echo Connecting to AWS
aws sso login --profile dev

if not exist .venv (
    echo Creating new Python virtual environment in .venv...
    python -m venv .venv
)

echo Activating virtual environment
call .venv\Scripts\activate

echo Installing dependencies

pip show boto3 > nul 2>&1
if %errorlevel% neq 0 (
    pip install --upgrade boto3
)

pip show Flask > nul 2>&1
if %errorlevel% neq 0 (
    pip install --upgrade Flask
)

pip show flask_cors > nul 2>&1
if %errorlevel% neq 0 (
    pip install --upgrade flask_cors
)

pip show square > nul 2>&1
if %errorlevel% neq 0 (
    pip install --upgrade squareup
)

echo Starting server...
python app.py