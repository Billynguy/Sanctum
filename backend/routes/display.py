import boto3
from flask import Blueprint, jsonify
import datetime



bp = Blueprint('display', __name__)
boto3.setup_default_session(profile_name="dev")

# Returns a list of the first `maxKeys` files in a bucket, organized in dictionaries containing 
#         the file name, location, type, size, and when it was last modified
# Input: None
# Output: List of files
@bp.route('/display_files', methods=['GET'])
def display_files():
    client = boto3.client('s3')
    response = client.list_objects_v2("bucket-for-testing-boto3", 100)

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


# Returns the next `maxKeys` files in the bucket, organized as above
# Input: None
# Output: List of files
@bp.route('/next_page', methods=['GET'])
def next_page():
    global nextContinuationToken
    global isTruncated

    if (not isTruncated):
        return jsonify({"error": "No files to show"}), 400
    
    client = boto3.client('s3')
    response = client.list_objects_v2(Bucket="bucket-for-testing-boto3", MaxKeys=100, ContinuationToken=nextContinuationToken)
    
    return display_helper(response)

# Internal helper function, accepts a response from list_objects_v2 and returns a list of their characteristics
def display_helper(response):
    global isTruncated
    global nextContinuationToken

    isTruncated = response["IsTruncated"]
    if (isTruncated):
        nextContinuationToken = response["NextContinuationToken"]
    else:
        nextContinuationToken = ""
    files = list()
    if 'Contents' in response:
        for obj in response['Contents']:
            fileInfo = obj['Key'].split('/')
            if (fileInfo[0] != 'test_user-28-02-2024-16-29-16'):
                continue
            item = dict()
            try:
                item["Name"] = fileInfo[-1]
                item["Location"] =  '/'.join(fileInfo[:-1])
                item["Type"] = fileInfo[-1].split('.')[1]
            except IndexError:
                item["Name"] = obj['Key']
                item["Location"] = "/"
                item["Type"] = obj['Key'].split('.')[1]
            if 'LastModified' in obj:
                item["LastModified"] = obj["LastModified"]
            else:
                item["LastModified"] = None
            if 'Size' in obj:
                item["Size"] = obj['Size']
            else:
                item["Size"] = 0

            # for experimental file storage system
            try:
                extraInfo = fileInfo[0].split('-')
                item["UploadedBy"] = extraInfo[0]
                item["UploadedOn"] = datetime.datetime.strptime('-'.join(extraInfo[1:]), datetime_format)
            except Exception:
                print('failed')
            files.append(item)
        print(files)
        return files
    else:
        return jsonify({"error" : "Bucket is empty"}), 500