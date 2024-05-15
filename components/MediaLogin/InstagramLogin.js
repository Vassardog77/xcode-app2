import React, { useState, useEffect } from 'react';
import { View, Text, Button, Picker, Linking } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { base_url } from '../../api';

function InstagramLogin(props) {
    const [currentUser, setCurrentUser] = useState(null);
    const [Pages, setPages] = useState([]);
    const [Login, setLogin] = useState(false);

    useEffect(() => {
        async function fetchUser() {
            const user = await AsyncStorage.getItem('user');
            setCurrentUser(JSON.parse(user));
        }
        fetchUser();
    }, []);

    let login = async () => {
        try {
            const response = await axios.post(base_url + '/pages?', {
                "user": currentUser.email
            });
            setPages(response.data);
            setLogin(true);
        } catch (error) {
            console.error("Error logging in:", error);
        }
    };

    const handleSubmit = async (selectedValue) => {
        try {
            const selectedPage = Pages[selectedValue];
            await axios.post(base_url + '/login/ig', {
                "id": selectedPage.id,
                "access_token": selectedPage.access_token,
                "user": currentUser.email
            });
            await AsyncStorage.setItem('instagram_login', 'true');
            setPages([]);
            setLogin(false);
        } catch (error) {
            console.error("Error submitting:", error);
        }
    };

    let content = <Button title="Insta Login" onPress={login} />;

    if (Login) {
        content = (
            <Picker selectedValue={null} onValueChange={value => handleSubmit(value)}>
                <Picker.Item label="Choose a page" value="" />
                {Pages.map((page, index) => (
                    <Picker.Item key={index} label={page.name} value={index} />
                ))}
            </Picker>
        );
    }

    return (
        <View style={{ padding: 20 }}>
            {content}
            <View style={{ marginTop: 20 }}>
                <Text>
                    IMPORTANT NOTE: Instagram login will only work for an Instagram 
                    business account connected to a Facebook page on your Facebook account.
                </Text>
                <Text
                    style={{ color: 'blue' }}
                    onPress={() => Linking.openURL('https://youtu.be/EgyDJSbsxMY')}>
                    If you don't know how to do that, check out instructions here.
                </Text>
            </View>
        </View>
    );
}

export default InstagramLogin;
