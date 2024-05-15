import React, { useState } from 'react';
import { View, Button, Text } from 'react-native';
import ProfileEdit from './profileEdit';
import ProfileView from './profileView';

function ProfileMain(props) {

    const [View_mode, setView_mode] = useState(true);
    const [Content, setContent] = useState(<ProfileView />);
    const [ButtonText, setButtonText] = useState("Edit Profile");

    const change_view = () => {
        if (View_mode) {
            setContent(<ProfileEdit />);
            setButtonText("View Profile");
            console.log(View_mode);
            setView_mode(false);
        } else {
            setContent(<ProfileView />);
            setButtonText("Edit Profile");
            console.log(View_mode);
            setView_mode(true);
        }
    };

    return (
        <View style={{ flex: 1 }}>
            <Button 
                title={ButtonText} 
                onPress={change_view} 
            />
            {Content}
        </View>
    );
}

export default ProfileMain;
