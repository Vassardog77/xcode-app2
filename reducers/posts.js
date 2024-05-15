//ported to react native
import { postCalendarEvent } from "../api"

let posts = (posts = [], action) => {
    switch (action.type) {
        case 'DELETE' :
            return posts.filter((post) => post._id !== action.payload)                //shows what to do in each function case     
        case 'FETCH_ALL':
            return action.payload       //payload comes from payload in actions
        case 'CREATE':
            return [...posts, action.payload]
        default:
            return posts
    }
}
export default posts