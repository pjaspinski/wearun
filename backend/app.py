from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from backend.db_config import DevelopmentConfig

app = Flask(__name__)
app.config.from_object(DevelopmentConfig())
db = SQLAlchemy(app)


@app.route("/")
def home():
    return 'Hello Flask'
