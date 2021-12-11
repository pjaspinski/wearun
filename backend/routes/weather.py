from backend import app
from flask import request, Response, jsonify

from backend.propagators.weather import get_weather


@app.route('/weather', methods=['GET'])
def weather():
    longitude = request.args.get('longitude')
    latitude = request.args.get('latitude')
    weather = get_weather(longitude, latitude)
    if weather is None:
        return Response(status=400)
    else:
        return jsonify(weather), 200
