import boto3
from flask import Blueprint, request, jsonify


bp = Blueprint('users', __name__)
boto3.setup_default_session(profile_name="dev")

"""
Adds a user to database.
Input:  
        {
            'username': username
            'userType': userType
        }
Output:
        {
            'message/error': string
        }
        HTTP Response Code   
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