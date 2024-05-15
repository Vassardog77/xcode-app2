import React from 'react';
import { View, StyleSheet } from 'react-native';
import FacebookLogin from './FacebookLogin';
import GoogleLogin from './GoogleLogin';
import InstagramLogin from './InstagramLogin';

function Loginbar(props) {
    return (
        <View style={styles.loginBar}>
            <FacebookLogin />
            <GoogleLogin />
            <InstagramLogin />
        </View>
    );
}

const styles = StyleSheet.create({
    loginBar: {
        flexDirection: 'row',  // Assuming you want them side-by-side
        justifyContent: 'space-between', // Spacing the buttons evenly
        alignItems: 'center', // Align items to the center vertically if you need
        // Add any additional styling here
    }
});

export default Loginbar;
