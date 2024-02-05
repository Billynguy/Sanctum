import boto3
import logging
import os
from botocore.exceptions import ClientError

bucket_name_1 = "bucket-for-testing-boto3"

def list_existing_buckets():
    s3 = boto3.client('s3')
    response = s3.list_buckets()

    print('Existing Buckets:')
    for bucket in response['Buckets']:
        print(f'    {bucket["Name"]}')

def create_bucket(bucket_name, region=None):
    try:
        if region is None:
            s3_client = boto3.client('s3')
            s3_client.create_bucket(Bucket=bucket_name)
        else:
            s3_client = boto3.client('s3', region_name=region)
            location = {'LocationContraint': region}
            s3_client.create_bucket(Bucket=bucket_name, CreateBucketConfiguration=location)
    
    except ClientError as e:
        logging.error(e)
        return False
    return True

def upload_file(file_name, bucket, object_name=None):
    # if the object name is not specified, use the file name
    if object_name is None:
        object_name = os.path.basename(file_name)
    
    boto3.setup_default_session(profile_name='dev')
    s3_client = boto3.client('s3')
    try:
        response = s3_client.upload_file(file_name, bucket, object_name)
    except ClientError as e:
        logging.error(e)
        return False
    return True

def upload_batch_files(directory, bucket):
    # Accepts a directory name rather than a single file name
    # Needs tagging functionality
    # Only removes directories from the folder, does not check if file is a valid image
    onlyfiles = [f for f in os.listdir(directory) if not os.path.isdir(f)]
    output = list()
    for f in onlyfiles:
        output.append(upload_file(os.path.join(directory, f), bucket=bucket))
    
    if output.count(False > 0):
        return False
    return True

def download_file(file_name, bucket):
    boto3.setup_default_session(profile_name='dev')
    s3 = boto3.client('s3')
    s3.download_file(bucket, file_name, file_name)

download_file('cat_image.avif', bucket_name_1)
