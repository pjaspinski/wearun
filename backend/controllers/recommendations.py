from backend.db_models.User import User
from .clothes import get_user_clothes
from backend.propagators.weather import get_weather

BASE_TEMPERATURE = 11

GOOD_HUMIDITY = (30, 50)

# Added/substracted clo for every Celcius degree above/below 21
TEMPERATURE_FACTOR = 0.1
WIND_FACTOR = 0.1  # Added clo for every km/h of rain
HUMIDITY_FACTOR = 0.05  # Added clo for every % above 50% or below 30%

CYCLING_MULTIPLIER = 1.3  # Multiplier used if discipline is cycling
RUNNING_MULTIPLIER = 1.1  # Multiplier used if discipline is running


def get_recommendation(user_id, training_type):
    user_clothes = get_user_clothes(user_id)
    weather = get_weather()

    needed_clo = _calculate_needed_clo(weather, training_type)


def _calculate_needed_clo(weather, training_type):
    clo = 1.0

    # temperature
    temp = weather['main']['feels_like']
    temp_diff = temp - BASE_TEMPERATURE
    clo += temp_diff * TEMPERATURE_FACTOR

    # wind
    wind_speed = weather['wind']['speed']
    clo += wind_speed * WIND_FACTOR

    # humidity
    humidity = weather['main']['humidity']
    hum_diff = 0
    if humidity < GOOD_HUMIDITY[0]:
        humidity = GOOD_HUMIDITY[0] - humidity
    elif humidity > GOOD_HUMIDITY[1]:
        humidity = humidity - GOOD_HUMIDITY[1]

    clo += hum_diff * HUMIDITY_FACTOR

    # training type
    if training_type == 'cycling':
        return clo * CYCLING_MULTIPLIER
    else:
        return clo * RUNNING_MULTIPLIER
