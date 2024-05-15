//ported to react native
import { combineReducers } from 'redux';
import posts from './posts';
import notifications from './notificationReducers'; // Make sure to import your notifications reducer here

export default combineReducers({
    posts,
    notifications // Make sure to include notifications in your combined reducers
});
