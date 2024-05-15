import React, {useCallback} from 'react';
import { useSelector } from 'react-redux';
import { Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MenuOption } from 'react-native-popup-menu';

const Notifications = () => {
    const navigation = useNavigation();
    const notifications = useSelector(state => state.notifications);
    const validNotifications = Array.isArray(notifications)
        ? notifications.filter(notification => ['message', 'comment', 'reply'].includes(notification.type))
        : [];

        const handlePress = useCallback((tabName, screenName, params = {}) => {
            navigation.navigate(tabName, {
                screen: screenName,
                params: params
            });
        }, [navigation]);

    return (
        <>
            {(!Array.isArray(validNotifications) || validNotifications.length === 0) ? (
                <MenuOption onSelect={() => {}}>
                    <Text>No new notifications</Text>
                </MenuOption>
            ) : (
                validNotifications.reverse().map((notification, index) => {
                    let path;
                    let extraParams = {}; // Define extra parameters here

                    if (notification.type === 'message') {
                        path = {tab: 'Messages', screen: 'MessagesScreen'};
                        extraParams = {room: notification.content.room}; // Passing the room prop to MessagesScreen
                    } else if (notification.type === 'comment' || notification.type === 'reply') {
                        path = {tab: 'Feed', screen: 'SinglePostScreen'};
                        extraParams = {id: notification.content.id}; // Passing the room prop to MessagesScreen
                    }

                    const messageContent = (notification.content && typeof notification.content.message === 'string') 
                        ? (notification.content.message.length > 20 ? notification.content.message.slice(0, 20) + '...' : notification.content.message) 
                        : 'No message';
                    const senderName = (typeof notification.sender === 'string' ? notification.sender.split('@')[0] : 'unknown');

                    return path ? (
                        <MenuOption key={index} onSelect={() => handlePress(path.tab, path.screen, extraParams)}>
                            <Text>New {notification.type} from {senderName}: "{messageContent}"</Text>
                        </MenuOption>
                    ) : (
                        <MenuOption key={index} onSelect={() => {}}>
                            <Text>New {notification.type} from {senderName}: "{messageContent}"</Text>
                        </MenuOption>
                    )
                })
            )}
        </>
    );
}

export default Notifications;
