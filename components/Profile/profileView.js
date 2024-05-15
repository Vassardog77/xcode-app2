import React, { useState, useEffect, useContext, useCallback } from 'react';
import { View, Text, Button, Image, StyleSheet } from 'react-native';
import axios from 'axios';
import { base_url } from '../../api';
import { useNavigation, useRoute } from '@react-navigation/native';
import { AuthContext } from '../../context/AuthContext';

function ProfileView(props) {
    const navigation = useNavigation();
    const route = useRoute();
    const { id, creator } = route.params || {};

    // Get the current user from AuthContext
    const { user: currentUser } = useContext(AuthContext);

    const [Img1, setImg1] = useState('');
    const [Orgname, setOrgname] = useState('');
    const [Img2, setImg2] = useState('');
    const [Contact, setContact] = useState('');
    const [Img3, setImg3] = useState('');
    const [Description, setDescription] = useState('');
    const [Img4, setImg4] = useState('');
    const [noProfile, setNoProfile] = useState(false);

    useEffect(() => {
        const fetchData = async (userEmail) => {
            const email = creator || id || userEmail;

            await axios.post(base_url+'/profiles/get', { data: email })
            .then((response) => {
                if (response.data) {
                    setImg1(response.data.img1);
                    setOrgname(response.data.org_name);
                    setImg2(response.data.img2);
                    setContact(response.data.contact);
                    setImg3(response.data.img3);
                    setDescription(response.data.description);
                    setImg4(response.data.img4);
                    setNoProfile(false);
                } else {
                    setNoProfile(true);
                }
            });
        };

        if (creator) {
            fetchData(creator);
        } else if (currentUser) {
            fetchData(currentUser.email);
        }
    }, [creator]);

    const handlePress = useCallback((tabName, screenName, params = {}) => {
        navigation.navigate(tabName, {
            screen: screenName,
            params: params
        });
    }, [navigation]);

    const messageLink = () => {
        if (currentUser && creator) {
            const roomcode = [currentUser.email, creator].sort().join(', ');
            handlePress('Messages', 'MessagesScreen', { room: roomcode });
        }
    };
    

    return (
        <View style={styles.profile}>
            {creator && (
                <Button title="Message" onPress={messageLink} />
            )}
            {noProfile ? (
                <Text>No profile yet</Text>
            ) : (
                <>
                    <Image source={{ uri: Img1 }} style={styles.profileLogo} />
                    <Text style={styles.profileOrgname}>{Orgname}</Text>
                    <View style={styles.profileMaincontent}>
                        <Text style={styles.profileContact}>{Contact}</Text>
                        <Image source={{ uri: Img2 }} style={styles.image} />
                        <Text style={styles.profileDescription}>{Description}</Text>
                        <Image source={{ uri: Img3 }} style={styles.image} />
                    </View>
                    <Image source={{ uri: Img4 }} style={styles.profileBottomImg} />
                </>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    profile: {
        flex: 1,
        padding: 15,
        alignItems: 'center'
    },
    profileLogo: {
        width: 100,
        height: 100,
        borderRadius: 50
    },
    profileOrgname: {
        fontSize: 18,
        fontWeight: 'bold',
        marginVertical: 10
    },
    profileMaincontent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        marginBottom: 10
    },
    profileContact: {
        fontSize: 16
    },
    profileDescription: {
        fontSize: 14
    },
    image: {
        width: 50,
        height: 50
    },
    profileBottomImg: {
        width: '100%',
        height: 150
    }
});

export default ProfileView;
