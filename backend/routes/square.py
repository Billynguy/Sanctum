from square.client import Client # type: ignore
import uuid
import boto3
import logging
from flask import Blueprint, request, jsonify

bp = Blueprint('square', __name__)
boto3.setup_default_session(profile_name="dev")

client = Client(
    access_token='EAAAl_ibcO7Hs3BkFIZEyHtiJSOGZKd8QXLK6JNfjeqfrKvY_RKK0jDQ-i1lYUhG',
    environment='sandbox'
)

payments_api = client.payments
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('test-uploadbase')

# Handles the Square payment requests by the frontend
# Input: sourceId (square internal object), productId (identifies what product is purchased for pricing)
# Output: Success value and amount paid
@bp.route('/payment', methods=["POST"])
def handle_payment():
    if request.method == 'POST':
        idempotency_key = str(uuid.uuid4())
        source_id = request.json.get('sourceId')
        productId = request.json.get('productId')

        try:
            dynamoResponse = table.get_item(Key={'uploadId': productId})

            if 'Item' not in dynamoResponse:
                raise ValueError("Item not found")
            price = dynamoResponse['Item']['price']
            
            result = payments_api.create_payment(
                body={
                    'idempotency_key': idempotency_key,
                    'source_id': source_id,
                    'amount_money': {
                        'amount': int(price),
                        'currency': 'USD'
                    }
                }
            )

            return jsonify(result.body), 200
        except Exception as e:
            logging.warning(e)
            return 'Internal Server Error', 500
    else:
        return 'Method Not Allowed', 400