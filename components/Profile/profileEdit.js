import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';
import { postProfile } from '../../actions/profileActions';
import ImagePicker from 'react-native-image-picker'; // Corrected import statement
import AsyncStorage from '@react-native-async-storage/async-storage';

function ProfileEdit(props) {
    const [Img1, setImg1] = useState('');
    const [Img2, setImg2] = useState('');
    const [Img3, setImg3] = useState('');
    const [Img4, setImg4] = useState('');
    const [orgName, setOrgName] = useState('');
    const [contactInfo, setContactInfo] = useState('');
    const [description, setDescription] = useState('');

    const dispatch = useDispatch();

    const handleImageUpload = (setImage) => {
        ImagePicker.launchImageLibrary({ mediaType: 'photo' }, (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else {
                setImage(response.uri);
            }
        });
    };

    const post_profile = async () => {
        const current_user = JSON.parse(await AsyncStorage.getItem('user'));
        let profile = {
            user: current_user.email,
            img1: Img1,
            org_name: orgName,
            img2: Img2,
            contact: contactInfo,
            img3: Img3,
            description: description,
            img4: Img4
        };

        alert("Profile Updated!");
        dispatch(postProfile(profile));
    };

    return (
        <View style={styles.container}>
            <Text>Add image(s):</Text>
            <Button title="Upload Image 1" onPress={() => handleImageUpload(setImg1)} />

            <TextInput 
                style={styles.inputField}
                placeholder='Organization Name' 
                value={orgName}
                onChangeText={setOrgName}
            />

            <Text>Add image(s):</Text>
            <Button title="Upload Image 2" onPress={() => handleImageUpload(setImg2)} />

            <Text>Where to Contact Us:</Text>
            <TextInput 
                style={styles.inputField}
                placeholder='Contact information' 
                value={contactInfo}
                onChangeText={setContactInfo}
            />

            <Text>Add image(s):</Text>
            <Button title="Upload Image 3" onPress={() => handleImageUpload(setImg3)} />

            <TextInput 
                style={styles.inputField}
                placeholder='Description'
                value={description}
                onChangeText={setDescription}
            />

            <Text>Add image(s):</Text>
            <Button title="Upload Image 4" onPress={() => handleImageUpload(setImg4)} />

            <Button title='Save Profile' onPress={post_profile} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16
    },
    inputField: {
        marginVertical: 10,
        padding: 8,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 4,
    }
});

export default ProfileEdit;
