from backend import db
from sqlalchemy.dialects.mysql import TEXT, INTEGER, MEDIUMBLOB, DECIMAL
from dataclasses import dataclass
from flask.helpers import url_for

@dataclass
class ClothingPiece(db.Model):
    id: int
    user_id: int
    category_id: int
    name: str
    image: bytes
    clo: float

    __tablename__ = "clothes"

    id = db.Column(INTEGER, primary_key=True, nullable=False)
    user_id = db.Column(INTEGER, db.ForeignKey('users.id'), nullable=False)
    category_id = db.Column(INTEGER, db.ForeignKey(
        'clothing_categories.id'), nullable=False)
    name = db.Column(TEXT, nullable=False)
    # MEDIUMBLOB can take up to 16 Mb, which is reasonable for an image
    image = db.Column(MEDIUMBLOB, nullable=False)
    clo = db.Column(DECIMAL, nullable=False)

    def __repr__(self) -> str:
        return super().__repr__()

    def get_dict(self) -> dict:
        return {
            'id': self.id,
            'user_id': self.user_id,
            'category_id': self.category_id,
            'name': self.name,
            'clo': self.clo,
            'image': url_for('clothing_image', id=self.id)
        }
