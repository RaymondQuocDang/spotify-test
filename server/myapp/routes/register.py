from flask import Blueprint, request, jsonify

bp = Blueprint('register', __name__)  # define a Flask Blueprint named 'register'

@bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()

    email = data.get('email')
    userName = data.get('userName')
    password = data.get('password')

    # Print out the received data
    print(f"Email: {email}, Username: {userName}, Password: {password}")

    return jsonify(message="Data received successfully"), 201
