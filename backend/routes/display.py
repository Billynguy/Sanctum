import boto3
from flask import Blueprint, jsonify
import logging
import datetime



bp = Blueprint('display', __name__)
boto3.setup_default_session(profile_name="dev")
maxKeys = 1000

# Returns a list of the first `maxKeys` files in a bucket, organized in dictionaries containing 
#         the file name, location, type, size, and when it was last modified
# Input: None
# Output: List of files
@bp.route('/display_files', methods=['GET'])
def display_files():
    client = boto3.client('s3')
    response = client.list_objects_v2(Bucket = "bucket-for-testing-boto3", MaxKeys = maxKeys)

    return display_helper(response)


# Displays top level folders with corresponding metadata. Assumes username is appended to front
# Input: None
# Output: List of dictionaries with keyname and metadata. Ex: [{'Key': 'cancer-set', 'Metadata':{'Name':'Bill', 'Age': 14}}, {'Key': 'tumors', 'Metadata':{'Name':'Jack', 'Age': 49}}]
@bp.route('/display_folders', methods=['GET'])
def display_all():
    top_level_folders = list()
    client = boto3.client('s3')
    paginator = client.get_paginator('list_objects')
    result = paginator.paginate(Bucket="bucket-for-testing-boto3", Delimiter='/')
    try:
        for prefix in result.search('CommonPrefixes'):
            key = prefix.get('Prefix').split('-', 1)
            top_level_folders.append(key[1].strip())
    except Exception as e: 
        return jsonify({"error": f"{str(e)} - Either no prefixes found (empty bucket), or incorrect key schema (no username- appended to beginning of key)"})
    return top_level_folders

# Internal helper function, accepts a response from list_objects_v2 and returns a list of their characteristics
def display_helper(response):
    files = list()
    if 'Contents' in response:
        for obj in response['Contents']:
            key = obj['Key']
            if (not key.endswith('.zip')):
                continue

            item = dict()
            try:
                item["Name"] = key[key.find('-') + 1 : key.find('.zip')]
                item["UploadedBy"] = key[:key.find('-')]
            except IndexError as e:
                logging.error(e)
            if 'LastModified' in obj:
                item["LastModified"] = obj["LastModified"]
            else:
                item["LastModified"] = None
            if 'Size' in obj:
                item["Size"] = obj['Size']
            else:
                item["Size"] = 0
            files.append(item)
        return files
    else:
        return jsonify({"error" : "Bucket is empty"}), 500
