import React from 'react';
import {Pressable, Image, Text} from 'react-native';
import utils from '../resources/css/utils';

const ButtonWithImage = ({text, imageSrc, color, onPress}) => {
  return (
    <Pressable
      style={{...localStyles.mainContainer, backgroundColor: color}}
      onPress={onPress}>
      <Image source={imageSrc} style={localStyles.image} resizeMode="contain" />
      <Text style={localStyles.text}>{text}</Text>
    </Pressable>
  );
};

const localStyles = {
  mainContainer: {
    flex: 0.2,
    borderRadius: 25,
    marginVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
    ...utils.flexCenter,
  },
  image: {
    flex: 0.3,
    height: '80%',
  },
  text: {
    flex: 0.7,
    fontSize: 24,
    color: '#fdfdfd',
    textAlign: 'center',
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
};

export default ButtonWithImage;
