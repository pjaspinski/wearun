import React from 'react';
import {View, Text, Pressable} from 'react-native';
import {RadioGroup, RadioButton} from 'react-native-flexi-radio-button';

const SurveyScreen = ({navigation}) => {
  const [isSatisfied, setSatisfaction] = React.useState('');
  const [reason, setReason] = React.useState('');
  const [disabled, setDisability] = React.useState(true);

  const onSelectYesNo = value => {
    setSatisfaction(value);
    setDisability(false);
  };
  const onSelectReason = value => {
    setReason(value);
  };

  const sendForm = () => {
    // i tutaj wstawic logike wysylania tego formsa na backend
  };

  return (
    <View style={localStyles.bg}>
      <View style={{...localStyles.blueRoundedBg, ...localStyles.blueBg}}>
        <Text style={localStyles.title}>Ankieta</Text>
        <Text style={localStyles.question}>Czy byłeś zadowolony z wyboru?</Text>
        <View style={localStyles.container}>
          <RadioGroup
            onSelect={value => onSelectYesNo(value)}
            color="#fff"
            activeColor="#fff"
            thickness={2}>
            <RadioButton value={true} style={localStyles.radio}>
              <Text style={localStyles.answer}>Tak</Text>
            </RadioButton>
            <RadioButton value={false} color="#fff" style={localStyles.radio}>
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
};

export default SurveyScreen;
