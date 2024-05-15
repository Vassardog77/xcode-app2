//ported to react native
import * as api from '../api'

export const likePost = (config) => async (dispatch) => {
    try {
        const data = await api.likePost(config) //comes from api index.js 
        dispatch({ type: 'LIKE_POST', payload: data }) 
    } catch (error) {
        console.log(error)
    }
}