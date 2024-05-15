import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useSignup } from '../../hooks/useSignup';
//import Logo from '../../assets/logo_1.6.png';
import ImagePicker from 'react-native-image-picker';
import { Picker } from '@react-native-picker/picker';  // <-- Updated Picker import

const Signup = ({ navigation }) => {
  const [Screen_name, setScreen_name] = useState('');
  const [Profile_pic, setProfile_pic] = useState(null);
  const [Email, setEmail] = useState('');
  const [Password, setPassword] = useState('');
  const [Account_type, setAccount_type] = useState('');
  const {signup, error, isLoading} = useSignup();

  const handleSubmit = async () => {
    await signup(Screen_name, Profile_pic, Email, Password, Account_type);
  };

  const selectImage = () => {
    let options = {
      title: 'Select Profile Picture',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };

    ImagePicker.showImagePicker(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        const source = { uri: response.uri };
        setProfile_pic(source);
      }
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.logo}>
        {/*<Image source={Logo} style={styles.logoImage} />*/}</View>
      <View style={styles.signupPage}>
        <Text style={styles.header}>Sign Up</Text>

        <Text>Name:</Text>
        <TextInput
          style={styles.input}
          onChangeText={(text) => setScreen_name(text)}
          value={Screen_name}
        />

        <View style={styles.imagePicker}>
          <Text>Profile Picture:</Text>
          <Button title='Select Image' onPress={selectImage} />
        </View>

        <Text>Email address:</Text>
        <TextInput
          style={styles.input}
          onChangeText={(text) => setEmail(text)}
          value={Email}
          keyboardType='email-address'
        />

        <Text>Password:</Text>
        <TextInput
          style={styles.input}
          onChangeText={(text) => setPassword(text)}
          value={Password}
          secureTextEntry={true}
        />

      <Text>Account type:</Text>
      
      <Picker 
        selectedValue={Account_type}
        style={{height: 50, width: '100%'}}
        onValueChange={(itemValue, itemIndex) =>
          setAccount_type(itemValue)
        }>
        <Picker.Item label="--Please choose an option--" value="" />
        <Picker.Item label="Student" value="student" />
        <Picker.Item label="Organization" value="organization" />
      </Picker>
    

      <View style={styles.submit_button}>
        <Button disabled={isLoading} title='Sign up' onPress={handleSubmit} />
        {error && <Text style={styles.error}>{error}</Text>}

        <View style={styles.userAuth}>
          <Text>Have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')} style={styles.loginSwitch}>
            <Text>Log in</Text>
          </TouchableOpacity>
        </View>
      </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: -100,
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  submit_button: {
    marginTop: 180,
  },  
  logo: {
    alignItems: 'center',
  },
  logoImage: {
    width: 100,
    height: 100,
  },
  signupPage: {},
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
  imagePicker: {
    marginTop: -10,
  },
});

export default Signup;
