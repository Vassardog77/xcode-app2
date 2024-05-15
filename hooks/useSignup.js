//ported to react native
import { useState } from 'react';
import { base_url } from '../api';
import { useAuthContext } from './useAuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native'; 

export const useSignup = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const { dispatch } = useAuthContext();
  const navigation = useNavigation();

  const signup = async (screen_name, profile_pic, email, password, account_type) => {
    setIsLoading(true);
    setError(null);

    const response = await fetch(base_url+'/api/user/signup', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ screen_name, profile_pic, email, password, account_type })
    });
    const json = await response.json();

    if (!response.ok) {
      setIsLoading(false);
      setError(json.error);
    }
    if (response.ok) {
      // Save the user to AsyncStorage
      try {
        await AsyncStorage.setItem('user', JSON.stringify(json));
      } catch (error) {
        console.error(error);
      }

      // Update the auth context
      dispatch({type: 'LOGIN', payload: json});

      // Update loading state
      setIsLoading(false);
      navigation.navigate('HomeScreen');
    }
  }

  return { signup, isLoading, error };
}
