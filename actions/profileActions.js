//ported to react native
import * as api from '../api'

export const postProfile = (config) => async (dispatch) => {
    try {
        const data = await api.postProfile(config) //comes from api index.js 
        dispatch({ type: 'CREATE', payload: data }) 
    } catch (error) {
        console.log(error)
    }
}