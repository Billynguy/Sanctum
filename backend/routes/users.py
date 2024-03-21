import boto3
from flask import Blueprint, request, jsonify



bp = Blueprint('users', __name__)
boto3.setup_default_session(profile_name="dev")

"""
Adds a user to the DynamoDB database.
Input:
    - JSON object in the request body with the following fields:
        - 'username': string, the username of the user to be added
        - 'userType': string, the type of the user to be added
Output:
    - JSON response with the following fields:
        - 'message': string, indicating the status of the operation
            Possible values:
                - 'User added successfully': If the user was added successfully.
        - 'error': string (optional), containing the error message if an error occurred during the operation.
"""
@bp.route('/adduser', methods=['POST'])
def add_user():
    data = request.json
    username = data.get('username')
    userType = data.get('userType')
    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table('test-userbase')
    
    try:
        table.put_item(
            Item={
                'username': username,
                'userType': userType,
                'uploads': [],
                'accessUploads': []
            }
        )
        return jsonify({'message': 'User added successfully'}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500