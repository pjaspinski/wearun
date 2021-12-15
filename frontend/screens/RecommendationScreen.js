import React from 'react';
import {Text, ScrollView} from 'react-native';
import {useStore} from '../Store.js';
import ImageCard from './components/ImageCard';
import {HeaderBackButton} from '@react-navigation/elements';
const RecommendationScreen = ({navigation}) => {
  const {state} = useStore();

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: props => (
        <HeaderBackButton
          {...props}
          onPress={() => {
            navigation.navigate('Home');
          }}
        />
      ),
    });
  }, [navigation]);

  return (
    <ScrollView style={styles.bg}>
      <Text style={styles.title}>Rekomendacja</Text>
      {[...state.recommendation.top, ...state.recommendation.bottom].map(
        item => {
          return (
            <ImageCard
              key={item.id}
              imageUri={`http://10.0.2.2:5000${item.image}`}
              title={item.name}
            />
          );
        },
      )}
    </ScrollView>
  );
};

const styles = {
  bg: {
    backgroundColor: '#00C3FF',
  },
  title: {
    fontSize: 32,
    color: '#fff',
    textTransform: 'uppercase',
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 10,
    textShadowColor: '#000',
    textShadowOffset: {width: 100, height: 100},
    textShadowRadius: 5,
  },
};

export default RecommendationScreen;
