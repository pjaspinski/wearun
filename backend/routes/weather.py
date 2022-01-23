from backend import app
from flask import request, Response, jsonify

from backend.propagators.weather import get_weather
from flask_jwt_extended import jwt_required


@app.route('/weather', methods=['GET'])
@jwt_required()
def weather():
    longitude = request.args.get('longitude')
    latitude = request.args.get('latitude')
    weather = get_weather(longitude, latitude)
    if weather is None:
        return Response(status=400)
    else:
        return jsonify(weather), 200
