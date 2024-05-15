import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import { postEmail } from '../../actions/emailActions';
import { Buffer } from 'buffer';

const EmailFunctionality = (props) => {
    const [Content, setContent] = useState(null);
    const dispatch = useDispatch();

    const sendEmail = async (recipient, subject, body) => {
        const data = Buffer.from(
            `Subject: ${subject}\nTo: ${recipient}\n\n${body}`
        ).toString('base64');

        const currentUser = JSON.parse(await AsyncStorage.getItem('user'));
        const email = {
            "user": currentUser.email,
            "raw": data
        };
        dispatch(postEmail(email));
        Alert.alert("Email Sent!");
    };

    useEffect(() => {
        const checkLoginStatus = async () => {
            const google_login = await AsyncStorage.getItem('google_login');
            if (google_login === 'true') {
                setContent(
                    <View>
                        <TextInput placeholder='To:' keyboardType='email-address' onChangeText={text => setRecipient(text)} />
                        <TextInput placeholder='Subject' onChangeText={text => setSubject(text)} />
                        <TextInput placeholder='Body' multiline onChangeText={text => setBody(text)} />
                        <Button title="Send Email" onPress={() => sendEmail(recipient, subject, body)} />
                    </View>
                );
            } else if (google_login === 'false') {
                setContent(
                    <View>
                        <Text>Please log in with Google to continue</Text>
                        {/* <GoogleLogin /> */}
                    </View>
                );
            }
        };
        
        checkLoginStatus();
    }, []);

    return (
        <View>
            {Content}
        </View>
    );
};

export default EmailFunctionality;
