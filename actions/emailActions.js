//ported to react native
import * as api from '../api'

export const postEmail = (config) => async (dispatch) => {
    try {
        const data = await api.postEmail(config) //comes from api index.js 
        dispatch({ type: 'CREATE', payload: data }) 
    } catch (error) {
        console.log(error)
    }
}