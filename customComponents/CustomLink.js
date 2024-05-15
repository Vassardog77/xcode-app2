//ported to react native
import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function CustomLink({ to, children, style, activeStyle, ...props }) {
    const navigation = useNavigation();
    const route = useRoute();
    
    const isActive = route.name === to;
    const content = typeof children === 'string'
        ? <Text>{children}</Text>
        : children;

    return (
        <TouchableOpacity
            onPress={() => navigation.navigate(to)}
            style={isActive ? [style, activeStyle] : style}
            {...props}
        >
            {content}
        </TouchableOpacity>
    );
}


