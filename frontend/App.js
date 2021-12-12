import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import HomeScreen from './screens/HomeScreen';
import {Store} from './Store';
import RecommendationScreen from './screens/RecommendationScreen';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <Store initialState={{user: null}}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Login"
          screenOptions={{
            headerBackVisible: true,
            headerShadowVisible: false,
            headerStyle: {
              backgroundColor: '#fff',
            },
            title: '',
          }}>
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen
            name="Recommendation"
            component={RecommendationScreen}
            options={{
              headerStyle: {
                backgroundColor: '#009CCC',
              },
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Store>
  );
};

export default App;
