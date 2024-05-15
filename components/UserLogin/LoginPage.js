//ported to react native
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useLogin } from '../../hooks/useLogin';
import Logo from '../../assets/logo_1.6.png';

const LoginPage = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, error, isLoading } = useLogin();

  const handleSubmit = async () => {
    await login(email, password);
    //console.log(email, password);
  };

  return (
    <View style={styles.container}>
      <View style={styles.logo}>
        <Image source={Logo} style={styles.logoImage} />
      </View>
      <View style={styles.loginPage}>
        <Text style={styles.header}>Log In</Text>
        <Text>Email address:</Text>
        <TextInput
          style={styles.input}
          onChangeText={(text) => setEmail(text)}
          value={email}
          keyboardType='email-address'
        />
        <Text>Password:</Text>
        <TextInput
          style={styles.input}
          onChangeText={(text) => setPassword(text)}
          value={password}
          secureTextEntry={true}
        />
        <Button disabled={isLoading} title='Log in' onPress={handleSubmit} />
        {error && <Text style={styles.error}>{error}</Text>}
        <View style={styles.userAuth}>
          <Text>Don't have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('SignupScreen')} style={styles.loginSwitch}>
            <Text>Sign up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  logo: {
    alignItems: 'center',
  },
  logoImage: {
    width: 100,
    height: 100,
  },
  loginPage: {},
  header: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginTop: 10,
    marginBottom: 10,
    paddingLeft: 10,
  },
  error: {
    color: 'red',
  },
  userAuth: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginSwitch: {
    marginLeft: 5,
  },
});

export default LoginPage;
