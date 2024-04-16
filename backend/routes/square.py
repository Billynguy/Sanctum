from square.client import Client # type: ignore
import uuid
import boto3
import logging
from flask import Blueprint, request, jsonify

bp = Blueprint('square', __name__)
boto3.setup_default_session(profile_name="dev")

# Pay cuts, in percentages
validator_cut = 0.10
uploader_cut = 0.70

client = Client(
    access_token='EAAAl_ibcO7Hs3BkFIZEyHtiJSOGZKd8QXLK6JNfjeqfrKvY_RKK0jDQ-i1lYUhG',
    environment='sandbox'
)

payments_api = client.payments
dynamodb = boto3.resource('dynamodb')

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
            table = dynamodb.Table('test-uploadbase')
            dynamoResponse = table.get_item(Key={'uploadId': productId})

            if 'Item' not in dynamoResponse:
                raise ValueError("Item not found")
            price = int(dynamoResponse['Item']['price'])
            
            result = payments_api.create_payment(
                body={
                    'idempotency_key': idempotency_key,
                    'source_id': source_id,
                    'amount_money': {
                        'amount': price,
                        'currency': 'USD'
                    }
                }
            )

            # Pay the Uploader
            name = productId.split('-')[0]
            payment = price * uploader_cut
            addToWallet(payment, name)

            # Pay the Validator
            name = dynamoResponse['Item'].get('validator', {})
            payment = price * validator_cut
            print(payment)
            addToWallet(payment, name)

            return jsonify(result.body), 200
        except Exception as e:
            logging.warning(e)
            return 'Internal Server Error', 500
    else:
        return 'Method Not Allowed', 400
  
def addToWallet(amount, username):
    table = dynamodb.Table('test-userbase')
    try:
        response = table.get_item(Key={'username': username}, ProjectionExpression='wallet')
        if 'Item' in response:
            attribute_value = response['Item'].get('wallet', {})
            table.update_item(Key={'username': username}, UpdateExpression="SET wallet = :val", ExpressionAttributeValues={':val': attribute_value + int(amount)})
            logging.info('Successfully updated')
    except Exception as e:
        logging.error(e)