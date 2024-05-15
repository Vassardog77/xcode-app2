//ported to react native
import * as api from '../api'

export const createComment = (config) => async (dispatch) => {
    try {
        const data = await api.createComment(config) //comes from api index.js 
        dispatch({ type: 'CREATE_COMMENT', payload: data }) 
    } catch (error) {
        console.log(error)
    }
}