import boto3
import os
import shutil
import logging
from zipfile import ZipFile
from io import BytesIO
from flask import Blueprint, request, jsonify
import datetime


bp = Blueprint('upload', __name__)
boto3.setup_default_session(profile_name="dev")

datetime_format = "%d-%m-%Y-%H-%M-%S"

# Uploads an array of files to the database, works with zip files and directories
# Input: 'files': Array of files, 'metadata': List of metadata for each file. Ex: [{"Name: Bob", "Age: 14"}, {"Name: Sally", "Age: 27"}]
# Output: Bool
@bp.route('/upload', methods=['POST'])
def upload():
    print(request.form)
    if 'files' in request.files and 'user' in request.form:
        try:
            time = datetime.datetime.now().strftime(datetime_format)
            files = request.files.getlist('files')
            upload_metadata(request.form, time)
            user = request.form['user']
            success = upload_files(files, user, "bucket-for-testing-boto3", time)
            return jsonify(success)
        except Exception as e:
            return jsonify({"error": str(e)}), 500
    else:
        return jsonify({"error": "Incorrect input format"}), 400
    
# Accepts an array of files to upload to the s3 bucket, generates a folder automatically
def upload_files(file_arr, user, bucket, time):
    upload_temp = user + "-" + time
    os.mkdir(upload_temp)
    try:
        for file in file_arr:
            if file.filename.endswith(".zip"):
                unzip_files(file, user, upload_temp)
            else:
                file.save(os.path.join(upload_temp, file.filename))
        if (os.path.exists(upload_temp)):
            upload_dir(upload_temp, bucket)
            shutil.rmtree(upload_temp)
    except Exception as e:
        logging.error(e)
        return False
    return True

# Handles uploads when a directory is passed
def upload_dir(directory, bucket):
    cmd = 'aws s3 cp ' + directory + ' s3://' + bucket + '/' + directory + ' --profile dev --recursive'
    print(cmd)
    os.system(cmd)


# Internal function that handles zip files. Uses temporary folder zip_temp
def unzip_files(file_name, user, upload_temp):
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
    Output: Boolean success value
"""
def upload_metadata(formData, time):
    uploadedId = ''
    uploadedBy = formData['user']
    uploadedDate = time
    name = formData['name']
    validated = False
    format = formData['type']
    size = formData['size']
    ageRange = formData['age']
    race = formData['race']
    sex = formData['sex']
    subtype = formData['subtype']
    morphologic = formData['morphologic']
    stage = formData['stage']
    grade = formData['grade']
    treatment = formData['treatment']
    survival = formData['survival']
    
    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table('test-userbase')
    
    try:
        table.put_item(
            Item={
                'uploadedId': uploadedId,
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
        return jsonify({'message': 'Upload added successfully'}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

