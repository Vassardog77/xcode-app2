import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Button, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getFbLogin } from '../../actions/loginActions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Linking from 'expo-linking';

function FacebookLogin(props) {
    const [ButtonMessage, setButtonMessage] = useState("Facebook Login");
    const dispatch = useDispatch();
    const navigation = useNavigation();

    useEffect(() => {
        const handleDeepLink = (url) => {
            let code = Linking.parse(url).queryParams.code;
            if (code) {
                let redirect_uri = Linking.makeUrl('/social-add');
                let current_user = JSON.parse(AsyncStorage.getItem('user'));
                let config = {
                    "code": code,
                    "redirect_uri": redirect_uri,
                    "user": current_user.email
                };
                dispatch(getFbLogin(config));
            }
        };

        // This handles the case where the app is opened from a deep link
        const getUrl = async () => {
            const url = await Linking.getInitialURL();
            if (url) handleDeepLink(url);
        };

        getUrl();

        // This handles the case where the app is already open
        Linking.addEventListener('url', handleDeepLink);

        return () => {
            // Cleanup the event listener
            Linking.removeEventListener('url', handleDeepLink);
        };
    }, [dispatch]);

    const login = () => {
        let scopes = [
            '&scope=' +
            'pages_show_list%2C' +
            'instagram_basic%2C' +
            'pages_read_engagement%2C' +
            'instagram_manage_insights%2C' +
            'pages_manage_posts%2C' +
            'instagram_content_publish'
        ];
        let redirect_uri = Linking.makeUrl('/social-add');
        Linking.openURL("https://www.facebook.com/v15.0/dialog/oauth?client_id=354529376664526&redirect_uri=" + redirect_uri + "&state=1h12j5215ggdn8ng7fj3" + scopes);
        AsyncStorage.setItem('fb_code_pending', 'pending');
    };

    useEffect(() => {
        const checkFacebookLogin = async () => {
            let loginStatus = await AsyncStorage.getItem('facebook_login');
            if (loginStatus === 'true') {
                setButtonMessage("Logged in");
            } else if (loginStatus === 'false') {
                setButtonMessage("Facebook Login");
            }
        };
        checkFacebookLogin();
    }, [setButtonMessage]);

    return (
        <View>
            <Button title={ButtonMessage} onPress={login} />
        </View>
    );
}

export default FacebookLogin;
