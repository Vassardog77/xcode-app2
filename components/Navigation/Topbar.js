import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useLogout } from "../../hooks/useLogout";
import { base_url } from "../../api";
import Notifications from './Notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';

export default function Topbar() {
    const { logout } = useLogout();
    const [currentUser, setCurrentUser] = useState(null);
    
    const notifications = useSelector(state => state.notifications);
    const validNotifications = Array.isArray(notifications)
        ? notifications.filter(notification => ['message', 'comment', 'reply'].includes(notification.type))
        : [];
    const dispatch = useDispatch();

    useEffect(() => {
        async function fetchUserFromStorage() {
            try {
                const userJSON = await AsyncStorage.getItem('user');
                if (userJSON) {
                    setCurrentUser(JSON.parse(userJSON));
                }
            } catch (error) {
                console.error('Error fetching user from storage:', error);
            }
        }

        fetchUserFromStorage();

        if (currentUser && currentUser.email) {
            axios.post(base_url+'/notification/get', {user: currentUser.email})
                .then(response => {
                    dispatch({ type: 'SET_NOTIFICATIONS', payload: response.data });
                })
                .catch(error => {
                    console.error('Error fetching notifications:', error);
                });
        }
    }, [dispatch, currentUser]);

    let notificationCount = validNotifications ? validNotifications.length : 0;

    return (
        <View style={styles.container}>
            <View />
            <View style={styles.rightContainer}>
                <Menu>
                    <MenuTrigger>
                        <View style={styles.bellContainer}>
                            <FontAwesome name="bell" size={30} />
                            {notificationCount > 0 && (
                                <View style={styles.notificationBadge}>
                                    <Text style={styles.notificationCount}>{notificationCount}</Text>
                                </View>
                            )}
                        </View>
                    </MenuTrigger>
                    <MenuOptions customStyles={{ optionsContainer: styles.menuOptions }}>
                        <Notifications />
                    </MenuOptions>
                </Menu>

                {currentUser && currentUser.profile_pic && (
                    <Image source={{ uri: currentUser.profile_pic }} style={styles.profilePic} />
                )}
                <TouchableOpacity onPress={logout}>
                    <Text>Log Out</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        zIndex: 2000,
        elevation: 20,
    },
    rightContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    bellContainer: {
        marginRight: 10
    },
    notificationBadge: {
        position: 'absolute', 
        right: 0, 
        top: 0, 
        backgroundColor: 'red', 
        borderRadius: 10, 
        padding: 5
    },
    notificationCount: {
        color: 'white'
    },
    profilePic: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10
    },
    menuOptions: {
        marginTop: 40, 
        marginLeft: '25%'
    }
});
