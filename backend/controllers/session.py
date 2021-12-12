from backend import db
from backend.db_models.User import User
from werkzeug.security import generate_password_hash, check_password_hash


class current_user:
    def __init__(self):
        self.user_id = None

    def set_current_user_id(self, given_id):
        self.user_id = given_id


user_session = current_user()


def sign_in(login, given_password):
    found_user = User.query.filter_by(username=login).first()
    if found_user is not None and check_password_hash(found_user.password, given_password):
        user_session.set_current_user_id(found_user.id)
        return found_user.get_clean_version()  # Pomyslne logowanie
    else:
        return None  # Logowanie nie powiodlo sie, niepoprawna nazwa uzytkownika lub haslo


def sign_up(login, user_password):
    username_check = User.query.filter_by(username=login).first()
    if username_check is None and login != "" and user_password != "":
        new_user = User(
            username=login, password=generate_password_hash(user_password))
        db.session.add(new_user)
        db.session.commit()
        return new_user.get_clean_version()  # rejestracja pomyslna
    else:
        return None  # nazwa uzytkownika zajeta lub dane niepoprawne


def sign_out():
    user_session.set_current_user_id(None)
