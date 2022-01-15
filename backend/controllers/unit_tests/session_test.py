from flask_testing import TestCase
from backend import init_app
from backend.controllers.session import *
from unittest.mock import patch, MagicMock

class ClothesTest(TestCase):

    def create_app(self):
        return init_app()

    def test_current_user(self):
        user = current_user()
        self.assertEqual(user.user_id, None)

        user_id = 1
        user.set_current_user_id(user_id)
        self.assertEqual(user.user_id, user_id)

    
    @patch('backend.controllers.session.user_session')
    @patch('backend.controllers.session.check_password_hash')
    @patch('backend.controllers.session.User')
    def test_sign_in(self, mock_user, mock_check_password_hash, mock_user_session):
        # Happy flow
        mock_user.query.filter_by.return_value = MagicMock()
        filter_mock = mock_user.query.filter_by.return_value
        output = MagicMock()
        filter_mock.first.return_value = output
        output.password = 'pwd'
        output.get_clean_version.return_value = 'clean_user'
        output.id = 1
        mock_check_password_hash.return_value = True
        login = 'login'

        with self.app.app_context():
            user = sign_in(login, output.password)

            mock_user.query.filter_by.assert_called_once_with(username = login)
            mock_check_password_hash.assert_called_once_with(output.password, output.password)
            mock_user_session.set_current_user_id.assert_called_once_with(output.id)

            self.assertEqual(user, output.get_clean_version.return_value)

            # Unhappy flow (wrong password)
            mock_check_password_hash.return_value = False
            user = sign_in(login, output.password)
            self.assertEqual(user, None)

            # Unhappy flow (user not found in db)
            mock_check_password_hash.return_value = True
            filter_mock.first.return_value = None
            user = sign_in(login, output.password)
            self.assertEqual(user, None)

    
    @patch('backend.controllers.session.generate_password_hash')
    @patch('backend.controllers.session.db')
    @patch('backend.controllers.session.User')
    def test_sign_up(self, mock_user, mock_db, mock_generate_password_hash):
        # Happy flow
        mock_user.query.filter_by.return_value = MagicMock()
        filter_mock = mock_user.query.filter_by.return_value
        filter_mock.first.return_value = None
        password = 'pwd'
        login = 'login'
        mock_user.return_value = MagicMock()
        new_user = mock_user.return_value
        new_user.get_clean_version.return_value = 'clean_user'
        mock_generate_password_hash.return_value = 'hashed_pwd'

        with self.app.app_context():
            user = sign_up(login, password)
            mock_user.assert_called_once_with(username = login, password = mock_generate_password_hash.return_value)
            mock_generate_password_hash.assert_called_once_with(password)
            mock_db.session.add.assert_called_once()
            mock_db.session.commit.assert_called_once()

            self.assertEqual(user, new_user.get_clean_version.return_value)

        # Unhappy flow (user already in db)
            filter_mock.first.return_value = 'smth'
            user = sign_up(login, password)
            self.assertEqual(user, None)

        # Unhappy flow (login/password empty)
            filter_mock.first.return_value = None
            login = ''
            self.assertEqual(user, None)

            login = 'login'
            pwd = ''
            self.assertEqual(user, None)

    @patch('backend.controllers.session.user_session')
    def test_sign_out(self, mock_user_session):
        with self.app.app_context():
            sign_out()
            mock_user_session.set_current_user_id.assert_called_once_with(None)

        