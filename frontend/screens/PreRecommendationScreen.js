import React from 'react';
import {View, Text, ActivityIndicator} from 'react-native';
import styleUtils from './resources/css/utils.js';
import {useStore} from '../Store.js';
import ButtonWithImage from './components/ButtonWithImage.js';
import {fetchFromApiWithAuth} from '../AjaxDao.js';

const PreRecommendationScreen = ({navigation}) => {
  const [stage, setStage] = React.useState('typeSelection');
  const {state, dispatch} = useStore();

  const getRecommendation = async type => {
    const {latitude, longitude} = state.position;
    const {id} = state.user;
    const res = await fetchFromApiWithAuth(
      state,
      `new_recommendation?user_id=${id}&training_type=${type}&latitude=${latitude}&longitude=${longitude}`,
      {
        method: 'GET',
      },
    );

    if (res.status !== 200) {
      setStage('error');
      return;
    }

    const data = await res.json();

    dispatch({type: 'SET_RECOMMENDATION', payload: data});
    navigation.navigate('Recommendation');
  };

  const selectTrainingType = type => {
    setStage('loading');
    getRecommendation(type);
  };

  switch (stage) {
    case 'typeSelection':
      return (
        <View style={styles.bg}>
          <Text style={styleUtils.smallHeading}>Wybierz rodzaj treningu:</Text>
          <ButtonWithImage
            color="#00C3FF"
            onPress={() => selectTrainingType('running')}
            text="Bieganie"
            imageSrc={require('./resources/img/runner-white.png')}
            disabled={false}
          />
          <ButtonWithImage
            color="#00C3FF"
            onPress={() => selectTrainingType('cycling')}
            text="Kolarstwo"
            imageSrc={require('./resources/img/bicycle-white.png')}
            disabled={false}
          />
        </View>
      );
    case 'loading':
      return (
        <View style={styles.bg}>
          <ActivityIndicator size="large" color="#00C3FF" />
        </View>
      );
    case 'error':
      return (
        <View style={styles.bg}>
          <Text style={{...styleUtils.smallHeading, textAlign: 'center'}}>
            Nie udało nam się złożyć dobrego zestawu 😒
          </Text>
          <Text style={styles.additionalText}>
            Spróbuj dodać więcej ubrań do swojej szafy.
          </Text>
          <ButtonWithImage
            color="#00C3FF"
            onPress={() => navigation.navigate('Wardrobe')}
            text="Moja szafa"
            imageSrc={require('./resources/img/wardrobe.png')}
            disabled={false}
          />
        </View>
      );
  }
};

const styles = {
  bg: {
    backgroundColor: '#fff',
    padding: 30,
    flex: 1,
    ...styleUtils.flexCenter,
  },
  additionalText: {
    fontSize: 16,
    color: '#000',
    marginBottom: 10,
  },
};

export default PreRecommendationScreen;
