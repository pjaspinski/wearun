import os
from dotenv import load_dotenv

load_dotenv()


class Config:
    DEBUG = False
    DEVELOPMENT = False
    SQLALCHEMY_DATABASE_URI = f"mysql+mysqldb://{os.getenv('DB_USER')}:{os.getenv('DB_PASS')}@{os.getenv('DB_HOST')}:{os.getenv('DB_PORT')}/{os.getenv('DB_NAME')}"


class DevelopmentConfig(Config):
    DEBUG = True
    DEVELOPMENT = True


class TestingConfig(Config):
    TEST = True
