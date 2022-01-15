from flask.helpers import url_for
from backend.db_models.User import User
from backend.db_models.ClothingPiece import ClothingPiece
from backend.db_models.ClothingCategory import ClothingCategory
from backend import db


def get_clothing_categories(): 
    return ClothingCategory.query.all()


def add_clothing_piece(user_id, category_id, name, image, clo):
    item = ClothingPiece(
        user_id=user_id, category_id=category_id, name=name, image=image, clo=clo)

    db.session.add(item)
    db.session.commit()


def get_user_clothes(user_id):
    return ClothingPiece.query.filter_by(user_id=user_id).all()


def get_category(category_id):
    return ClothingCategory.query.filter_by(id=category_id).first()


def get_clothing_image(id):
    clothing_piece = ClothingPiece.query.filter_by(id=id).first()

    if clothing_piece is None:
        raise Exception('Clothing piece with this id does not exist.')

    return clothing_piece.image


def get_user_clothes_per_category(user_id, category_id):
    return ClothingPiece.query.filter_by(user_id=user_id, category_id=category_id).all()


def get_clothing_categories_per_type():
    return ClothingCategory.query.group_by('type').all()


def replace_image_with_url(clothing_piece):
    clothing_piece.image = url_for('clothing_image', id=clothing_piece.id)
