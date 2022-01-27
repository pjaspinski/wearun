import React from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ToastAndroid,
  Image,
  ActivityIndicator,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import * as ImagePicker from 'react-native-image-picker';
import Slider from '@react-native-community/slider';
import {useStore} from '../Store';
import {fetchFromApiWithAuth} from '../AjaxDao';

const AddScreen = ({navigation}) => {
  const [name, setName] = React.useState('');
  const [category_id, setCategoryID] = React.useState(1);
  const [categories, setCategories] = React.useState([]);
  const [image, setImage] = React.useState();
  const [user_id, setUserID] = React.useState();
  const [clo, setClo] = React.useState(1);
  const [pickerResponse, setPickerResponse] = React.useState(null);
  const {state} = useStore();
  const [imageUri, setImageUri] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  const save = async () => {
    if (!name || !category_id || !clo || !image) {
      ToastAndroid.show(
        'Wszystkie pola muszą być wypełnione!',
        ToastAndroid.SHORT,
      );
      return;
    }
    const formData = new FormData();
    formData.append('name', name);
    formData.append('clo', clo);
    formData.append('category_id', category_id);
    formData.append('user_id', user_id);
    formData.append('image', image);
    const res = await fetchFromApiWithAuth(state, 'clothing_piece', {
      method: 'PUT',
      headers: {
        Accept: `text/plain`,
      },
      body: formData,
    });
    if (res.status === 200) {
      setLoading(true);
      setTimeout(() => {
        navigation.navigate('Wardrobe', {reload: true});
      }, 1000);
      return;
    }
    ToastAndroid.show('Nie udało się zapisać.', ToastAndroid.SHORT);
  };

  const addImage = React.useCallback(() => {
    const options = {
      selectionLimit: 1,
      mediaType: 'photo',
      includeBase64: true,
    };
    ImagePicker.launchImageLibrary(options, setPickerResponse);
  }, []);

  React.useEffect(() => {
    setUserID(state.user.id);
    getCategories();
  }, []);

  React.useEffect(() => {
    if (pickerResponse?.assets) {
      if ('image/jpeg' === pickerResponse.assets[0].type) {
        setImage(pickerResponse.assets[0].base64);
        setImageUri(pickerResponse.assets[0].uri);
      } else {
        ToastAndroid.show(
          'Tylko obrazy w formacie JPG i JPEG są dozwolone.',
          ToastAndroid.SHORT,
        );
      }
    }
  }, [pickerResponse]);

  const getCategories = async () => {
    const res = await fetchFromApiWithAuth(state, 'clothing_categories', {
      method: 'GET',
    });
    if (res.status !== 200) {
      ToastAndroid.show(
        'Nie udało się pobrać informacji o kategoriach.',
        ToastAndroid.LONG,
      );
      return;
    }
    const data = await res.json();
    setCategories(data);
    setCategoryID(data[0].id);
  };

  return (
    <View style={localStyles.bg}>
      <Text style={localStyles.title}>Dodaj ubranie</Text>
      <View style={localStyles.form}>
        <TextInput
          style={localStyles.textInput}
          placeholder="Nazwa ubioru"
          onChangeText={setName}
          value={name}
        />
        <View style={localStyles.imageView}>
          <Image
            style={localStyles.image}
            source={
              imageUri ? {uri: imageUri} : require('./resources/img/empty.jpg')
            }
          />
        </View>
        <Pressable style={localStyles.buttonImage} onPress={addImage}>
          <Text style={localStyles.buttonImageText}>Dodaj zdjęcie</Text>
        </Pressable>
        <Text style={localStyles.category}>Kategoria:</Text>
        <Picker
          selectedValue={category_id}
          style={localStyles.picker}
          onValueChange={value => setCategoryID(value)}>
          {categories.length === 0 ? (
            <Picker.Item label="No Categories Found" value="" />
          ) : (
            categories.map(cat => {
              return (
                <Picker.Item
                  label={`${cat.type}: ${cat.name}`}
                  value={cat.id}
                  key={cat.id}
                />
              );
            })
          )}
        </Picker>
        <Text style={localStyles.category}>Stopień ciepła ubioru: {clo}</Text>
        <Slider
          style={localStyles.slider}
          minimumValue={1}
          maximumValue={5}
          step={1}
          onValueChange={value => setClo(value)}
          minimumTrackTintColor="#FFFFFF"
          maximumTrackTintColor="#2F915C"
        />
        <Pressable style={localStyles.button} onPress={() => save()}>
          {loading ? (
            <ActivityIndicator size="large" color="#fff"></ActivityIndicator>
          ) : (
            <Text style={localStyles.buttonText}>Zapisz</Text>
          )}
        </Pressable>
      </View>
    </View>
  );
};
const localStyles = {
  bg: {
    flex: 1,
    backgroundColor: '#64DCA0',
    alignItems: 'center',
  },
  title: {
    color: '#fff',
    textTransform: 'uppercase',
    fontWeight: 'bold',
    fontSize: 40,
    marginTop: 5,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: {width: 1, height: 0},
    textShadowRadius: 10,
    marginBottom: 10,
  },
  form: {
    width: '70%',
  },
  textInput: {
    backgroundColor: '#fff',
    width: '100%',
    marginBottom: 20,
    marginTop: 30,
    fontSize: 18,
    borderRadius: 3,
  },
  imageView: {
    alignItems: 'center',
  },
  image: {
    width: '50%',
    height: 130,
  },
  buttonImage: {
    backgroundColor: '#2F915C',
    borderRadius: 3,
    marginTop: 10,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 10,
    height: 50,
  },
  buttonImageText: {
    color: '#fff',
    textTransform: 'uppercase',
    fontWeight: '600',
    fontSize: 20,
  },
  category: {
    marginTop: 20,
    color: '#fff',
    fontWeight: '600',
    fontSize: 22,
  },
  smallText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 12,
  },
  picker: {
    marginTop: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  slider: {
    marginTop: 20,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 3,
    backgroundColor: '#2F915C',
    elevation: 10,
    marginTop: 50,
    padding: 10,
    height: 50,
  },
  buttonText: {
    color: '#fff',
    textTransform: 'uppercase',
    fontWeight: '600',
    fontSize: 20,
  },
};

export default AddScreen;
