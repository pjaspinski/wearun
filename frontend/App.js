import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import HomeScreen from './screens/HomeScreen';
import {Store} from './Store';
import SurveyScreen from './screens/SurveyScreen';
import RecommendationScreen from './screens/RecommendationScreen';
import WardrobeScreen from './screens/WardrobeScreen';
import PreRecommendationScreen from './screens/PreRecommendationScreen';
import AddScreen from './screens/AddScreen';
import {LogBox} from 'react-native';

const Stack = createNativeStackNavigator();
LogBox.ignoreAllLogs();

const App = () => {
  return (
    <Store initialState={{user: null, position: null}}>
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
            name="Survey"
            component={SurveyScreen}
            options={{
              headerStyle: {
                backgroundColor: '#009CCC',
              },
            }}
          />
          <Stack.Screen
            name="PreRecommendation"
            component={PreRecommendationScreen}
          />
          <Stack.Screen
            name="Recommendation"
            component={RecommendationScreen}
            options={{
              headerStyle: {
                backgroundColor: '#00C3FF',
              },
            }}
          />
          <Stack.Screen
            name="Wardrobe"
            component={WardrobeScreen}
            options={{
              headerStyle: {
                backgroundColor: '#64DCA0',
              },
            }}
          />
          <Stack.Screen
            name="AddScreen"
            component={AddScreen}
            options={{
              headerStyle: {
                backgroundColor: '#64DCA0',
              },
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Store>
  );
};

export default App;
