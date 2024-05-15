import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { addPeople } from '../../actions/chatActions';
import axios from "axios";
import { base_url } from "../../api";
import { useDispatch } from 'react-redux';
import DropDownPicker from 'react-native-dropdown-picker';

function Addpeople({ room }) {
    const [users, setUsers] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [addingPeople, setAddingPeople] = useState(false);

    useEffect(() => {           
        axios.get(base_url+'/api/user/get')
        .then(response => {
            setUsers(response.data.map(user => ({ label: user.email, value: user.email })));
        })
    }, []);

    const dispatch = useDispatch();

    let add_people = () => {
        if (!room || room === "undefined" || selectedUsers.length === 0) {
            console.log("Room is undefined or no users selected. Can't submit.")
            return;
        }
        console.log("dispatching");
        dispatch(addPeople({
            room,
            selectedUsers
        }));
        setAddingPeople(false);
        setSelectedUsers([]);
    }

    const handleSelectChange = (items) => {
        setSelectedUsers(items);
    }

    const handleClickAdd = () => {
        setAddingPeople(true);
    }

    const handleCancel = () => {
        setAddingPeople(false);
        setSelectedUsers([]);
    }

    return (
        <View style={styles.container}>
            {addingPeople ? 
                <>
                    <DropDownPicker
                        items={users}
                        multiple={true}
                        multipleText="%d items have been selected."
                        min={0}
                        max={10}
                        defaultValue={selectedUsers}
                        containerStyle={{ height: 40 }}
                        style={{ backgroundColor: '#fafafa' }}
                        dropDownStyle={{ backgroundColor: '#fafafa' }}
                        onChangeItem={items => handleSelectChange(items)}
                    />
                    <TouchableOpacity onPress={add_people} style={styles.button}>
                        <Text>Submit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleCancel} style={styles.button}>
                        <Text>Cancel</Text>
                    </TouchableOpacity>
                </> 
                :
                <TouchableOpacity onPress={handleClickAdd} style={styles.button}>
                    <Text>+ Add People</Text>
                </TouchableOpacity>
            }
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10
    },
    button: {
        padding: 10,
        backgroundColor: '#ddd',
        marginVertical: 5,
        alignItems: 'center'
    }
});

export default Addpeople;
