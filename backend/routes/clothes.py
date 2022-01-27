from flask.helpers import url_for
from werkzeug.utils import send_file
from backend import app
from backend.controllers.clothes import *
from flask import jsonify, Response, request, send_file
from io import BytesIO
import base64
from flask_jwt_extended import jwt_required
from PIL import Image


@app.route('/clothing_categories', methods=['GET'])
@jwt_required()
def clothing_categories():
    try:
        categories = get_clothing_categories()
    except Exception as e:
        return e.args[0], 400
    return jsonify(categories), 200


@app.route('/clothing_piece', methods=['PUT'])
@jwt_required()
def clothing_piece():
    try:
        user_id = request.form['user_id']
        category_id = request.form['category_id']
        name = request.form['name']
        cloForm = request.form['user_id']
        clo = get_clo(cloForm, category_id)
        imageBase64 = request.form['image']
        image_data = base64.b64decode(imageBase64)
        # changing size
        image_thumbnail = Image.open(BytesIO(image_data))
        image_thumbnail.thumbnail((500, 500))
        with BytesIO() as output:
            image_thumbnail.save(output, format='JPEG')
            image = output.getvalue()
        add_clothing_piece(user_id, category_id, name,
                           image, clo)
    except Exception as e:
        return e.args[0], 400
    return Response(status=200)


@app.route('/clothing_category', methods=['GET'])
@jwt_required()
def clothing_category():
    try:
        category_id = request.args.get('category_id')
        assert category_id, 'No category_id param'

        category = get_category(int(category_id))

    except Exception as e:
        return e.args[0], 400

    return jsonify(category), 200


@app.route('/user_clothes', methods=['GET'])
@jwt_required()
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
