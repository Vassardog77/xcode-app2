//ported to react native
import * as api from '../api'

export const postCalendarEvent = (config) => async (dispatch) => {
    try {
        const data = await api.postCalendarEvent(config) //comes from api index.js 
        dispatch({ type: 'CREATE', payload: data })
    } catch (error) {
        console.log(error)
    }
}