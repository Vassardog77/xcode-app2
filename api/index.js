//ported to react native
import axios from "axios";
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

var baseurl = Platform.OS === 'ios' ? "http://localhost:5000" : "https://api.network770.com"

export const base_url = baseurl

const postUrl = base_url+'/posts'
const FbLoginUrl = base_url+'/login/fb'
const GLoginUrl = base_url+'/login/g'
const DcLoginUrl = base_url+'/login/dc'
const emailUrl = base_url+'/email/send'
const calendarUrl = base_url+'/calendar/post'
const analyticsUrl = base_url+'/analytics/ig'
const profileUrl = base_url+'/profiles/post'
const commentUrl = base_url+'/comment'
const likeUrl = base_url+'/like'
const notificationUrl = base_url+'/notification/post'
const notificationUrl2 = base_url+'/notification/delete'
const notificationUrl3 = base_url+'/notification/update'
const AddpeopleUrl = base_url+'/chats/addpeople'
const renameChatUrl = base_url+'/chats/rename'

export const fetchPosts = () => axios.get(postUrl)
export const createPost = (newPost) => axios.post(postUrl, newPost)
export const deletePost = (id) => {axios.delete(`${postUrl}/${id}`)}

export const getFbLogin = async (config) => {
    const response = await axios.post(FbLoginUrl, config)
    await AsyncStorage.setItem('facebook_login', 'true')
    return response
}

export const getGLogin = async (config) => {
    const response = await axios.post(GLoginUrl, config)
    await AsyncStorage.setItem('google_login', 'true')
    return response
}

export const getDcLogin = async (config) => {
    const response = await axios.post(DcLoginUrl, config)
    console.log("discord test?")
    await AsyncStorage.setItem('discord_login', 'true')
    return response
}

export const postEmail = (config) => axios.post(emailUrl, config)
.then((response) => {
    return response
})

export const postCalendarEvent = (config) => axios.post(calendarUrl, config)
.then((response) => {
    return response
})

export const getAnalytics = (config) => axios.post(analyticsUrl, config)
.then((response) => {
    return response
})

export const postProfile = (config) => axios.post(profileUrl, config)
.then((response) => {
    return response
})

export const createComment = (config) => axios.post(commentUrl, config)
.then((response) => {
    return response
})

export const likePost = (config) => axios.post(likeUrl, config)
.then((response) => {
    return response
})

export const sendNotification = (config) => axios.post(notificationUrl, config)
.then((response) => {
    return response
})

export const deleteNotification = (config) => axios.post(notificationUrl2, config)
.then((response) => {
    return response
})

export const updateNotification = (config) => axios.post(notificationUrl3, config)
.then((response) => {
    return response
})

export const addPeople = (config) => axios.post(AddpeopleUrl, config)
.then((response) => {
    return response
})

export const renameChat = (config) => axios.post(renameChatUrl, config)
.then((response) => {
    return response
})
