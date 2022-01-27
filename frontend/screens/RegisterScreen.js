import React from 'react';
import {
  Image,
  Pressable,
  StyleSheet,
  TextInput,
  ToastAndroid,
  View,
  Text,
} from 'react-native';
import colors from './resources/css/colors';
import formElements from './resources/css/formElements';
import {useStore} from '../Store';
import {fetchFromApi} from '../AjaxDao';

export default function RegisterScreen({navigation}) {
  const {dispatch} = useStore();

  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [secondPassword, serSecondPassword] = React.useState('');

  const onPress = async () => {
    if (!username || !password || !secondPassword) {
      ToastAndroid.show(
        'Wszystkie pola muszą być wypełnione',
        ToastAndroid.SHORT,
      );
      return;
    }

    if (password !== secondPassword) {
      ToastAndroid.show('Hasła powinny być takie same', ToastAndroid.SHORT);
      return;
    }

    const body = {
      username,
      password,
    };

    const res = await fetchFromApi('register', {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify(body),
    });

    switch (res.status) {
      case 200:
        navigation.navigate('Login');
        ToastAndroid.show(
          'Rejestracja przebiegła pomyślnie.',
          ToastAndroid.SHORT,
        );
        return;
      case 404:
        ToastAndroid.show(
          'Wprowadzonie nieprawidłowe dane.',
          ToastAndroid.SHORT,
        );
        return;
      default:
        ToastAndroid.show('Nie udało się zarejestrować.', ToastAndroid.SHORT);
        break;
    }
  };

  return (
    <View style={styles.background}>
      <Image
        style={styles.image}
        source={require('./resources/img/bicycle.png')}
        resizeMode="contain"
      />
      <Text style={formElements.title}>Rejestracja</Text>
      <TextInput
        style={formElements.textInput}
        placeholder="Nazwa użytkownika"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={formElements.textInput}
        placeholder="Hasło"
        value={password}
        secureTextEntry={true}
        onChangeText={setPassword}
      />
      <TextInput
        style={formElements.textInput}
        placeholder="Powtórz hasło"
        value={secondPassword}
        secureTextEntry={true}
        onChangeText={serSecondPassword}
      />
      <Pressable style={formElements.button} onPressIn={onPress}>
        <Text style={formElements.buttonText}>Zarejestruj</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    backgroundColor: colors.background,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '80%',
    height: 300,
    marginTop: -50,
  },
});
