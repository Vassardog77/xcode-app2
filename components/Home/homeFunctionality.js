import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { postCalendarEvent } from '../../actions/calendarActions';
import { useSelector } from 'react-redux';
import GoogleLogin from '../MediaLogin/GoogleLogin';
import { View, TextInput, Button, Alert, Text, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

function HomeFunctionality(props) {
    const [current_user, setCurrentUser] = useState(null);
    const [google_login, setGoogleLogin] = useState(null);
    const events = useSelector((state) => state.events);
    let [Content, setContent] = useState();

    const dispatch = useDispatch();

    const loadStorageData = async () => {
        try {
            let user = await AsyncStorage.getItem('user');
            let googleStatus = await AsyncStorage.getItem('google_login');
            
            setCurrentUser(JSON.parse(user));
            setGoogleLogin(googleStatus);
        } catch (error) {
            console.error("Failed to load data from storage:", error);
        }
    };

    useEffect(() => {
        loadStorageData();
    }, []);

    let postEvent = async (e) => {
        e.preventDefault();
        var cal_event = {
            "user": current_user.email,
            "data": {
                "summary": e.target[0].value,
                "location": e.target[1].value,
                "description": e.target[2].value,
                "start": {
                    "dateTime": e.target[3].value + ':00',
                    'timeZone': Intl.DateTimeFormat().resolvedOptions().timeZone
                },
                "end": {
                    "dateTime": e.target[4].value + ':00',
                    'timeZone': Intl.DateTimeFormat().resolvedOptions().timeZone
                }
            }
        };
        dispatch(postCalendarEvent(cal_event));
        Alert.alert("Event Scheduled!");
    };

    useEffect(() => {
        if (google_login === 'true') {
            setContent(
                <View style={styles.container}>
                    <View>
                        <TextInput placeholder='title' />
                        <TextInput placeholder='location' />
                        <TextInput placeholder='description' />
                        <View>
                            <TextInput style={styles.dateInput} placeholder="Start Date" />
                            <TextInput style={styles.dateInput} placeholder="End Date" />
                        </View>
                        <Button title='Schedule Event' onPress={postEvent} />
                    </View>
                </View>
            );
        } else if (google_login === 'false') {
            setContent(
                <View style={styles.loginMessage}>
                    <View><Text>Please log in with google to continue</Text></View>
                    <View><GoogleLogin /></View>
                </View>
            );
        }
    }, [setContent, google_login]);

    return (
        <View style={styles.container}>
            {Content}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 15,
    },
    loginMessage: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    dateInput: {
        marginBottom: 10,
    }
});

export default HomeFunctionality;
