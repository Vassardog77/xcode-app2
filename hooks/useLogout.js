import { useAuthContext } from "./useAuthContext"
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';  // <-- Import useNavigation

export const useLogout = () => {
    const { dispatch } = useAuthContext()
    const navigation = useNavigation();  // <-- Use the hook to get navigation object

    const logout = async () => {
        // remove user from storage
        try {
            await AsyncStorage.removeItem('user')

            // dispatch logout action
            dispatch({type: 'LOGOUT'})

            // Navigate to login screen
            navigation.navigate('LoginScreen');  // <-- Navigate to login page
            
        } catch(e) {
            // error reading value
            console.error(e);
        }
    }
    return {logout}
}
