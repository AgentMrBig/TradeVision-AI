from flask import Blueprint, request, jsonify

mt4_api = Blueprint('mt4_api', __name__)

@mt4_api.route('/mt4data', methods=['POST'])
def receive_mt4_data():
    try:
        # Extract data from the request
        data = request.get_json()

        # Log received data
        print("Received data from MT4 EA:", data)

        # Respond with a success message
        return jsonify({"message": "Data received successfully", "data": data}), 200

    except Exception as e:
        print("Error receiving data:", str(e))
        return jsonify({"message": "Failed to receive data", "error": str(e)}), 400
