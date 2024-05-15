import React, { useEffect, useState } from 'react';
import { View, StyleSheet, SafeAreaView, Text } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { useAuthContext } from './hooks/useAuthContext'

import NavBar from './components/Navigation/Navbar';
import Topbar from './components/Navigation/Topbar';
import Messages from './components/Messages/ChatVisuals';
import Feed from './components/Feed/Feed';
import Home from './components/Home/homeVisuals';
import Email from './components/Email/emailVisuals';
import Analytics from './components/Analytics/analyticsFunctionality';
import Profile from './components/Profile/profileMain';
import AltProfile from './components/Profile/profileView';
import SinglePost from './components/Feed/SinglePost';
import Form from './components/Posting/Form';
import Chat from './components/Messages/Chat';
import LoginPage from './components/UserLogin/LoginPage';
import SignupPage from './components/UserLogin/SignupPage';

const Stack = createStackNavigator();
const Tab = createMaterialBottomTabNavigator();

function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeScreen" component={Home} />
      <Stack.Screen name="FormScreen" component={Form} />
      <Stack.Screen name="FeedScreen" component={Feed} />
      <Stack.Screen name="LoginScreen" component={LoginPage} />
    </Stack.Navigator>
  );
}

function FeedStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="FeedScreen" component={Feed} />
      <Stack.Screen name="SinglePostScreen" component={SinglePost} />
      <Stack.Screen name="FormScreen" component={Form} />
      <Stack.Screen name="ProfileScreen" component={AltProfile} />
      <Stack.Screen name="LoginScreen" component={LoginPage} />
    </Stack.Navigator>
  );
}

function MessagesStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MessagesScreen" component={Messages} />
      <Stack.Screen name="ChatScreen" component={Chat} />
      <Stack.Screen name="LoginScreen" component={LoginPage} />
    </Stack.Navigator>
  );
}

function ProfileStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ProfileScreen" component={Profile} />
      <Stack.Screen name="AltProfileScreen" component={AltProfile} />
      <Stack.Screen name="MessagesScreen" component={Messages} />
      <Stack.Screen name="LoginScreen" component={LoginPage} />
    </Stack.Navigator>
  );
}

function EmailStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="EmailScreen" component={Email} />
      <Stack.Screen name="LoginScreen" component={LoginPage} />
    </Stack.Navigator>
  );
}

function AnalyticsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AnalyticsScreen" component={Analytics} />
      <Stack.Screen name="LoginScreen" component={LoginPage} />
    </Stack.Navigator>
  );
}

export default function YourAppNavigation() {
  const { isUserLoggedIn, user } = useAuthContext();

  // State to handle errors
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // Introducing a delay using setTimeout
    const checkAccountType = setTimeout(() => {
      if (user) {
        if (typeof user.account_type !== "string") {
          console.warn("Unexpected account_type format in user object");
          setHasError(true);
        } else {
          console.log(user.account_type);
        }
      } else {
        console.log("no account type");
      }
    }, 500); //delay makes sure the account type has time to load

    // Cleanup the timeout when component unmounts or user object changes
    return () => clearTimeout(checkAccountType);
}, [user]);


  if (hasError) {
    return (
      <View style={styles.container}>
        <Text>Oops, something went wrong!</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {isUserLoggedIn && (
        <SafeAreaView style={styles.safeArea}>
          <Topbar />
        </SafeAreaView>
      )}
      {isUserLoggedIn ? (
        <Tab.Navigator tabBar={props => <NavBar {...props} />}>
          <Tab.Screen name="Home" component={HomeStack} />
          <Tab.Screen name="Feed" component={FeedStack} />
          <Tab.Screen name="Messages" component={MessagesStack} />
          {user && user.account_type && user.account_type !== "student" && (
            <>
              <Tab.Screen name="Profile" component={ProfileStack} />
              <Tab.Screen name="Email" component={EmailStack} />
              <Tab.Screen name="Analytics" component={AnalyticsStack} />
            </>
          )}
        </Tab.Navigator>
      ) : (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="LoginScreen" component={LoginPage} />
          <Stack.Screen name="SignupScreen" component={SignupPage} />
          <Stack.Screen name="HomeScreen" component={Home} />
        </Stack.Navigator>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  safeArea: {
    paddingTop: 15
  }
});
