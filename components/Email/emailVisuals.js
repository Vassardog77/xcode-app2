import React, { useState, useEffect } from 'react';
import { View, Text, Button, TextInput, ScrollView, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { base_url } from '../../api';
import EmailFunctionality from './emailFunctionality';
//import GoogleLogin from '../MediaLogin/GoogleLogin'; // Ensure this is adapted for React Native
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faInbox, faEnvelope } from '@fortawesome/free-solid-svg-icons';

const getEmailUser = async () => {
    const user = await AsyncStorage.getItem('user');
    return JSON.parse(user);
}

const Emailvisuals = (props) => {
    const [Emails, setEmails] = useState([...Array(5)].map(() => ({ name: '', date: '', subject: '', message: '' })));
    const [error, setError] = useState(false);
    const [userEmail, setUserEmail] = useState('');
    const [showPopup, setShowPopup] = useState(false);

    useEffect(() => {
        getEmailUser().then(user => setUserEmail(user?.email));
        
        axios.post(`${base_url}/email/list`, {
            user: userEmail
        })
        .then(response => {
            setEmails(response.data.map(data => ({
                name: data.payload.headers.find(header => header.name === 'From').value,
                date: data.payload.headers.find(header => header.name === 'Date').value,
                subject: data.payload.headers.find(header => header.name === 'Subject').value,
                message: data.snippet
            })));
        })
        .catch(err => {
            console.log(err);
            setError(true);
        });
    }, [userEmail]);

    const displayPopup = () => {
        setShowPopup(!showPopup);
    }

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontSize: 30, fontWeight: 'bold' }}>Coming Soon!</Text>
            <Text style={{ fontSize: 30, fontWeight: 'bold' }}>(With Google Login)</Text>
        {/*<View style={styles.container}>
            <View style={styles.componentParent}>
                <View style={styles.header}>
                    <Text>Email</Text>
                    <FontAwesomeIcon icon={faEnvelope} />
                </View>
                <Button title="+ Send Email" onPress={displayPopup} />
                {error ? (
                    <View style={styles.messageContainer}>
                        <Text>Please log in with google to continue</Text>
                        {<GoogleLogin />}
                    </View>
                ) : (
                    <ScrollView style={styles.emailBox}>
                        <Text>All</Text>
                        <TextInput style={styles.searchBar} placeholder='' />
                        <View style={styles.infoHeader}>
                            <FontAwesomeIcon icon={faInbox} />
                            <View style={styles.headerText}>
                                {["Name", "Subject", "Message", "Date"].map(item => (
                                    <Text key={item}>{item}</Text>
                                ))}
                            </View>
                        </View>
                        {Emails.map((email, index) => (
                            <View key={index} style={styles.emailItem}>
                                <Text>{email.name}</Text>
                                <Text>{email.subject}</Text>
                                <Text>{email.message}</Text>
                                <Text>{email.date}</Text>
                            </View>
                        ))}
                    </ScrollView>
                )}
            </View>
            {showPopup && (
                <View style={styles.popup}>
                    <EmailFunctionality />
                </View>
            )}
        </View>*/}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    componentParent: {
        flex: 1
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    messageContainer: {
        alignItems: 'center'
    },
    emailBox: {
        flex: 1
    },
    searchBar: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1
    },
    infoHeader: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    headerText: {
        flexDirection: 'row'
    },
    emailItem: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    popup: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default Emailvisuals;
