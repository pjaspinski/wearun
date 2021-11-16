class Config:
    DEBUG = False
    DEVELOPMENT = False
    SQLALCHEMY_DATABASE_URI = 'postgresql+psycopg2://chmurki-postgressql.postgres.database.azure.com:5432/postgres?user=chmurki_adm@chmurki-postgressql&password={systemy123!}&sslmode=require'


class DevelopmentConfig(Config):
    DEBUG = True
    DEVELOPMENT = True


class TestingConfig(Config):
    TEST = True
