import React from 'react';
import {
  Text,
  Pressable,
  Image,
  TextInput,
  View,
  StyleSheet,
  ToastAndroid,
} from 'react-native';
import colors from './resources/css/colors';
import formElements from './resources/css/formElements';
import {useStore} from '../Store';

const LoginScreen = ({navigation}) => {
  const {dispatch} = useStore();

  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');

  const onPress = async () => {
    if (!username || !password) {
      ToastAndroid.show('Oba pola muszą być wypełnione!', ToastAndroid.SHORT);
      return;
    }

    const body = {
      username,
      password,
    };

    const res = await fetch('http://10.0.2.2:5000/login', {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify(body),
    });

    if (res.status === 200) {
      const user = await res.json();
      dispatch({type: 'SET_USER', payload: user});
      navigation.navigate('Home');
      return;
    }

    if (res.status === 404) {
      ToastAndroid.show('Niepoprawne dane logowania.', ToastAndroid.SHORT);
      return;
    }

    ToastAndroid.show('Nie udało się zalogować.', ToastAndroid.SHORT);
  };

  return (
    <View style={styles.background}>
      <Image
        style={styles.image}
        source={require('./resources/img/runner.png')}
        resizeMode="contain"
      />
      <Text style={formElements.title}>Zaloguj się!</Text>
      <TextInput
        style={formElements.textInput}
        placeholder="Nazwa użytkownika"
        onChangeText={setUsername}
        value={username}
      />
      <TextInput
        style={formElements.textInput}
        placeholder="Hasło"
        secureTextEntry={true}
        onChangeText={setPassword}
        value={password}
      />
      <Pressable style={formElements.button} onPressIn={onPress}>
        <Text style={formElements.buttonText}>Zaloguj</Text>
      </Pressable>
      <View style={styles.subtext}>
        <Text style={formElements.subtext}>Nie masz konta? </Text>
        <Text
          onPress={() => navigation.navigate('Register')}
          style={{...formElements.subtext, textDecorationLine: 'underline'}}>
          Zarejestruj się!
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    width: '80%',
    height: 300,
  },
  background: {
    backgroundColor: colors.background,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  subtext: {
    flexDirection: 'row',
  },
});

export default LoginScreen;
