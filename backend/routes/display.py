import boto3
from flask import Blueprint, jsonify, request
import logging



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
    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table('test-uploadbase')
    files = list()

    if 'Contents' in response:
        for obj in response['Contents']:
            key = obj['Key']
            if (not key.endswith('.zip')):
                continue
            print(key)
            dynamoResponse = table.get_item(Key={'uploadId': key})
            if 'Item' not in dynamoResponse:
                logging.warning("Item not found")
                continue
            dynamoResponse = dynamoResponse['Item']
            #if not dynamoResponse['validated']:
            #    continue

            item = dict()
            try:
                item['Description'] = dynamoResponse['description']
            except Exception as e:
                logging.warning(e)
                item['Description'] = ""
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

#display nonvalidated files
@bp.route('/display_nonvalidated_files', methods=['GET'])
def display_nonvalidated_files():
    client = boto3.client('s3')
    response = client.list_objects_v2(Bucket = "bucket-for-testing-boto3", MaxKeys = maxKeys)
    return display_nonvalidated_helper(response)

# Internal helper function, accepts a response from list_objects_v2 and returns a list of their characteristics
def display_nonvalidated_helper(response):
    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table('test-uploadbase')
    files = list()

    if 'Contents' in response:
        for obj in response['Contents']:
            key = obj['Key']
            if (not key.endswith('.zip')):
                continue
            
            dynamoResponse = table.get_item(Key={'uploadId': key})
            if 'Item' not in dynamoResponse:
                logging.warning("Item not found")
                continue
            dynamoResponse = dynamoResponse['Item']
            if dynamoResponse['validated']:
               continue

            item = dict()
            try:
                item['Description'] = dynamoResponse['description']
            except Exception as e:
                logging.warning(e)
                item['Description'] = ""
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
# 
#         
# Input: 
# Output: 
@bp.route('/display_my_uploads', methods=['GET'])
def my_uploaded_files():
    username = request.args.get('username')
    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table('test-userbase')
    response = table.get_item(Key={'username': username})
    if 'Item' not in response:
        return jsonify({"error": "User not found or no uploads yet"}), 404
    uploads = response['Item'].get('uploads', [])
    files = []
    for upload_id in uploads:
        s3_client = boto3.client('s3')
        s3_response = s3_client.head_object(Bucket="bucket-for-testing-boto3", Key=upload_id)
        dynamo_response = display_helper({'Contents': [{'Key': upload_id, 'LastModified': s3_response['LastModified'], 'Size': s3_response['ContentLength']}]} )
        files.extend(dynamo_response)
    return jsonify(files)

# 
#         
# Input: 
# Output: 
@bp.route('/display_purchases', methods=['GET'])
def my_purchased_files():
    username = request.args.get('username')
    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table('test-userbase')
    response = table.get_item(Key={'username': username})
    if 'Item' not in response:
        return jsonify({"error": "User not found or no uploads yet"}), 404
    purchases = response['Item'].get('purchases', [])
    files = []
    for upload_id in purchases:
        s3_client = boto3.client('s3')
        s3_response = s3_client.head_object(Bucket="bucket-for-testing-boto3", Key=upload_id)
        dynamo_response = display_helper({'Contents': [{'Key': upload_id, 'LastModified': s3_response['LastModified'], 'Size': s3_response['ContentLength']}]} )
        files.extend(dynamo_response)
    return jsonify(files)
