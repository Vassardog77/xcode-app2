import React, { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import reducers from './reducers';
import { AuthContextProvider, AuthContext } from './context/AuthContext'; // <-- Make sure to import AuthContext
import YourAppNavigation from './YourAppNavigation';
import { MenuProvider } from 'react-native-popup-menu';
import { registerForPushNotificationsAsync } from './actions/notificationActions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

const store = createStore(reducers, compose(applyMiddleware(thunk)));

export default function App() {
  const [isReady, setIsReady] = useState(false);
  
  useEffect(() => {
    async function fetchToken() {
      try {
        const token = await registerForPushNotificationsAsync();
        if (token) {
          console.log("Received Expo Push Token:", token);
          await AsyncStorage.setItem('expoPushToken', token);
        }
        setIsReady(true);
      } catch (error) {
        console.error("Error fetching token: ", error.message);
        Alert.alert("Error", "There was an error fetching the push notification token.");
        setIsReady(true);  // Set ready to true even in case of error to render the app
      }
    }
    fetchToken();
  }, []);
  
  if (!isReady) {
    // Optionally show a loading screen or return null
    return null;
  }

  return (
    <Provider store={store}>
      <AuthContextProvider>
        <NavigationContainer>
          <MenuProvider>
            <YourAppNavigation />
          </MenuProvider>
        </NavigationContainer>
      </AuthContextProvider>
    </Provider>
  );
}
