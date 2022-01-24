import requests
import os


def get_weather(longitude, latitude):
    params = {
        'lat': latitude,
        'lon': longitude,
        'appid': os.getenv('OPEN_WEATHER_API_KEY'),
        'units': 'metric'
    }
    res = requests.get(
        'https://api.openweathermap.org/data/2.5/weather', params=params)

    if res.status_code == 200:
        data = res.json()
        data['icon_url'] = f"https://openweathermap.org/img/wn/{data['weather'][0]['icon']}@4x.png"
        return data
    return None
