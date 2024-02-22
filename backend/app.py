# import sys
# import threading
import boto3
import logging
import os
import shutil
from botocore.exceptions import ClientError
from boto3.s3.transfer import TransferConfig
from flask import Flask, jsonify, request, send_file
from flask_cors import CORS
from zipfile import ZipFile
from io import BytesIO

main_bucket = "bucket-for-testing-boto3"
zip_temp = "zip_temp"
download_temp = "Sanctum_Images"

app = Flask(__name__)
CORS(app)

# Test route on root path
# Input: None
# Output: List of existing buckets
@app.route('/', methods=['GET'])
def test_function():
    return jsonify(list_existing_buckets())

@app.route('/display', methods=['GET'])
def display_all():
    top_level_folders = list()
    buckets = list_existing_buckets()
    if len(buckets) == 0:
        return jsonify({"error": "No buckets found"})
    else:
        bucket = buckets[0]
        client = boto3.client('s3')
        paginator = client.get_paginator('list_objects')
        result = paginator.paginate(Bucket=bucket, Delimiter='/')
    try:
        for prefix in result.search('CommonPrefixes'):
            top_level_folders.append(prefix.get('Prefix'))
    except Exception as e: 
        return jsonify({"error": f"{str(e)} - No prefixes found, bucket likely empty."})
    return top_level_folders

# Downloads an array of images from s3 bucket and sends them to frontend
# Input: files: Array of files to download
# Output: Zipped up directory containing downloaded files, 
#         Number of files that were not downloaded
@app.route('/download', methods=['POST'])
def download_files():
    data = request.get_json()
    
    if 'files' in data:
        try:
            files_not_found = download_files(data['files'], main_bucket)
            if os.path.exists(download_temp + ".zip"):
                send_file(download_temp + ".zip", as_attachment=True)
                return jsonify({"Files not found": files_not_found})
            else:
                return jsonify({"error": "requested file(s) not found"}), 500
        except Exception as e:
            return jsonify({"error": str(e)}), 500
    else:
        return jsonify({"error": "Incorrect input format"}), 400
    
# Uploads an array of files to the database, works with zip files and directories
# Input: files: Array of files
# Output: Bool
@app.route('/upload', methods=['POST'])
def upload_files():
    
    if 'files' in request.files:
        try:
            files = request.files.getlist('files')
            success = upload_files(files, main_bucket)
            return jsonify(success)
        except Exception as e:
            return jsonify({"error": str(e)}), 500
    else:
        return jsonify({"error": "Incorrect input format"}), 400
## Functions

# Test file, displays an array of all existing buckets
def list_existing_buckets():
    boto3.setup_default_session(profile_name="dev")
    s3_client = boto3.client('s3')
    response = s3_client.list_buckets()

    buckets = list()
    for bucket in response['Buckets']:
        buckets.append(bucket["Name"])
    return buckets

# Accepts an array of files to upload to the 
def upload_files(file_arr, bucket):    
    boto3.setup_default_session(profile_name="dev")
    # s3_client = boto3.client('s3')
    # config = TransferConfig(multipart_threshold=1024*25, max_concurrency=10,
    #                     multipart_chunksize=1024*25, use_threads=True)
    try:
        # if os.path.exists(download_temp + ".zip"): # remove old zip file if it exists
        #     os.remove(download_temp + ".zip")
        zip_buffer = BytesIO()
        zip_file_name = ""
        with ZipFile(zip_buffer, 'w') as zip_file:
            for file in file_arr:
                if file.filename.endswith(".zip"):
                    # s3_client.upload_fileobj(file, bucket, file.filename, Config=config, Callback=ProgressPercentage(file))
                    directory = "./"
                    local_path = os.path.join(directory, file.filename)
                    file.save(local_path)
                    cmd = 'aws s3 cp ' + local_path + ' s3://' + bucket + ' --profile dev --no-parallel'
                    os.system(cmd)
                else:
                    if len(zip_file_name)==0: 
                        zip_file_name = file.filename
                    file_content = file.read()
                    zip_file.writestr(file.filename, file_content)
        if not len(zip_file_name) == 0:
            # s3_client.upload_fileobj(zip_buffer, bucket, zip_file_name+".zip", Config=config, Callback=ProgressPercentage(file))
            directory = "./"
            cmd = 'aws s3 cp ' + directory + ' s3://' + bucket + ' --profile dev'
            os.system(cmd)
    except Exception as e:
        logging.error(e)
        return False
    return True

# Handles uploads when a directory is passed
# def upload_dir(directory, bucket):
#     cmd = 'aws s3 sync ' + directory + ' s3://' + bucket + ' --profile dev'
#     print(cmd)
#     os.system(cmd)

# Downloads a file into the temporary folder download_temp, then zips it up and deletes the original
def download_files(file_arr, bucket):
    boto3.setup_default_session(profile_name='dev')
    s3 = boto3.client('s3')

    if os.path.exists(download_temp): # remove old download file if it exists
        shutil.rmtree(download_temp)
    os.mkdir(download_temp)

    if os.path.exists(download_temp + ".zip"): # remove old zip file if it exists
        os.remove(download_temp + ".zip")

    not_found = 0

    for file in file_arr:
        try:
            s3.download_file(bucket, file, os.path.join(download_temp, file))
        except ClientError as e:
            logging.error(e)
            not_found += 1
    if len([i for i in os.listdir(download_temp)]) > 0:
        shutil.make_archive(download_temp, "zip", download_temp)
    shutil.rmtree(download_temp)
    return not_found


if __name__ == '__main__':
    app.run(debug=True)