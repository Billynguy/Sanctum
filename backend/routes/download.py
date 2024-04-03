import boto3
from flask import Blueprint
from flask import jsonify, request, send_file
import os
import shutil
import logging
from botocore.exceptions import ClientError

bp = Blueprint('download', __name__)
boto3.setup_default_session(profile_name="dev")

download_temp = "Sanctum_Images"
main_bucket = "bucket-for-testing-boto3"

# Downloads an array of images from s3 bucket and sends them to frontend
# Input: files: Array of folders to download
# Output: Zipped up directory containing downloaded folders, 
#         Number of files that were not downloaded
@bp.route('/download', methods=['POST'])
def download_files():
    data = request.get_json()
    
    if 'files' in data:
        try:
            download_zips(data['files'], main_bucket)
            if os.path.exists(download_temp + ".zip"):
                return send_file(download_temp + ".zip", as_attachment=True)
            else:
                return jsonify({"error": "requested file(s) not found"}), 500
        except Exception as e:
            return jsonify({"error": str(e)}), 500
    else:
        return jsonify({"error": "Incorrect input format"}), 400
''' 
# Downloads a file into the temporary folder download_temp, then zips it up and deletes the original
def download_files(file_arr, bucket):
    client = boto3.client('s3')

    if os.path.exists(download_temp): # remove old download file if it exists
        shutil.rmtree(download_temp)
    os.mkdir(download_temp)

    if os.path.exists(download_temp + ".zip"): # remove old zip file if it exists
        os.remove(download_temp + ".zip")

    not_found = 0

    for file in file_arr:
        try:
            client.download_file(bucket, file, os.path.join(download_temp, file))
        except ClientError as e:
            logging.error(e)
            not_found += 1
    if len([i for i in os.listdir(download_temp)]) > 0:
        shutil.make_archive(download_temp, "zip", download_temp)
    shutil.rmtree(download_temp)
    return not_found
'''
# Downloads specified folders into temporary folder download_temp, then zips it up
def download_folders(file_arr, bucket):
    s3 = boto3.resource('s3')
    bucket = s3.Bucket(bucket)

    if os.path.exists(download_temp): # remove old download file if it exists
        shutil.rmtree(download_temp)
    os.mkdir(download_temp)

    if os.path.exists(download_temp + ".zip"): # remove old zip file if it exists
        os.remove(download_temp + ".zip")

    for file in file_arr:
        stripped_filename = file[file.find('-') + 1:]
        subfolder = os.path.join(download_temp, stripped_filename)
        os.mkdir(subfolder)
        for obj in bucket.objects.filter(Prefix=file):
            target = os.path.join(subfolder, os.path.relpath(obj.key, file))
            if not os.path.exists(os.path.dirname(target)):
                os.makedirs(os.path.dirname(target))
            if obj.key[-1] == '/':
                continue
            try:
                bucket.download_file(obj.key, target)
            except Exception as e:
                logging.error(e)
    
    if len([i for i in os.listdir(download_temp)]) > 0:
        shutil.make_archive(download_temp, "zip", download_temp)
    shutil.rmtree(download_temp)

def download_zips(file_arr, bucket):
    s3 = boto3.resource('s3')
    bucket = s3.Bucket(bucket)

    if os.path.exists(download_temp): # remove old download file if it exists
        shutil.rmtree(download_temp)
    os.mkdir(download_temp)

    if os.path.exists(download_temp + ".zip"): # remove old zip file if it exists
        os.remove(download_temp + ".zip")

    for file in file_arr:
        stripped_filename = file[file.find('-') + 1 : file.find('.zip')]
        target = os.path.join(download_temp, stripped_filename)
        for obj in bucket.objects.filter(Prefix=file):
            try:
                bucket.download_file(obj.key, target)
            except Exception as e:
                logging.error(e)
    
    if len([i for i in os.listdir(download_temp)]) > 0:
        shutil.make_archive(download_temp, "zip", download_temp)
    shutil.rmtree(download_temp)

# Example code
#download_zips(["jacqueeeeb-PKG - Biobank_CMB-GEC_v1.zip", "jacqueeeeb-PKG - Osteosarcoma Tumor Assessment.zip"], main_bucket)