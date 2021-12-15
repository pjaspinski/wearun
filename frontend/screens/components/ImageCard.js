import React from 'react';
import {View, Image, Text} from 'react-native';

const ImageCard = ({imageUri, title}) => {
  return (
    <View style={styles.bg}>
      <Text style={styles.title}>{title}</Text>
      <Image
        style={styles.image}
        source={{uri: imageUri}}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = {
  bg: {
    backgroundColor: '#fff',
    marginBottom: 10,
    borderRadius: 10,
    marginHorizontal: 20,
  },
  image: {
    height: 200,
    margin: 20,
  },
  title: {
    color: '#000',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 5,
  },
};

export default ImageCard;
