import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { View, Text, Button, StyleSheet, ScrollView } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { getPosts } from '../../actions/posts';
import Posts from './Posts';
import AsyncStorage from '@react-native-async-storage/async-storage';

function Feed({ navigation }) {
    const dispatch = useDispatch();
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        dispatch(getPosts());
    }, [dispatch]);

    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const userString = await AsyncStorage.getItem('user');
                setCurrentUser(userString ? JSON.parse(userString) : null);
            } catch (error) {
                console.error("Failed reading user from AsyncStorage", error);
            }
        };
        
        fetchCurrentUser();
    }, []);

    const navigateToCreatePost = () => {
        navigation.navigate('FormScreen');
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.componentParent}>

                <View>
                    {/*I dont know why but it breaks if I remove this view*/}
                </View>

                {currentUser && currentUser.account_type !== 'student' && (
                    <View style={styles.createButtonContainer}>
                        <Button title="+ Create Post" onPress={navigateToCreatePost} />
                    </View>
                )}

                <Posts />
                <View style={styles.spacer}></View>
            </View>
        </ScrollView> 
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f4f4f4'
    },
    componentParent: {
        // Add styles similar to your .component_parent class
    },
    createButtonContainer: {
        // Add styles similar to your .create_buttons class
    },
    spacer: {
        // Add styles similar to your .spacer class
    },
});

export default Feed;
