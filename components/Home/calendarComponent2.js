import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { base_url } from '../../api';
import GoogleLogin from '../MediaLogin/GoogleLogin'; // Ensure this is compatible with React Native.
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

function CalendarComponent2({ navigation }) {

    let [Calendar, setCalendar] = useState()
    let [MonthIncrement, setMonthIncrement] = useState(0)
    const [currentUser, setCurrentUser] = useState(null)

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const user = await AsyncStorage.getItem('user');
                setCurrentUser(JSON.parse(user));
            } catch (error) {
                console.log("Error fetching user from AsyncStorage:", error);
            }
        }
        fetchUser();
    }, []);

    // Initializing months
    let months = ["January","February","March","April","May","June","July","August","September","October","November","December"]

    const todays_date = new Date();
    let todays_date_iso = todays_date.toISOString().slice(0, 10)
   
    let current_month = (todays_date.getMonth()+1) // Displays the Current Month (1-12)
    let start_of_month = new Date((current_month+MonthIncrement)+", 1, 2023").getDay()

    let next_month = () => { setMonthIncrement(MonthIncrement+1) } // Function to change calendar to next month
    let previous_month = () => { setMonthIncrement(MonthIncrement-1) } // Function to change calendar to previous month

    let initialize_calendar = () => {
        let days_in_last_month = new Date(2023, (current_month+MonthIncrement-1), 0).getDate()
        let days_in_current_month = new Date(2023, (current_month+MonthIncrement), 0).getDate()

        let calendar_array = []
        let day_count = 1 - start_of_month
        for (let i = 0; i < 35; i++) {
            if (day_count < 1) {//last months dates
                //creating first calendar array
                calendar_array.push({
                     "className":'calendar_element',
                    "id":'d2023-'+String(current_month+MonthIncrement-1).padStart(2, '0')+'-'+(days_in_last_month+day_count),
                    "key":i,
                    "content":days_in_last_month+day_count,
                })
                day_count++
            } else if (day_count > days_in_current_month){//next months dates
                calendar_array.push({
                    "className":'calendar_element', 
                    "id":'d2023-'+String(current_month+MonthIncrement+1).padStart(2, '0')+'-'+String(day_count-days_in_current_month).padStart(2, '0'), 
                    "key":i,
                    "content":day_count-days_in_current_month,
                })
                day_count++
            } else {//this months dates
                calendar_array.push({
                    "className":'calendar_element', 
                    "id":'d2023-'+String(current_month+MonthIncrement).padStart(2, '0')+'-'+String(day_count).padStart(2, '0'), 
                    "key":i,
                    "content":day_count,
                }) 
                day_count++
            }
        }
        return(calendar_array)
    }

    let add_current_date = (calendar_array) => { //adds a new class to the current date so it can be displayed differently 
        calendar_array.forEach(async element => {
            if (element.id === 'd'+todays_date_iso) {
                element.className = "calendar_element current_date"
            }
        })
        return(calendar_array)
    }

    let finalize_calendar = (calendar_array) => {
        let final_calendar_array = [];
        for (let i = 0; i < 35; i++) {
            let currentElement = calendar_array[i];
            if (currentElement.events) {
                let calendar_event_elements = [];
                currentElement.events.forEach(event => {
                    calendar_event_elements.push(
                        <View key={event.summary} style={styles.calendarEvent}>
                            <Text>{event.summary}</Text>
                        </View>
                    );
                });
                final_calendar_array.push(
                    <View style={[styles.calendarElement, styles[currentElement.styleName]]} key={i}>
                        <Text>{currentElement.content}</Text>
                        {calendar_event_elements}
                    </View>
                );
            } else {
                final_calendar_array.push(
                    <View style={[styles.calendarElement, styles[currentElement.styleName]]} key={i}>
                        <Text>{currentElement.content}</Text>
                    </View>
                );
            }
        }
        return final_calendar_array;
    }
    

    let add_events_callback = (calendar_array,events) => {
        calendar_array.forEach(async calendar_element => {
            events.forEach(async event_element => {
                if(event_element.start.dateTime) {
                    if (calendar_element.id.slice(1, 11) === event_element.start.dateTime.slice(0, 10)) {
                        if(calendar_element.events) {
                            calendar_element.events.push(event_element)
                        } else {
                            calendar_element.events = [event_element]
                        }
                    }
                }
            })
        })
    return(calendar_array)
    }

    let add_events = (calendar_array) => {
        if (currentUser && currentUser.email) {
            axios.post(base_url+'/calendar/get', { "user": currentUser.email })
            .then(response => {
                let events = response.data.items;
                let calendar_array_final = add_events_callback(calendar_array, events);
                let calendar_elements = finalize_calendar(calendar_array_final);
                setCalendar(<View style={styles.calendarParent}>{calendar_elements}</View>);
            })
            .catch(error => {
                // Log the detailed error information to the console
                // ... [no changes in the error handling section]
                setCalendar(null);
            });
        } else {
            console.log("User data not available yet.");
            return null;
        }
        return calendar_array;
    }
    
    useEffect(() => { 
       let calendar_step1 = initialize_calendar()
       let calendar_step2 = add_current_date(calendar_step1)
       add_events(calendar_step2)
      }, [MonthIncrement, start_of_month, current_month, currentUser])

    return (
        <View style={styles.home}>
            <View style={styles.calendarTopbar}>
                <TouchableOpacity style={styles.navButton} onPress={previous_month}>
                    <Text>{'<'}</Text>
                </TouchableOpacity>
                <Text>{months[(current_month+MonthIncrement-1)]}</Text>
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
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#f4f4f4',
        marginBottom: 10,
    },
    navButton: {
        padding: 10,
        backgroundColor: '#e0e0e0',
        borderRadius: 4,
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

export default CalendarComponent2;
