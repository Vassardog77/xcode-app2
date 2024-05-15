//ported to react native
import * as api from '../api'

export const getAnalytics = (config) => async (dispatch) => {
    try {
        const data = await api.getAnalytics(config) //comes from api index.js 
        dispatch({ type: 'FETCH_ALL', payload: data }) 
    } catch (error) {
        console.log(error)
    }
}