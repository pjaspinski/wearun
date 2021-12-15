import React from 'react';
import {View, Image, Text, ToastAndroid} from 'react-native';

const Shelf = ({name, image, categoryID}) => {
  const [type, setType] = React.useState('');
  const [category, setCategory] = React.useState('');
  const setCategoryInfo = async () => {
    const res = await fetch(
      `http://10.0.2.2:5000/clothing_category?category_id=${categoryID}`,
      {
        method: 'GET',
      },
    );
    if (res.status !== 200) {
      ToastAndroid.show(
        'Nie udało się pobrać informacji o kategorii.',
        ToastAndroid.LONG,
      );
      return;
    }
    const data = await res.json();
    setType(data.type);
    setCategory(data.name);
  };

  React.useEffect(() => {
    setCategoryInfo();
  }, []);
  return (
    <View style={localStyles.mainContainer}>
      <Image
        source={{uri: image}}
        style={localStyles.image}
        resizeMode="contain"
      />
      <Text style={localStyles.name}>{name}</Text>
      <Text style={localStyles.category}>
        {type}: {category}
      </Text>
    </View>
  );
};

const localStyles = {
  mainContainer: {
    width: '45%',
    borderRadius: 25,
    alignItems: 'center',
    borderColor: '#fff',
    borderWidth: 2,
    padding: 5,
    margin: 10,
  },
  image: {
    flex: 1,
    height: 80,
  },
  name: {
    fontSize: 20,
    color: '#fdfdfd',
    textAlign: 'center',
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  category: {
    fontSize: 15,
    color: '#fdfdfd',
    textAlign: 'center',
    textTransform: 'uppercase',
  },
};

export default Shelf;
