from backend import db
from sqlalchemy.dialects.mysql import TEXT, INTEGER
from dataclasses import dataclass
from copy import deepcopy


@dataclass
class User(db.Model):
    id: int
    username: str
    password: str

    __tablename__ = "users"

    id = db.Column(INTEGER, primary_key=True, nullable=False)
    username = db.Column(TEXT, unique=True, nullable=False)
    password = db.Column(TEXT, nullable=False)

    def __repr__(self) -> str:
        return super().__repr__()

    def get_clean_version(self):
        return {'username': self.username}
