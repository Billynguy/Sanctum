import boto3
from flask import Blueprint, jsonify


bp = Blueprint('misc', __name__)
boto3.setup_default_session(profile_name="dev")


# Test route on root path
# Input: None
# Output: List of existing buckets
@bp.route('/', methods=['GET'])
def test_function():
    return jsonify(list_existing_buckets())

# Updates metadata of object
# Input: Bucket, object key, and updated metadata
 # Output: Bool if success
@bp.route('/metadata/<bucket>/<key>/<metadata>', methods=['POST'])
def update_metadata(bucket, key, metadata):
    boto3.setup_default_session(profile_name="dev")
    s3_client = boto3.client('s3')
    s3_client.copy_object(Key=key, Bucket=bucket,
               CopySource={"Bucket": bucket, "Key": key},
               Metadata=metadata,
               MetadataDirective="REPLACE")
    return True

## Functions

# Searches bucket for all matches in search_param, returns a list of all matches
def bucket_search(search_param, bucket):
    client = boto3.client('s3')
    ret = list()
    paginator = client.get_paginator('list_objects_v2')

    page = paginator.paginate(Bucket=bucket)
    objects = page.search(f"Contents[?contains(Key, `{search_param}`)][]")
    for i in objects:
        ret.append(i)
    return ret


# Test method, displays an array of all existing buckets
def list_existing_buckets():
    s3_client = boto3.client('s3')
    response = s3_client.list_buckets()

    buckets = list()
    for bucket in response['Buckets']:
        buckets.append(bucket["Name"])
    return buckets
