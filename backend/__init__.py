from flask import Flask
from backend.db_config import Config
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from dotenv import load_dotenv
import os

load_dotenv()
db = SQLAlchemy()


def init_app():
    app = Flask(__name__)
    app.config.from_object(Config())
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True
    app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY')
    app.config['JWT_ACCESS_TOKEN_EXPIRES'] = 86400
    jwt = JWTManager(app)

    db.init_app(app)

    with app.app_context():
        db.create_all()
        return app


app = init_app()

# It's important that all routes are imported here.
# Don't let your formatter move these imports to the top of the file!
# Try Ctrl+Shift+P > File: Save without formatting

from backend.routes import (session, weather, clothes, recommendations)