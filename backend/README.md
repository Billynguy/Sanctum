# Backend Documentation

The backend is the interface between the frontend and the AWS database. It consists of a Flask application running in app.py and all the necessary tools to run it. The application contains several functions, but the important ones have front-facing interfaces. Documentation on how to run the backend and its API structure are listed below.

## Starting the Backend
I have simplified this process by combining the required function calls into a single batch script. This script activates a virtual environment, ensures all necessary dependencies are installed within (and installs them if not), pings AWS, and starts the Flask server. The virtual environment and all its dependencies are store in `/.venv`, which is stored on the local environment and ignored on Github. Batch scripts are designed for Windows, and to run it type:
```
./s.bat
```
For Linux and Mac users, the batch script can be treated as a checklist and each of the commands can be run individually.

## API Structure
The backend runs on http://localhost:5000, and each route below is an extension of this address. Methods that expect inputs must be made to POST and contain their values as JSON strings. Any responses are also returned as JSON strings, with accompanying HTTP response codes.

`/download`: Downloads the specified folders from the s3 bucket, zips them up, and sends them to the frontend

    Input: {'files' : [file_name]}
    Output: zipped folder containing requested folders

`/upload`: Uploads an array of files to the database, works with zip files and with directories

    Input: {'files' : [file_name]}
    Output: Boolean success value

`/display_files`: Returns a list of the first 100 files in a bucket, organized in dictionaries containing the file name, location, type, size, and when it was last modified.
                  (Experimental Version) Returns the uploader and the time of upload

    Input: None
    Output: List of files

`/payment`: Handles the Square payment requests by the frontend

    Input: Source_ID, which identifies the product
    Output: Success value and amount paid

`/next_page`: Returns the next 100 files in the bucket, if there are more files to show. `/display_files` must be called first for this function to work

    Input: None
    Output: List of files

`/adduser`: Adds a user to database
    Input: {
            'username': username
            'userType': userType
            }
    Output: Boolean success value

`/`: Test route on root path

    Input: None
    Output: List of existing buckets

HTTP Response Codes:
* 200: Success
* 201: Success, new resource created
* 400: Bad request format
* 500: Internal error, described further in the response