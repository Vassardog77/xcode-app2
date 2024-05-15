import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { createPost } from '../../actions/posts';
import Chatbot from './Chatbot';
import InstagramLogin from '../MediaLogin/InstagramLogin';
import FacebookLogin from '../MediaLogin/FacebookLogin';
import { base_url } from '../../api';
import { View, Text, TextInput, Button, StyleSheet, Alert, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';

function Form({ navigation }) { 
    const [instagram_login, setInstagramLogin] = useState(null);
    const [current_user, setCurrentUser] = useState(null);
    const [imageConfirmed, setImageConfirmed] = useState(false);


    useEffect(() => {
        (async () => {
            const igLogin = await AsyncStorage.getItem('instagram_login');
            const user = await AsyncStorage.getItem('user');
            setInstagramLogin(igLogin);
            setCurrentUser(JSON.parse(user));
        })();
    }, []);

    const [postData, setPostData] = useState({
        creator: '',
        message: '',
        tags: '',
        selectedFile: '',
        date: ''
    });
    
    useEffect(() => {
        if (current_user) {
            setPostData(prevState => ({ ...prevState, creator: current_user.email }));
        }
    }, [current_user]);
    
    const [MediaSelector, setMediaSelector] = useState("Network");
    const [CreationId, setCreationId] = useState("");

    const change_mediaselector_instagram = () => {
        setMediaSelector("Instagram");
    };

    const change_mediaselector_network = () => {
        setMediaSelector("Network");
    };

    const dispatch = useDispatch();

    const handleSubmit = (e) => {
        e.preventDefault();
        if(MediaSelector === "Network") { 
            dispatch(createPost(postData));
            //Alert.alert("Post Created!"); 
            setPostData({ creator: current_user.email, message: '', tags: '', selectedFile: '', date: '' });
        } else if (MediaSelector === "Instagram") {
            if (postData.date) {
                const delay = new Date(postData.date).getTime() - new Date().getTime();
                if (delay > 0) {
                    setTimeout(() => {
                        axios.post(base_url+"/post/ig1", postData)
                            .then((response) => {
                                console.log(JSON.stringify(response.data));
                                setCreationId(response.data.id);
                                //Alert.alert("Post Created!"); 
                                setPostData({ creator: current_user.email, message: '', tags: '', selectedFile: '', date: '' });
                            })
                            .catch((error) => {
                                Alert.alert("Error Creating Post. \nPlease make sure that you are logged in and try again");
                                console.log(error);
                            });
                    }, delay);
                } else {
                    //Alert.alert("The date/time must be in the future.");
                }
            } else {
                axios.post(base_url+"/post/ig1", postData)
                    .then((response) => {
                        console.log(JSON.stringify(response.data));
                        setCreationId(response.data.id);
                        setPostData({ creator: current_user.email, message: '', tags: '', selectedFile: '', date: '' });
                    })
                    .catch((error) => {
                        //Alert.alert("Error Creating Post. \nPlease make sure that you are logged in and try again");
                        console.log(error);
                    });
            }
        }
        navigation.navigate('FeedScreen');
    };

    const clear = () => {
        setPostData({ creator: current_user.email, message: '', tags: '', selectedFile: '', date: '' });
    };

    useEffect(() => {
        if(CreationId === "") {
            return;
        }
        axios.post(base_url+"/post/ig2", {
            "creation_id":CreationId,
            "user": current_user.email
        });
    }, [CreationId]);

    useEffect(() => {
        if ((instagram_login === 'false' || instagram_login === null) && MediaSelector === "Instagram") {
            console.log("not logged in with instagram");
        }
    }, [instagram_login, MediaSelector]);

    useEffect(() => {
        (async () => {
            if (Platform.OS !== 'web') {
                const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                if (status !== 'granted') {
                    Alert.alert('Sorry, we need camera roll permissions to make this work!');
                }
            }
        })();
    }, []);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            quality: 1,
            base64: true
        });
        
        if (!result.cancelled) {
            const base64Data = result.assets[0].base64; 
            if (base64Data) {
                const base64String = `data:image/jpeg;base64,${base64Data}`; 
                setPostData({ ...postData, selectedFile: base64String });
                setImageConfirmed(true);  // Confirm that an image is selected
            }
        }
    };


    return (
        <View style={styles.post_maker}>
            <View style={styles.media_selector_button}>
                <Text>Posting to: {MediaSelector}</Text>
            </View>

            {(instagram_login === 'false' || instagram_login === null) && MediaSelector === "Instagram" ? (
                <View style={styles.login_message}>
                    <Text>Please log in with Instagram to continue</Text>
                    <View style={styles.Loginbar}>
                        <FacebookLogin />
                        <InstagramLogin />
                    </View>
                </View>
            ) : (
                <View>
                    <Button title="Pick an image" onPress={pickImage} />
                    {imageConfirmed && <Text style={{ fontWeight: "bold", marginLeft: 10, marginTop: 10, color: 'green' }}>Image Attached!</Text>}
                    <TextInput style={styles.textarea} multiline placeholder='Message...' value={postData.message} onChangeText={(text) => setPostData({ ...postData, message: text })} />
                    <Button title="Submit Post" onPress={handleSubmit} />
                </View>
            )}
            {/*<Chatbot/>*/}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 15
    },
    mediaSelectorButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    loginMessage: {
        alignItems: 'center'
    },
    loginBar: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    input: {
        borderWidth: 1,
        borderColor: 'gray',
        padding: 10,
        marginVertical: 5,
    },
    textarea: {
        margin: 12,
        height: 100,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 20,
        padding: 10
    },
});

export default Form;
