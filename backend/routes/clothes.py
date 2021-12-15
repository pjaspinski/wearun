from flask.helpers import url_for
from werkzeug.utils import send_file
from backend import app
from backend.controllers.clothes import *
from flask import jsonify, Response, request, send_file
from operator import itemgetter
from io import BytesIO


@app.route('/clothing_categories', methods=['GET'])
def clothing_categories():
    try:
        categories = get_clothing_categories()
    except Exception as e:
        return e.args[0], 400
    return jsonify(categories), 200


@app.route('/clothing_piece', methods=['PUT'])
def clothing_piece():
    data = request.form
    try:
        user_id, category_id, name, clo = itemgetter(
            'user_id', 'category_id', 'name', 'clo')(data)

        image = request.files['image'].read()
        add_clothing_piece(user_id, category_id, name, image, clo)
    except Exception as e:
        return e.args[0], 400
    return Response(status=200)


@app.route('/user_clothes', methods=['GET'])
def user_clothes():
    try:
        user_id = request.args.get('id')
        assert user_id, 'No user_id param'

        clothes = get_user_clothes(int(user_id))

        for clothing_piece in clothes:
            replace_image_with_url(clothing_piece)
    except Exception as e:
        return e.args[0], 400

    return jsonify(clothes), 200


@app.route('/clothing_image', methods=['GET'])
def clothing_image():
    try:
        id = request.args.get('id')
        assert id, 'No id param'

        image = get_clothing_image(id)

    except Exception as e:
        return e.args[0], 400

    return send_file(BytesIO(image), mimetype='image/jpg', attachment_filename=f'{id}.jpg',), 200
