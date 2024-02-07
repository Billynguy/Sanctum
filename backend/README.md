# Backend Documentation

The backend is the interface between the frontend and the AWS database. It consists of a Flask application running in app.py and all the necessary tools to run it. The application contains several functions, but the important ones have front-facing interfaces. Documentation on how to run the backend and its API structure are listed below.

## Starting the Backend
I have simplified this process by combining the required function calls into a single batch script. This script activates a virtual environment, ensures all necessary dependencies are installed within (and installs them if not), pings AWS, and starts the Flask server. Batch scripts are designed for Windows, and to run it type:
```
./s.bat
```
For Linux and Mac users, the batch script can be treated as a checklist and each of the commands can be run individually.

## API Structure
The backend runs on http://localhost:5000, and each route below is an extension of this address. Methods that expect inputs must be made to POST and contains their values as JSON strings. Any responses are also returned as JSON strings, with accompanying HTTP response codes.

`/download`: Downloads the specified images from the s3 bucket, zips them up, and sends them to the frontend

    Input: {'files' : [file_name]}
    Output: zipped folder containing requested files, number of files not downloaded successfully

`/upload`: Uploads an array of files to the database, works with zip files and with directories

    Input: {'files' : [file_name]}
    Output: Boolean success value

`/`: Test route on root path

    Input: None
    Output: List of existing buckets

HTTP Response Codes:
* 200: Success
* 400: Bad request format
* 500: Internal error, described further in the response