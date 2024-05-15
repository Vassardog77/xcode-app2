import React, { useState, useEffect } from 'react';
import { View, Button, Text } from 'react-native';
import { useDispatch } from 'react-redux';
import { getGLogin } from '../../actions/loginActions';
import AsyncStorage from '@react-native-async-storage/async-storage';

function GoogleLogin({ navigation, route }) {
    const [ButtonMessage, setButtonMessage] = useState("Google Login");
    const dispatch = useDispatch();
    const [currentUser, setCurrentUser] = useState(null);
    const [googleLogin, setGoogleLogin] = useState(null);

    useEffect(() => {
        (async () => {
            const user = await AsyncStorage.getItem('user');
            setCurrentUser(JSON.parse(user));

            const gLogin = await AsyncStorage.getItem('google_login');
            setGoogleLogin(gLogin);

            if (gLogin === 'true') {
                setButtonMessage("Logged in");
            } else if (gLogin === 'false') {
                setButtonMessage("Google Login");
            }
        })();
    }, []);

    useEffect(() => {
        (async () => {
            if (route.params?.code && await AsyncStorage.getItem('g_code_pending') === 'pending') {
                await AsyncStorage.removeItem("g_code_pending");
                let code = route.params.code;
                let config = {
                    "code": code,
                    "redirect_uri": "YourAppRedirectUri",
                    "user": currentUser?.email
                };
                dispatch(getGLogin(config));
            }
        })();
    }, [route]);

    const login = async () => {
        let redirect_uri = "YourAppRedirectUri"; // Your app-specific redirect URI
        navigation.navigate("WebViewScreen", {
            url: `https://accounts.google.com/o/oauth2/v2/auth?client_id=419138563147-lblak6s03v4i6lssberpm1vr4gqg000b.apps.googleusercontent.com&redirect_uri=${redirect_uri}&response_type=code&scope=https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/gmail.send https://www.googleapis.com/auth/calendar.events`
        });
        await AsyncStorage.setItem('g_code_pending', 'pending');
    }

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Button title={ButtonMessage} onPress={login} />
        </View>
    );
}

export default GoogleLogin;
