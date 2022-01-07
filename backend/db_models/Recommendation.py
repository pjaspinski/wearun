from backend import db
from sqlalchemy.dialects.mysql import DATETIME, INTEGER, BOOLEAN
from dataclasses import dataclass
from datetime import datetime


@dataclass
class Recommendation(db.Model):
    id: int
    user_id: int
    date: datetime
    is_good: bool
    is_too_warm: bool

    __tablename__ = "recommendations"

    id = db.Column(INTEGER, primary_key=True, nullable=False)
    user_id = db.Column(INTEGER, db.ForeignKey('users.id'), nullable=False)
    date = db.Column(DATETIME, nullable=False, default=datetime.utcnow)
    is_good = db.Column(BOOLEAN, nullable=True, default=None)
    is_too_warm = db.Column(BOOLEAN, nullable=True, default=None)

    def __repr__(self) -> str:
        return super().__repr__()
