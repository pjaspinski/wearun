from backend import app
from flask import request, jsonify, Response
from backend.controllers.recommendations import rate_last_recommendation, new_recommendation, get_last_recommendation
from flask_jwt_extended import jwt_required


@app.route('/new_recommendation', methods={'GET'})
@jwt_required()
def _new_recommendation():
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

        recommendation = new_recommendation(
            user_id, training_type, {'latitude': latitude, 'longitude': longitude})

    except Exception as e:
        return e.args[0], 400

    return jsonify(recommendation), 200


@app.route('/last_recommendation', methods=['GET', 'POST'])
@jwt_required()
def _last_recommendation():
    try:
        if request.method == 'GET':
            user_id = int(request.args['user_id'])
            assert user_id, 'No user_id param'

            recommendation = get_last_recommendation(user_id)

            return jsonify(recommendation), 200

        if request.method == 'POST':
            data = request.json
            user_id = data['user_id']
            is_good = data['is_good']

            if is_good is False:
                is_too_warm = data['is_too_warm']
                rate_last_recommendation(user_id, is_good, is_too_warm)

            else:
                rate_last_recommendation(user_id, is_good)

            return Response(status=200)

    except Exception as e:
        return e.args[0], 400
