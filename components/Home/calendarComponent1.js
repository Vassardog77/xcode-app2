import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

function CalendarComponent1(props) {
    const [Calendar, setCalendar] = useState();
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const user = await AsyncStorage.getItem('user');
                setCurrentUser(JSON.parse(user));
            } catch (error) {
                console.log("Error fetching user from AsyncStorage:", error);
            }
        };
        fetchUser();
    }, []);

    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const todays_date = new Date();
    const [currentMonth, setCurrentMonth] = useState(todays_date.getMonth());
    const [currentYear, setCurrentYear] = useState(todays_date.getFullYear());

    const next_month = () => {
        if (currentMonth === 11) {
            setCurrentMonth(0);
            setCurrentYear(prevYear => prevYear + 1);
        } else {
            setCurrentMonth(prevMonth => prevMonth + 1);
        }
    };

    const previous_month = () => {
        if (currentMonth === 0) {
            setCurrentMonth(11);
            setCurrentYear(prevYear => prevYear - 1);
        } else {
            setCurrentMonth(prevMonth => prevMonth - 1);
        }
    };

    const initialize_calendar = (current_month_parameter, start_of_month_parameter) => {
        let days_in_last_month = new Date(currentYear, current_month_parameter - 1, 0).getDate();
        let days_in_current_month = new Date(currentYear, current_month_parameter, 0).getDate();

        let calendar_array = [];
        let day_count = 1 - start_of_month_parameter;
        for (let i = 0; i < 35; i++) {
            if (day_count < 1) {
                calendar_array.push({
                    "className": 'calendar_element',
                    "id": 'd' + currentYear + '-' + String(current_month_parameter - 1).padStart(2, '0') + '-' + (days_in_last_month + day_count),
                    "key": i,
                    "content": days_in_last_month + day_count,
                });
                day_count++;
            } else if (day_count > days_in_current_month) {
                calendar_array.push({
                    "className": 'calendar_element',
                    "id": 'd' + currentYear + '-' + String(current_month_parameter + 1).padStart(2, '0') + '-' + String(day_count - days_in_current_month).padStart(2, '0'),
                    "key": i,
                    "content": day_count - days_in_current_month,
                });
                day_count++;
            } else {
                calendar_array.push({
                    "className": 'calendar_element',
                    "id": 'd' + currentYear + '-' + String(current_month_parameter).padStart(2, '0') + '-' + String(day_count).padStart(2, '0'),
                    "key": i,
                    "content": day_count,
                });
                day_count++;
            }
        }
        return calendar_array;
    };

    const add_current_date = (calendar_array) => {
        const todayId = 'd' + todays_date.toISOString().slice(0, 10);
        calendar_array.forEach(element => {
            if (element.id === todayId) {
                element.className = "calendar_element current_date";
            }
        });
        return calendar_array;
    };

    const finalize_calendar = (calendar_array) => {
        let final_calendar_array = [];
        for (let i = 0; i < 35; i++) {
            let currentElement = calendar_array[i];
            final_calendar_array.push(
                <View style={[styles.calendarElement, styles[currentElement.className]]} key={i}>
                    <Text>{currentElement.content}</Text>
                </View>
            );
        }
        return final_calendar_array;
    };

    useEffect(() => {
        let start_of_month_in_effect = new Date(currentYear, currentMonth, 1).getDay();
        let calendar_step1 = initialize_calendar(currentMonth + 1, start_of_month_in_effect);
        let calendar_step2 = add_current_date(calendar_step1);
        let calendar_elements = finalize_calendar(calendar_step2);
        setCalendar(<View style={styles.calendarParent}>{calendar_elements}</View>);
    }, [currentMonth, currentYear, currentUser]);
    

    return (
        <View style={styles.home}>
            <View style={styles.calendarTopbar}>
                <TouchableOpacity style={styles.navButton} onPress={previous_month}>
                    <Text>{'<'}</Text>
                </TouchableOpacity>
                <Text style={styles.navButton}>{months[currentMonth]} {currentYear}</Text>
                <TouchableOpacity style={styles.navButton} onPress={next_month}>
                    <Text>{'>'}</Text>
                </TouchableOpacity>
            </View>
            {Calendar}
        </View>
    );
}

const styles = StyleSheet.create({
    home: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        backgroundColor: 'white',
    },
    calendarTopbar: {
        marginTop: 100,
        height: 45,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        marginBottom: 10,
        borderRadius: 8
    },
    navButton: {
        height: 40,
        padding: 10,
        backgroundColor: '#f4f4f4',
        borderRadius: 8
    },
    calendarParent: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        width: '100%',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    calendarElement: {
        width: '14%', // for 7 columns 
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 5,
        backgroundColor: '#f9f9f9',
        borderWidth: 1, // This gives the outline
        borderColor: '#d0d0d0',
        borderRadius: 4,
        marginBottom: 5,
    },
    currentDate: {
        backgroundColor: '#d0e0ff',
    },
    calendarEvent: {
        marginTop: 5,
        padding: 2,
        backgroundColor: '#e6ffe6',
        borderRadius: 2,
    },
    loginMessage: {
        padding: 20,
        alignItems: 'center',
    },
    loginBar: {
        marginTop: 10,
        padding: 10,
        backgroundColor: '#d0d0d0',
        borderRadius: 4,
    }
});

export default CalendarComponent1;
