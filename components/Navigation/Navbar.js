import React, { useState, useEffect } from 'react';
import { View, Image, TouchableOpacity, Text, StyleSheet, SafeAreaView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faChartSimple, faListUl, faEnvelope, faComment, faUser, faHouse } from '@fortawesome/free-solid-svg-icons';

export default function NavBar({ state, descriptors, navigation }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
        if (userData) {
          setUser(JSON.parse(userData));
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };
    fetchUserData();
  }, []);

  if (!user) {
    return null;
  }

  return (
    <SafeAreaView style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', height: 60 }}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        // Define icon based on route name
        let icon;
        switch (route.name) {
          case "Feed":
            icon = faListUl;
            break;
          case "Messages":
            icon = faComment;
            break;
          case "Home":
            icon = faHouse;
            break;
          case "Profile":
            icon = faUser;
            break;
          case "Email":
            icon = faEnvelope;
            break;
          case "Analytics":
            icon = faChartSimple;
            break;
          default:
            icon = null;
            break;
        }

        return (
          <TouchableOpacity
            key={index}
            onPress={() => navigation.navigate(route.name)}
            style={[
              { flex: 1, alignItems: 'center', justifyContent: 'center' },
              isFocused ? { backgroundColor: 'lightgray' } : {}
            ]}
          >
            <FontAwesomeIcon icon={icon} />
            <Text>{route.name}</Text>
          </TouchableOpacity>
        );
      })}
    </SafeAreaView>
  );
}
