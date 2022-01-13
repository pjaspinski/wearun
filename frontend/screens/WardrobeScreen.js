import React from 'react';
import {View, Text, FlatList, Pressable, ToastAndroid} from 'react-native';
import Shelf from './components/Shelf';
import utils from './resources/css/utils';
import {useStore} from '../Store';

const WardrobeScreen = ({navigation}) => {
  const [clothes, setClothes] = React.useState([]);
  const {state} = useStore();

  const addClothes = () => {
    navigation.navigate('AddScreen');
  };

  React.useEffect(() => {
    getClothes();
  }, []);

  const getClothes = async () => {
    const res = await fetch(
      `http://10.0.2.2:5000/user_clothes?id=${state.user.id}`,
      {
        method: 'GET',
      },
    );
    if (res.status !== 200) {
      ToastAndroid.show(
        'Nie udało się pobrać informacji o ubraniach.',
        ToastAndroid.LONG,
      );
      return;
    }
    const data = await res.json();
    setClothes(data);
  };
  return (
    <View style={localStyles.bg}>
      <Text style={localStyles.title}>Moja szafa</Text>
      <View style={localStyles.wardrobe}>
        <FlatList
          data={clothes}
          numColumns={2}
          keyExtractor={item => item.id}
          renderItem={({item}) => (
            <Shelf
              key={item.id}
              name={item.name}
              image={`http://10.0.2.2:5000${item.image}`}
              categoryID={item.category_id}
            />
          )}
        />
      </View>
      <Pressable style={localStyles.button} onPress={() => addClothes()}>
        <Text style={localStyles.buttonText}>+</Text>
      </Pressable>
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
  wardrobe: {
    flex: 1,
    ...utils.flexCenter,
  },
  button: {
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 100,
    backgroundColor: '#2F915C',
    elevation: 10,
    position: 'absolute',
    bottom: 10,
    right: 10,
  },
  buttonText: {
    color: '#fff',
    textTransform: 'uppercase',
    fontSize: 40,
  },
};

export default WardrobeScreen;
