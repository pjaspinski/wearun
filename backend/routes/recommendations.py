from backend import app
from flask import request, jsonify
from backend.controllers.recommendations import get_recommendation


@app.route('/recommendation', methods={'GET'})
def recommendation():
    try:
        user_id = int(request.args['user_id'])
        assert user_id, 'No user_id param'
        training_type = request.args['training_type']
        assert training_type, 'No training_type param'
        latitude = request.args['latitude']
        assert latitude, 'No latitude param'
        longitude = request.args['longitude']
        assert longitude, 'No longitude param'

        if training_type not in ['cycling', 'running']:
            raise Exception('Training type not supported.')

        recommendation = get_recommendation(
            user_id, training_type, {'latitude': latitude, 'longitude': longitude})

    except Exception as e:
        return e.args[0], 400

    return jsonify(recommendation), 200
