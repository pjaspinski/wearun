import React from 'react';
import {View, Image, Text, ToastAndroid, ActivityIndicator} from 'react-native';
import utils from '../resources/css/utils';
import {fetchFromApi} from '../../AjaxDao';

const Shelf = ({name, image, categoryID}) => {
  const [type, setType] = React.useState('');
  const [loading, setLoading] = React.useState(true);
  const [category, setCategory] = React.useState('');
  const setCategoryInfo = async () => {
    const res = await fetchFromApi(
      `clothing_category?category_id=${categoryID}`,
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
    setLoading(false);
  };

  React.useEffect(() => {
    setCategoryInfo();
  }, []);
  return (
    <View style={localStyles.mainContainer}>
      {loading ? (
        <View style={{...localStyles.spinnerContainer, ...utils.flexCenter}}>
          <ActivityIndicator size="large" color="#00C3FF" />
        </View>
      ) : (
        <>
          <Image
            source={{uri: image}}
            style={localStyles.image}
            resizeMode="contain"
          />
          <Text style={localStyles.name}>{name}</Text>
          <Text style={localStyles.category}>
            {type}: {category}
          </Text>
        </>
      )}
    </View>
  );
};

const localStyles = {
  mainContainer: {
    width: '45%',
    borderRadius: 25,
    alignItems: 'center',
    borderColor: '#fff',
    backgroundColor: '#fff',
    borderWidth: 2,
    padding: 5,
    margin: 10,
  },
  image: {
    flex: 1,
    height: 120,
    width: 100,
  },
  name: {
    fontSize: 20,
    color: '#020202',
    textAlign: 'center',
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  category: {
    fontSize: 15,
    color: '#050505',
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  spinnerContainer: {
    height: 170,
  },
};

export default Shelf;
