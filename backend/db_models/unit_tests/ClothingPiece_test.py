from urllib.parse import urldefrag
from flask_testing import TestCase
from backend import init_app
from backend.db_models.ClothingPiece import ClothingPiece
from unittest.mock import patch, MagicMock

class ClothesTest(TestCase):

    def create_app(self):
        return init_app()

    @patch('backend.db_models.ClothingPiece.url_for')
    def test_get_dict(self, mock_url_for):
        mock_url_for.return_value = 'url for image'

        clth_piece = ClothingPiece()
        clth_piece.id = 1
        clth_piece.user_id = 1
        clth_piece.category_id = 1
        clth_piece.name = 'Koszulek'
        clth_piece.image = 'image'.encode('utf-8')
        clth_piece.clo = 1.0

        with self.app.app_context():
            res = clth_piece.get_dict()

            self.assertEqual(res['id'], clth_piece.id)
            self.assertEqual(res['user_id'], clth_piece.user_id)
            self.assertEqual(res['category_id'], clth_piece.category_id)
            self.assertEqual(res['name'], clth_piece.name)
            self.assertEqual(res['image'], mock_url_for.return_value)
            self.assertEqual(res['clo'], clth_piece.clo)

            mock_url_for.assert_called_once_with('clothing_image', id = clth_piece.id)
        