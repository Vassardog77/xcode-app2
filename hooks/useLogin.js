import { useState } from 'react';
import { useAuthContext } from './useAuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { base_url } from '../api';
import { useNavigation } from '@react-navigation/native';
import { updateNotification } from '../actions/notificationActions';
import { useDispatch } from 'react-redux';

export const useLogin = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { user, dispatch: authDispatch } = useAuthContext();
  const navigation = useNavigation();
  const reduxDispatch = useDispatch();

  const login = async (email, password) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(base_url + '/api/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const json = await response.json();
        console.log(json.error);
        setError(json.error);
        return;
      }

      const json = await response.json();

      const expoPushTokenFromStorage = await AsyncStorage.getItem('expoPushToken');

      if (expoPushTokenFromStorage) {
        console.log("Expo push token from storage:", expoPushTokenFromStorage);
        authDispatch({ type: 'UPDATE_PUSH_TOKEN', payload: expoPushTokenFromStorage });
        try {
          await reduxDispatch(updateNotification({
            email: email,
            token: expoPushTokenFromStorage
          }));
        } catch (error) {
          console.log('Error updating push token:', error);
        }
      }

      await AsyncStorage.setItem('user', JSON.stringify(json));
      authDispatch({ type: 'LOGIN', payload: json });

      navigation.navigate('HomeScreen');
    } catch (error) {
      console.log('Error:', error);
      setError('An error occurred while logging in.');
    } finally {
      setIsLoading(false);
    }
  };

  return { login, isLoading, error };
};
