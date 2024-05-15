// AuthContext.js

import React, { createContext, useReducer, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext();

export const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, user: action.payload, isUserLoggedIn: true };
    case 'LOGOUT':
      return { ...state, user: null, isUserLoggedIn: false };
    case 'UPDATE_PUSH_TOKEN':
      return { 
        ...state, 
        user: {
          ...state.user,
          expoPushToken: action.payload 
        } 
      };
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
};

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, { user: null, isUserLoggedIn: false });

  const loadInitialState = useCallback(async () => {
    try {
      const user = await AsyncStorage.getItem('user');
      if (user !== null) {
        dispatch({ type: 'LOGIN', payload: JSON.parse(user) });
      }
    } catch (error) {
      console.error('Error loading initial state:', error.message || error);
    }
  }, []);

  useEffect(() => {
    loadInitialState();
  }, [loadInitialState]);

  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};
