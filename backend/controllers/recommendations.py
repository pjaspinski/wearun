from .clothes import get_user_clothes_per_category, replace_image_with_url
from backend.propagators.weather import get_weather

# Temperature with 1 clo.
BASE_TEMPERATURE = 10

# Interval of acceptable humidity (inside this interval no points are substracted)
GOOD_HUMIDITY = (30, 50)

# Acceptable difference between target and result clo (separate for top and bottom)
ACCEPTABLE_TOP_DIFF = 0.5
ACCEPTABLE_BOTTOM_DIFF = 0.8

# Added/substracted clo for every Celcius degree above/below base temp
TEMPERATURE_FACTOR = 0.07
WIND_FACTOR = 0.04  # Added clo for every km/h of wind
HUMIDITY_FACTOR = 0.001  # Added clo for every % above 50% or below 30%

CYCLING_MULTIPLIER = 1.3  # Multiplier used if discipline is cycling
RUNNING_MULTIPLIER = 1.1  # Multiplier used if discipline is running


def get_recommendation(user_id, training_type, location):
    weather = get_weather(**location)

    needed_clo = _calculate_needed_clo(weather, training_type)

    top = _pick_top(needed_clo, user_id)
    if top is None:
        raise Exception(
            'Not enough clothes to make a precise top recommendation.')

    bottom = _pick_bottom(needed_clo, user_id)
    if bottom is None:
        raise Exception(
            'Not enough clothes to make a precise bottom recommendation.')

    _replace_set_images_with_urls(top)
    _replace_set_images_with_urls(bottom)
    return {'top': top, 'bottom': bottom}


def _calculate_needed_clo(weather, training_type):
    clo = 1.0

    # temperature
    temp = weather['main']['feels_like']
    temp_diff = temp - BASE_TEMPERATURE
    clo += -temp_diff * TEMPERATURE_FACTOR

    # wind
    wind_speed = weather['wind']['speed']
    clo += wind_speed * WIND_FACTOR

    # humidity
    humidity = weather['main']['humidity']
    hum_diff = 0
    if humidity < GOOD_HUMIDITY[0]:
        hum_diff = GOOD_HUMIDITY[0] - humidity
    elif humidity > GOOD_HUMIDITY[1]:
        hum_diff = humidity - GOOD_HUMIDITY[1]

    clo += hum_diff * HUMIDITY_FACTOR

    # training type
    if training_type == 'cycling':
        return clo * CYCLING_MULTIPLIER
    else:
        return clo * RUNNING_MULTIPLIER


def _pick_top(needed_clo, user_id):

    sets = []
    checking_order = [1, 2, 3]
    clothing_categories = [get_user_clothes_per_category(
        user_id, category) for category in checking_order]

    _check_set_dfs(0, 0, [], clothing_categories,
                   needed_clo, sets, ACCEPTABLE_TOP_DIFF)

    # If algorithm was unable to find any sets, then just return None
    if len(sets) == 0:
        return None

    # If only one set was found, then just return it
    if len(sets) == 1:
        return sets[0]

    # If there are more then find the best one and return it
    return _pick_best_set(sets, needed_clo)


def _pick_bottom(needed_clo, user_id):
    combinations = [
        [4],  # same spodenki
        [6, 4],  # same getry + ewentualnie spodenki
        [5, 6],  # same dresy + ewentualnie getry
    ]

    sets = []

    for combination in combinations:

        clothing_categories = [get_user_clothes_per_category(
            user_id, category) for category in combination]

        _check_set_dfs(0, 0, [], clothing_categories,
                       needed_clo, sets, ACCEPTABLE_BOTTOM_DIFF)

    # If algorithm was unable to find any sets, then just return None
    if len(sets) == 0:
        return None

    # If only one set was found, then just return it
    if len(sets) == 1:
        return sets[0]

    return _pick_best_set(sets, needed_clo)


def _pick_best_set(sets, needed_clo):
    best_set = sets[0]
    best_diff = abs(_get_set_clo(sets[0]) - needed_clo)

    for set in sets[1:]:
        set_clo = _get_set_clo(set)
        set_diff = abs(set_clo - needed_clo)
        if set_diff < best_diff:
            best_set = set
            best_diff = set_diff

    return best_set


def _get_set_clo(set):
    clo = 0
    for elem in set:
        clo += float(elem.clo)
    return clo


def _check_set_dfs(level, index, current_set, clothing_categories, needed_clo, sets, tolerance):
    clothing_piece = clothing_categories[level][index]

    set_clo = _get_set_clo(current_set) + float(clothing_piece.clo)
    diff = abs(needed_clo - set_clo)
    #print(f'Set clo: {set_clo}, needed_clo {needed_clo}')

    # If diff in tolerance, than add to good sets
    if diff < tolerance:
        sets.append(current_set[:] + [clothing_piece])

    # If there is next level and clo is not too high already - go for it
    if level != len(clothing_categories) - 1 and set_clo < needed_clo:
        _check_set_dfs(level + 1, 0, current_set[:] + [clothing_piece],
                       clothing_categories, needed_clo, sets, tolerance)

    # If not, then check if there is a sibling level
    if index != len(clothing_categories[level]) - 1:
        _check_set_dfs(
            level, index + 1, current_set[:], clothing_categories, needed_clo, sets, tolerance)

    # If not, then there's nothing else to do, so return
    return


def _replace_set_images_with_urls(set):
    for clothing_piece in set:
        replace_image_with_url(clothing_piece)
