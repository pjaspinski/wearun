from app import db
from sqlalchemy.dialects.mysql import TEXT, INTEGER
from dataclasses import dataclass


@dataclass
class User(db.Model):
    id: int
    email: str
    password: str

    __tablename__ = "users"

    id = db.Column(INTEGER, primary_key=True, nullable=False)
    email = db.Column(TEXT, unique=True, nullable=False)
    password = db.Column(TEXT, nullable=False)

    def __repr__(self) -> str:
        return super().__repr__()
