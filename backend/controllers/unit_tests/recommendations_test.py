from urllib.parse import urldefrag
from flask_testing import TestCase
from backend import init_app
import backend.controllers.recommendations as rec
from unittest.mock import patch, MagicMock

class ClothesTest(TestCase):

    def create_app(self):
        return init_app()

    @patch('backend.controllers.recommendations.db')
    @patch('backend.controllers.recommendations.get_last_recommendation')
    def test_rate_last_recommendation(self, mock_get_last_recommendation, mock_db):
        user_id = 1

        # Unhappy flow (user has no recommendations)
        mock_get_last_recommendation.return_value = None
        self.assertRaises(Exception, rec.rate_last_recommendation, user_id, True)
        mock_get_last_recommendation.assert_called_once_with(user_id)

        # Unhappy flow (last recommendation already rated)
        recommendation = MagicMock()
        recommendation.is_good = True
        mock_get_last_recommendation.return_value = recommendation
        self.assertRaises(Exception, rec.rate_last_recommendation, user_id, True)

        # Happy flow (recommendation too warm)
        recommendation.is_good = None
        rec.rate_last_recommendation(user_id, False, True)
        mock_db.session.commit.assert_called_once()
        self.assertEqual(recommendation.is_good, False)
        self.assertEqual(recommendation.is_too_warm, True)

        # Happy flow (recommendation good)
        recommendation = MagicMock()
        recommendation.is_good = None
        mock_get_last_recommendation.return_value = recommendation
        rec.rate_last_recommendation(user_id, True)
        self.assertEqual(recommendation.is_good, True)
        self.assertNotEqual(recommendation.is_too_warm, True)
        self.assertNotEqual(recommendation.is_too_warm, False)

    @patch('backend.controllers.recommendations.Recommendation')
    def test_get_last_recommendation(self, mock_recommendation):
        user_id = 1

        filter_mock = MagicMock()
        mock_recommendation.query.filter_by.return_value = filter_mock

        mock_recommendation.id.desc.return_value = 'xd'

        order_mock = MagicMock()
        filter_mock.order_by.return_value = order_mock

        order_mock.first.return_value = 'smth'

        rest = rec.get_last_recommendation(user_id)

        mock_recommendation.query.filter_by.assert_called_once_with(user_id = user_id)
        filter_mock.order_by.assert_called_once_with(mock_recommendation.id.desc.return_value)
        order_mock.first.assert_called_once()

        self.assertEqual(rest, order_mock.first.return_value)

    @patch('backend.controllers.recommendations._save_recommendation')
    @patch('backend.controllers.recommendations._pick_bottom')
    @patch('backend.controllers.recommendations._pick_top')
    @patch('backend.controllers.recommendations._calculate_needed_clo')
    @patch('backend.controllers.recommendations.get_weather')
    def test_new_recommendation(self, mock_get_weather, mock_calculate_needed_clo, mock_pick_top, mock_pick_bottom, mock_save_recommendation):
        user_id = 1
        training_type = 'cycling'
        location = {'longitude': 1, 'latitude': 1}
        
        mock_get_weather.return_value = 'weather'
        mock_calculate_needed_clo.return_value = 1.0
        clothing_piece_mock = MagicMock()
        clothing_piece_mock.get_dict.return_value = 'dict'

        # Happy flow
        mock_pick_top.return_value = [clothing_piece_mock]
        mock_pick_bottom.return_value = [clothing_piece_mock]

        recommendation = rec.new_recommendation(user_id, training_type, location)

        mock_get_weather.assert_called_once_with(**location)
        mock_calculate_needed_clo.assert_called_once_with(mock_get_weather.return_value, training_type, user_id)
        mock_pick_top.assert_called_once_with(mock_calculate_needed_clo.return_value, user_id)
        mock_pick_bottom.assert_called_once_with(mock_calculate_needed_clo.return_value, user_id)
        mock_save_recommendation.assert_called_once_with(user_id)

        # Unhappy flow (top is None)
        mock_pick_top.return_value = None
        self.assertRaises(Exception, rec.new_recommendation, user_id, training_type, location)

        # Unhappy flow (bottom is None)
        mock_pick_top.return_value = [clothing_piece_mock]
        mock_pick_bottom.return_value = None
        self.assertRaises(Exception, rec.new_recommendation, user_id, training_type, location)

    @patch('backend.controllers.recommendations._get_opinions_factor')
    def test_calculate_needed_clo(self, mock_get_opinions_factor):
        mock_get_opinions_factor.return_value = 1

        user_id = 1
        training_type = 'running'
        weather = {
            'main': {
                'feels_like': 15,
                'humidity': 20
            },
            'wind': {
                'speed': 10
            }
        }
        
        # Too low hum, running
        res = rec._calculate_needed_clo(weather, training_type, user_id)
        expected_res = (1 - 5 * 0.05 + 10 * 0.04 + 10 * 0.001 + 1) * 1.1
        self.assertEqual(res, expected_res)

        mock_get_opinions_factor.assert_called_once_with(user_id)

        # Too high hum, cycling
        training_type = 'cycling'
        weather['main']['humidity'] = 60
        res = rec._calculate_needed_clo(weather, training_type, user_id)
        expected_res = (1 - 5 * 0.05 + 10 * 0.04 + 10 * 0.001 + 1) * 1.3
        self.assertEqual(res, expected_res)

    def test_get_set_clo(self):
        clth_piece = MagicMock()
        clth_piece.clo = 1
        set = [clth_piece] * 10

        res = rec._get_set_clo(set)

        self.assertEqual(res, 10)

    @patch('backend.controllers.recommendations.Recommendation')
    @patch('backend.controllers.recommendations.db')
    def test_save_recommendation(self, mock_db, mock_recommendation):
        with self.app.app_context():
            user_id = 1
            mock_recommendation.return_value = 'xd'
            rec._save_recommendation(user_id)

            mock_recommendation.assert_called_once_with(user_id = user_id)
            mock_db.session.add.assert_called_once_with('xd')
            mock_db.session.commit.assert_called_once()



    @patch('backend.controllers.recommendations.Recommendation')
    def test_get_opinions_factor(self, mock_recommendation):
        user_id = 1

        filter_mock = MagicMock()
        mock_recommendation.query.filter_by.return_value = filter_mock

        mock_recommendation.id.desc.return_value = 'xd'

        order_mock = MagicMock()
        filter_mock.order_by.return_value = order_mock

        recommendation = MagicMock()
        recommendation.is_good = True
        recommendation2 = MagicMock()
        recommendation2.is_good = False
        recommendation2.is_too_warm = False
        recommendation3 = MagicMock()
        recommendation3.is_good = False
        recommendation3.is_too_warm = True

        order_mock.limit.return_value = [recommendation] * 2 + [recommendation2] * 3 + [recommendation3] * 4
 
        rest = rec._get_opinions_factor(user_id)

        mock_recommendation.query.filter_by.assert_called_once_with(user_id = user_id)
        filter_mock.order_by.assert_called_once_with(mock_recommendation.id.desc.return_value)
        order_mock.limit.assert_called_once_with(10)

        self.assertEqual(round(rest, 5), -0.02)
