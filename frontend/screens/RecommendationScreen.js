import React from 'react';
import {Text, ScrollView} from 'react-native';
import {useStore} from '../Store.js';
import ImageCard from './components/ImageCard';
import {buildImageUrl} from '../AjaxDao.js';
import {CommonActions} from '@react-navigation/native';

const RecommendationScreen = ({navigation}) => {
  const {state} = useStore();

  React.useEffect(() => {
    navigation.dispatch(state => {
      const routes = state.routes.filter(r => r.name !== 'PreRecommendation');

      return CommonActions.reset({
        ...state,
        routes,
        index: routes.length - 1,
      });
    });
  }, []);

  return (
    <ScrollView style={styles.bg}>
      <Text style={styles.title}>Rekomendacja</Text>
      {[...state.recommendation.top, ...state.recommendation.bottom].map(
        item => {
          return (
            <ImageCard
              key={item.id}
              imageUri={buildImageUrl(item.image)}
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
