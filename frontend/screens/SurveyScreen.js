import React from 'react';
import {View, Text, Pressable, ActivityIndicator} from 'react-native';
import {RadioGroup, RadioButton} from 'react-native-flexi-radio-button';
import {useStore} from '../Store.js';
import styleUtils from './resources/css/utils.js';
import ButtonWithImage from './components/ButtonWithImage.js';
import {fetchFromApi} from '../AjaxDao.js';

const SurveyScreen = ({navigation}) => {
  const [isSatisfied, setSatisfaction] = React.useState('');
  const [reason, setReason] = React.useState('');
  const [disabled, setDisability] = React.useState(true);
  const [stage, setStage] = React.useState('loading');
  const [recommendation, setRecommendation] = React.useState(null);
  const {state, dispatch} = useStore();

  const getLastRecommendation = async () => {
    const {id} = state.user;
    const res = await fetchFromApi(`last_recommendation?user_id=${id}`, {
      method: 'GET',
    });

    if (res.status !== 200) {
      setStage('no-recommendation');
      return;
    }

    const data = await res.json();
    setRecommendation(data);

    if (!data) {
      setStage('no-recommendation');
      return;
    }

    if (data.is_good !== null) {
      setStage('already-rated');
      return;
    }

    setStage('rating');
  };

  React.useEffect(() => {
    getLastRecommendation();
  }, []);

  const onSelectYesNo = value => {
    setSatisfaction(value);
    setDisability(!value);
  };
  const onSelectReason = value => {
    setReason(value);
  };

  const sendForm = async () => {
    // i tutaj wstawic logike wysylania tego formsa na backend
    // dobra wstawiam
    let body = {
      user_id: state.user.id,
      is_good: isSatisfied ? false : true,
    };

    if (!body.is_good) {
      body['is_too_warm'] = reason === 'hot' ? true : false;
    }

    await fetchFromApi('last_recommendation', {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify(body),
    });

    setStage('thanks');
  };

  switch (stage) {
    case 'loading':
      return (
        <View style={localStyles.modalBg}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      );
    case 'no-recommendation':
      return (
        <View style={localStyles.modalBg}>
          <Text
            style={{
              ...styleUtils.smallHeading,
              textAlign: 'center',
              color: '#fff',
            }}>
            Nie przygotowaliśmy dla Ciebie jeszcze żadnej rekomendacji 😐
          </Text>
          <Text style={localStyles.additionalText}>
            Klinij aby dostać pierwszą!
          </Text>
          <ButtonWithImage
            color="#00C3FF"
            onPress={() => navigation.navigate('PreRecommendation')}
            text="Rekomendacja stroju"
            imageSrc={require('./resources/img/start.png')}
            disabled={false}
          />
        </View>
      );
    case 'already-rated':
      return (
        <View style={localStyles.modalBg}>
          <Text
            style={{
              ...styleUtils.smallHeading,
              textAlign: 'center',
              color: '#fff',
            }}>
            Oceniłeś już swoją ostatnią rekomendację 😎
          </Text>
          <Text style={localStyles.additionalText}>
            Stwórz następną i oceń ją po treningu!
          </Text>
          <ButtonWithImage
            color="#00C3FF"
            onPress={() => navigation.navigate('PreRecommendation')}
            text="Rekomendacja stroju"
            imageSrc={require('./resources/img/start.png')}
            disabled={false}
          />
        </View>
      );
    case 'rating':
      return (
        <View style={localStyles.bg}>
          <View style={{...localStyles.blueRoundedBg, ...localStyles.blueBg}}>
            <Text style={localStyles.title}>Ankieta</Text>
            <Text style={localStyles.question}>
              Czy byłeś zadowolony z wyboru?
            </Text>
            <View style={localStyles.container}>
              <RadioGroup
                onSelect={value => onSelectYesNo(value)}
                color="#fff"
                activeColor="#fff"
                thickness={2}>
                <RadioButton value={true} style={localStyles.radio}>
                  <Text style={localStyles.answer}>Tak</Text>
                </RadioButton>
                <RadioButton
                  value={false}
                  color="#fff"
                  style={localStyles.radio}>
                  <Text style={localStyles.answer}>Nie</Text>
                </RadioButton>
              </RadioGroup>
            </View>
            <Text style={localStyles.question}>Jeśli nie, to dlaczego?</Text>
            <View style={localStyles.container}>
              <RadioGroup
                onSelect={value => onSelectReason(value)}
                color="#fff"
                activeColor="#fff"
                thickness={2}>
                <RadioButton
                  value={'cold'}
                  color="#fff"
                  style={localStyles.radio}
                  disabled={disabled}>
                  <Text style={localStyles.answer}>Za zimno</Text>
                </RadioButton>
                <RadioButton
                  value={'hot'}
                  color="#fff"
                  style={localStyles.radio}
                  disabled={disabled}>
                  <Text style={localStyles.answer}>Za ciepło</Text>
                </RadioButton>
              </RadioGroup>
            </View>
          </View>
          <View style={localStyles.buttonContainer}>
            <Pressable style={localStyles.button} onPress={() => sendForm()}>
              <Text style={localStyles.buttonText}>Wyślij</Text>
            </Pressable>
          </View>
        </View>
      );
    case 'thanks':
      return (
        <View style={localStyles.modalBg}>
          <Text
            style={{
              ...styleUtils.smallHeading,
              textAlign: 'center',
              color: '#fff',
            }}>
            Dzięki za opinię 😁
            <View style={localStyles.buttonContainer}>
              <Pressable
                style={{
                  ...localStyles.button,
                  backgroundColor: '#fff',
                  marginTop: 20,
                }}
                onPress={() => navigation.navigate('Home')}>
                <Text style={{...localStyles.buttonText, color: '#009CCC'}}>
                  Wróć
                </Text>
              </Pressable>
            </View>
          </Text>
        </View>
      );
  }
};

const localStyles = {
  blueRoundedBg: {
    backgroundColor: '#009CCC',
    elevation: 3,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    width: '100%',
  },
  bg: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 0.4,
  },
  blueBg: {
    flex: 0.8,
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
  },
  question: {
    color: '#fff',
    fontSize: 23,
    marginTop: 40,
    fontWeight: '600',
  },
  answer: {
    color: '#fff',
    fontSize: 20,
    textTransform: 'uppercase',
    fontWeight: 'bold',
  },
  buttonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 0.2,
  },
  button: {
    width: 150,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    backgroundColor: '#009CCC',
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    textTransform: 'uppercase',
    fontWeight: 'bold',
    fontSize: 25,
  },
  radio: {
    marginTop: 10,
    alignItems: 'center',
  },
  modalBg: {
    backgroundColor: '#009CCC',
    color: '#fff',
    padding: 30,
    flex: 1,
    ...styleUtils.flexCenter,
  },
  additionalText: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 10,
  },
};

export default SurveyScreen;
