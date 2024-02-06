import boto3
import logging
import os
from botocore.exceptions import ClientError
from flask import Flask, jsonify, request
from zipfile import ZipFile

main_bucket = "bucket-for-testing-boto3"
zip_temp = "zip_temp"

app = Flask(__name__)

# Test route on root path
# Input: None
# Output: List of existing buckets
@app.route('/', methods=['GET'])
def test_function():
    return jsonify(list_existing_buckets())

# Downloads the specified image to the user's current directory
# Input: file: file to download
# Output: Bool
@app.route('/download', methods=['POST'])
def download_file():
    data = request.get_json()
    
    if 'file' in data:
        try:
            success = download_file(data['file'], main_bucket)
            return jsonify(success)
        except Exception as e:
            return jsonify({"error": str(e)}), 500
    else:
        return jsonify({"error": "Incorrect input format"}), 400
    
# Uploads an array of files to the database
# Input: files: Array of files
# Output: Bool
@app.route('/upload_files', methods=['POST'])
def upload_files():
    data = request.get_json()

    if 'files' in data:
        try:
            success = upload_files(data['files'], main_bucket)
            return jsonify(success)
        except Exception as e:
            return jsonify({"error": str(e)}), 500
    else:
        return jsonify({"error": "Incorrect input format"}), 400
## Functions

# Test file, displays an array of all existing buckets
def list_existing_buckets():
    s3_client = boto3.client('s3')
    response = s3_client.list_buckets()

    buckets = list()
    for bucket in response['Buckets']:
        buckets.append(bucket["Name"])
    return buckets

# Accepts an array of files to upload to the 
def upload_files(file_arr, bucket):    
    boto3.setup_default_session(profile_name="dev")
    s3_client = boto3.client('s3')
    try:
        for file in file_arr:
            if file.endswith(".zip"):
                unzip_files(file)
            else:
                s3_client.upload_file(file, bucket, file)
        for dir_, _, files in os.walk(zip_temp):
            for file in files:
                path = os.path.join(dir_,file)
                s3_client.upload_file(path, bucket, file)
                os.remove(path)
    except ClientError as e:
        logging.error(e)
        return False
    return True

# Handles uploads when a directory is passed
def upload_dir(directory, bucket):
    cmd = 'aws s3 sync ' + directory + ' s3://' + bucket + ' --profile dev'
    print(cmd)
    os.system(cmd)

# Downloads a file into the user's current directory
def download_file(file_name, bucket):
    boto3.setup_default_session(profile_name='dev')
    s3 = boto3.client('s3')
    try:
        s3.download_file(bucket, file_name, file_name)
    except ClientError as e:
        logging.error(e)
        return False
    return True

# internal function that handles zip files. Uses temporary folder zip_temp
def unzip_files(file_name):
    with ZipFile(file_name, 'r') as zip:
        zip.extractall(zip_temp)

if __name__ == '__main__':
    app.run()