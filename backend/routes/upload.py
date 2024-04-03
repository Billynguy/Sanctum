import boto3
import os
import shutil
import logging
from zipfile import ZipFile
from io import BytesIO
from flask import Blueprint, request, jsonify
import datetime
import json


bp = Blueprint('upload', __name__)
boto3.setup_default_session(profile_name="dev")

datetime_format = "%d-%m-%Y-%H-%M-%S"
upload_temp = "upload_temp"

# Uploads an array of files to the database, works with zip files and directories
# Input: 'files': Array of files, 'metadata': List of metadata for each file. Ex: [{"Name: Bob", "Age: 14"}, {"Name: Sally", "Age: 27"}]
# Output: Bool
@bp.route('/upload', methods=['POST'])
def upload():
    if 'files' in request.files and 'user' in request.form:
        try:
            time = datetime.datetime.now().strftime(datetime_format)
            files = request.files.getlist('files')
            metadata_json = request.form['metadata']
            metadata = json.loads(metadata_json)
            upload_metadata(metadata, time)
            user = request.form['user']
        except Exception as e:
            print("Metadata error")
            logging.error(e)
            return jsonify({"error": str(e)}), 500
        try:
            success = upload_zips(files, user, "bucket-for-testing-boto3")
            if (success):
                return jsonify("File uploaded successfully")
            else:
                return jsonify("Error uploading file"), 500
        except Exception as e:
            print("File upload error")
            logging.error(e)
            return jsonify({"error": str(e)}), 500
    else:
        print("Input error")
        logging.error(e)
        return jsonify({"error": "Incorrect input format"}), 400
    
def upload_zips(file_arr, user, bucket):
    client = boto3.client('s3')
    if os.path.exists(upload_temp): # remove old download file if it exists
        shutil.rmtree(upload_temp)
    os.mkdir(upload_temp)
    try:
        for file in file_arr:
            filename = user + '-' + file.filename
            if (file.filename.endswith(".zip")):
                file.save(os.path.join(upload_temp, filename))
            updateUserUploads(user, file.filename)
        if (os.path.exists(upload_temp)):
            for _, _, files in os.walk(upload_temp):
                for file in files:
                    client.upload_file(os.path.join(upload_temp, file), bucket, file)
            shutil.rmtree(upload_temp)
    except Exception as e:
        logging.error(e)
        return False
    return True
    
# Accepts an array of files to upload to the s3 bucket, generates a folder automatically
def upload_files(file_arr, user, bucket):
    if os.path.exists(upload_temp): # remove old download file if it exists
        shutil.rmtree(upload_temp)
    os.mkdir(upload_temp)
    try:
        for file in file_arr:
            if (file.filename.endswith(".zip")):
                unzip_files(file, upload_temp)
            else:
                file.save(os.path.join(upload_temp, file.filename))
            updateUserUploads(user, file.filename)
        if (os.path.exists(upload_temp)):
            for _, dirs, _ in os.walk(upload_temp):
                for dir in dirs:
                    upload_dir(os.path.join(upload_temp, dir), user, bucket)
                break #only want to traverse to top level folder
            shutil.rmtree(upload_temp)
    except Exception as e:
        logging.error(e)
        return False
    return True

# Handles uploads when a directory is passed
def upload_dir(directory, user, bucket):
    filename = user + '-' + directory.split(os.path.sep)[1]
    cmd = 'aws s3 cp \"' + directory + '\" \"s3://' + bucket + '/' + filename + '\" --profile dev --recursive'
    os.system(cmd)


# Internal function that handles zip files. Uses temporary folder zip_temp
def unzip_files(file_name, upload_temp):
    file_bytes = file_name.read()
    file_like_object = BytesIO(file_bytes)
    with ZipFile(file_like_object, 'r') as zip_ref:
        zip_ref.extractall(upload_temp)

"""
    Adds an upload's metadata to database
    Input:
            {
                'uploadId': string
                'uploadedBy': string
                'uploadedDate': string
                'name': string
                'validated': boolean
                'format': string
                'size': integer
                'ageRange': [minAge, maxAge]
                'race': object
                'sex': object
                'subtype': string
                'morphologic': string
                'stage': string
                'grade': string
                'treatment': string
                'survival': string
            }
    Output: 
"""
def upload_metadata(formData, time):
    uploadId = formData.get('user', '') + " - " + time
    uploadedBy = formData.get('user', '')
    uploadedDate = time
    name = formData.get('name', '')
    validated = False
    format = formData.get('type', '')
    size = formData.get('size', '')
    ageRange = formData.get('age', [0, 0])
    race = formData.get('race', {})
    sex = formData.get('sex', {})
    subtype = formData.get('subtype', '')
    morphologic = formData.get('morphologic', '')
    stage = formData.get('stage', '')
    grade = formData.get('grade', '')
    treatment = formData.get('treatment', '')
    survival = formData.get('survival', '')
    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table('test-uploadbase')
    try:
        table.put_item(
            Item={
                'uploadId': uploadId,
                'uploadedBy': uploadedBy,
                'uploadedDate': uploadedDate,
                'name': name,
                'validated': validated,
                'format': format,
                'size': size,
                'ageRange': ageRange,
                'race': race,
                'sex': sex,
                'subtype': subtype,
                'morphologic': morphologic,
                'stage': stage,
                'grade': grade,
                'treatment': treatment,
                'survival': survival
            }
        )
        return 
    except Exception as e:
        logging.error(e)
        return jsonify({'error': str(e)}), 500

def updateUserUploads(username, filename):
    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table('test-userbase')

    try:
        table.update_item(Key={'username': username}, UpdateExpression="SET uploads = list_append(uploads, :i)", ExpressionAttributeValues={':i': [filename],})
        return jsonify({'message: successfully updated'}),200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

