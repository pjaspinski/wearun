from flask_testing import TestCase
from backend import init_app
from backend.controllers.clothes import *
from unittest.mock import patch, MagicMock

class ClothesTest(TestCase):

    def create_app(self):
        return init_app()

    @patch('backend.controllers.clothes.ClothingCategory')
    def test_get_clothing_categories(self, mock_clothing_category):
        output = 'smth'
        mock_clothing_category.query.all.return_value = output
        with self.app.app_context():
            res = get_clothing_categories()

            mock_clothing_category.query.all.assert_called_once()

            self.assertEqual(output, res)
            

    @patch('backend.controllers.clothes.db')
    def test_add_clothing_piece(self, mock_db):
        args = {
        "user_id": 1,
        "category_id": 1,
        "name": 'Koszulek',
        "image": 'obrazek'.encode('utf-8'),
        "clo": 0.1
        } 
        with self.app.app_context():
            add_clothing_piece(**args)

            mock_db.session.add.assert_called_once()

            clothing_piece = mock_db.session.add.call_args[0][0]
            for key, value in args.items():
                self.assertEqual(value, getattr(clothing_piece, key))

            mock_db.session.commit.assert_called_once()

    
    @patch('backend.controllers.clothes.ClothingPiece')
    def test_get_user_clothes(self, mock_clothing_piece):
        mock_clothing_piece.query.filter_by.return_value = MagicMock()
        filter_mock = mock_clothing_piece.query.filter_by.return_value
        output = 'smth'
        filter_mock.all.return_value = output
        user_id = 1

        with self.app.app_context():
            res = get_user_clothes(user_id)
            
            mock_clothing_piece.query.filter_by.assert_called_once_with(user_id = user_id)
            filter_mock.all.assert_called_once()

            self.assertEqual(res, output)


    @patch('backend.controllers.clothes.ClothingCategory')
    def test_get_category(self, mock_clothing_category):
        mock_clothing_category.query.filter_by.return_value = MagicMock()
        filter_mock = mock_clothing_category.query.filter_by.return_value
        output = 'smth'
        filter_mock.first.return_value = output
        category_id = 1

        with self.app.app_context():
            res = get_category(category_id)
            
            mock_clothing_category.query.filter_by.assert_called_once_with(id = category_id)
            filter_mock.first.assert_called_once()

            self.assertEqual(res, output)

    
    @patch('backend.controllers.clothes.ClothingPiece')
    def test_get_clothing_image(self, mock_clothing_piece):
        mock_clothing_piece.query.filter_by.return_value = MagicMock()
        filter_mock = mock_clothing_piece.query.filter_by.return_value
        output = MagicMock()
        filter_mock.first.return_value = output
        clothing_piece_id = 1

        with self.app.app_context():
            # Happy flow
            res = get_clothing_image(clothing_piece_id)
            
            mock_clothing_piece.query.filter_by.assert_called_once_with(id = clothing_piece_id)
            filter_mock.first.assert_called_once()

            self.assertEqual(res, output.image)

            # Unhappy flow (clothing piece not in db)
            filter_mock.first.return_value = None
            self.assertRaises(Exception, get_clothing_image, clothing_piece_id)


    @patch('backend.controllers.clothes.ClothingPiece')
    def test_get_user_clothes_per_category(self, mock_clothing_piece):
        mock_clothing_piece.query.filter_by.return_value = MagicMock()
        filter_mock = mock_clothing_piece.query.filter_by.return_value
        output = 'smth'
        filter_mock.all.return_value = output
        user_id = 1
        category_id = 1

        with self.app.app_context():
            res = get_user_clothes_per_category(user_id, category_id)
            
            mock_clothing_piece.query.filter_by.assert_called_once_with(user_id = user_id, category_id = category_id)
            filter_mock.all.assert_called_once()

            self.assertEqual(res, output)


    @patch('backend.controllers.clothes.ClothingCategory')
    def test_get_clothing_categories_per_type(self, mock_clothing_category):
        mock_clothing_category.query.group_by.return_value = MagicMock()
        group_mock = mock_clothing_category.query.group_by.return_value
        output = 'smth'
        group_mock.all.return_value = output

        with self.app.app_context():
            res = get_clothing_categories_per_type()

            mock_clothing_category.query.group_by.assert_called_once_with('type')
            group_mock.all.assert_called_once()

            self.assertEqual(output, res)


    @patch('backend.controllers.clothes.url_for')
    def test_replace_image_with_url(self, mock_url_for):
        output = 'url to image'
        mock_url_for.return_value = output

        clothing_piece = MagicMock()
        clothing_piece.image = 'image'
        clothing_piece.id = 1

        with self.app.app_context():
            replace_image_with_url(clothing_piece)

            mock_url_for.assert_called_once_with('clothing_image', id = clothing_piece.id)

            self.assertEqual(clothing_piece.image, output)