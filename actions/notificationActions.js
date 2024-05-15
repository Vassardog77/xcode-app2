import * as api from '../api';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const sendNotification = (config) => async (dispatch) => {
    try {
        const token = await registerForPushNotificationsAsync();
        if (token) {
            config.token = token;  // Adding token to your configuration
            const data = await api.sendNotification(config);
            dispatch({ type: 'SEND_NOTIFICATION', payload: data });
        }
    } catch (error) {
        console.error(error);
        dispatch({ type: 'NOTIFICATION_ERROR', payload: error.message });
    }
}

export const updateNotification = (config) => async (dispatch) => {
    try {
        console.log("updating expo push notification")
        const data = await api.updateNotification(config);
        dispatch({ type: 'UPDATE_NOTIFICATION', payload: data });

    } catch (error) {
        console.error(error);
        dispatch({ type: 'NOTIFICATION_ERROR', payload: error.message });
    }
}

export const registerForPushNotificationsAsync = async () => {
    let token;
    try {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        if (finalStatus !== 'granted') {
            alert('Failed to get push token for push notification!');
            return;
        }
        token = (await Notifications.getExpoPushTokenAsync()).data;

        if (Platform.OS === 'android') {
            Notifications.setNotificationChannelAsync('default', {
                name: 'default',
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#FF231F7C',
            });
        }

    } catch (error) {
        console.error(error);
        alert('An error occurred while registering for notifications');
    }
    
    return token;
};

export const deleteNotification = (config) => async (dispatch) => {
    try {
        const data = await api.deleteNotification(config);
        dispatch({ type: 'DELETE_NOTIFICATION', payload: data });

        // Updating the AsyncStorage with the new notifications data
        await AsyncStorage.setItem('notifications', JSON.stringify(data));
    } catch (error) {
        console.error(error);
        dispatch({ type: 'NOTIFICATION_ERROR', payload: error.message });
    }
}
