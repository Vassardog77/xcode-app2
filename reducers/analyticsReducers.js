//ported to react native
import { combineReducers } from "redux";

let analytics = (analytics = [], action) => {
    switch (action.type) {    
        case 'FETCH_ALL':
            return action.payload             //shows what to do in each function case     
        default:
            return analytics
    }
}
export default combineReducers({analytics})