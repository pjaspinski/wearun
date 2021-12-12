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
    user = User.query.filter_by(id=user_id).first()

    if user is None:
        raise Exception('User with this id does not exist.')

    return ClothingPiece.query.filter_by(user_id=user_id).all()


def get_clothing_image(id):
    clothing_piece = ClothingPiece.query.filter_by(id=id).first()

    if ClothingPiece is None:
        raise Exception('Clothing piece with this id does not exist.')

    return clothing_piece.image
