from backend import db
from sqlalchemy.dialects.mysql import TEXT, INTEGER
from dataclasses import dataclass


@dataclass
class ClothingCategory(db.Model):
    id: int
    name: str

    __tablename__ = "clothing_categories"

    id = db.Column(INTEGER, primary_key=True, nullable=False)
    name = db.Column(TEXT, unique=True, nullable=False)

    def __repr__(self) -> str:
        return super().__repr__()
