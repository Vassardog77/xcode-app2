//ported to react native
import * as api from '../api'

export const addPeople = (config) => async (dispatch) => {
    try {
        const data = await api.addPeople(config) //comes from api index.js 
        dispatch({ type: 'ADD_PEOPLE', payload: data }) 
    } catch (error) {
        console.log(error)
    }
}

export const renameChat = (config) => async (dispatch) => {
    try {
        const data = await api.renameChat(config) //comes from api index.js 
        dispatch({ type: 'RENAME', payload: data }) 
    } catch (error) {
        console.log(error)
    }
}

