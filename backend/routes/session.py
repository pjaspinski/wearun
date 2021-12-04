from app import app
from flask import request, Response

from controllers.session import sign_in, sign_up


@app.route("/")
def home():
    return 'Hello Wearun!'


@app.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data['email']
    password = data['password']
    result = sign_in(email, password)
    return Response(status=200) if result else Response(status=400)


@app.route('/register', methods=['POST'])
def register():
    data = request.json
    email = data['email']
    password = data['password']
    result = sign_up(email, password)
    return Response(status=200) if result else Response(status=400)
