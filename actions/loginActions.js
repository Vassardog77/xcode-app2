//ported to react native
import * as api from '../api'

export const getFbLogin = (config) => async (dispatch) => {
    try {
        const data = await api.getFbLogin(config) //comes from api index.js 
        dispatch({ type: 'FETCH', payload: data }) 
    } catch (error) {
        console.log(error)
    }
}

export const getGLogin = (config) => async (dispatch) => {
    try {
        const data = await api.getGLogin(config) //comes from api index.js 
        dispatch({ type: 'FETCH', payload: data }) 
    } catch (error) {
        console.log(error)
    }
}

export const getDcLogin = (config) => async (dispatch) => {
    try {
        const data = await api.getDcLogin(config) //comes from api index.js 
        dispatch({ type: 'FETCH', payload: data }) 
    } catch (error) {
        console.log(error)
    }
}