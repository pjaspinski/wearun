import React from 'react';
import {
  View,
  Text,
  Image,
  PermissionsAndroid,
  ToastAndroid,
} from 'react-native';
import utils from './resources/css/utils';
import {useStore} from '../Store';
import Geolocation from 'react-native-geolocation-service';
import ButtonWithImage from './components/ButtonWithImage';

const HomeScreen = ({navigation}) => {
  const [temp, setTemp] = React.useState(null);
  const [imageSrc, setImageSrc] = React.useState(null);
  const {state} = useStore();

  const getTemp = async () => {
    Geolocation.getCurrentPosition(
      async position => {
        const {latitude, longitude} = position.coords;
        const res = await fetch(
          `http://10.0.2.2:5000/weather?latitude=${latitude}&longitude=${longitude}`,
          {
            method: 'GET',
          },
        );

        if (res.status !== 200) {
          ToastAndroid.show(
            'Nie udało się pobrać informacji o pogodzie.',
            ToastAndroid.LONG,
          );
          return;
        }

        const data = await res.json();

        setTemp(data.main.feels_like);
        setImageSrc(data.icon_url);
      },
      () => {
        ToastAndroid.show(
          'Nie udało się ustalić lokalizacji.',
          ToastAndroid.LONG,
        );
      },
      {
        accuracy: {
          android: 'high',
        },
        timeout: 15000,
      },
    );
  };

  const getLocation = async () => {
    const hasPermission = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );

    if (hasPermission) {
      getTemp();
      return;
    }

    const status = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );
    console.log(status);

    if (status === PermissionsAndroid.RESULTS.GRANTED) {
      getTemp();
      return;
    }

    ToastAndroid.show(
      'Rekomendacje ubioru nie są możliwe bez dostępu do lokalizacji.',
      ToastAndroid.LONG,
    );
  };

  React.useEffect(() => {
    getLocation();
  }, []);

  return (
    <View style={localStyles.mainContainer}>
      <View style={localStyles.logoPanel}>
        <Image
          style={localStyles.logo}
          source={require('./resources/img/logo.png')}
          resizeMode="contain"
        />
      </View>
      <Text style={localStyles.welcomeText}>Cześć, {state.user.username}!</Text>
      <View style={localStyles.weatherPanel}>
        <Image
          style={localStyles.weatherLogo}
          source={{
            uri: imageSrc,
          }}
        />
        <Text style={localStyles.weatherText}>
          {Math.floor(temp) || '--'}°C
        </Text>
      </View>
      <Text style={localStyles.welcomeText}>Co chcesz teraz zrobić?</Text>
      <ButtonWithImage
        color="#7DF5A5"
        onPress={() => {}}
        text="Rekomendacja stroju"
        imageSrc={require('./resources/img/start.png')}
      />
      <ButtonWithImage
        color="#64DCA0"
        onPress={() => {}}
        text="Moja szafa"
        imageSrc={require('./resources/img/wardrobe.png')}
      />
      <ButtonWithImage
        color="#2F915C"
        onPress={() => {}}
        text="Ocena rekomendacji"
        imageSrc={require('./resources/img/survey.png')}
      />
    </View>
  );
};

const localStyles = {
  mainContainer: {
    backgroundColor: '#fff',
    padding: 30,
    flex: 1,
  },
  logoPanel: {
    flex: 0.2,
    backgroundColor: '#3BB573',
    borderRadius: 25,
    ...utils.flexCenter,
  },
  weatherPanel: {
    flex: 0.2,
    backgroundColor: '#D0D0D0',
    borderRadius: 25,
    flexDirection: 'row',
  },
  logo: {
    flex: 1,
    alignSelf: 'center',
  },
  welcomeText: {
    marginTop: 30,
    flex: 0.1,
    ...utils.smallHeading,
  },
  weatherText: {
    textAlign: 'center',
    flex: 0.7,
    fontSize: 80,
    fontWeight: 'bold',
    color: '#fdfdfd',
  },
  weatherLogo: {
    height: '100%',
    flex: 0.3,
  },
};

export default HomeScreen;