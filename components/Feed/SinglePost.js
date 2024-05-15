import React, { useEffect, useContext } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { getPosts } from '../../actions/posts';
import { deleteNotification } from '../../actions/notificationActions';
import Posts from './Posts';
import { AuthContext } from '../../context/AuthContext';

function SinglePost({ route }) {
    const { id } = route.params; // Using passed props directly.
    
    // Use the context to get the current user
    const { user: currentUser } = useContext(AuthContext);

    const dispatch = useDispatch();
    const notifications = useSelector(state => state.notifications);

    useEffect(() => {
        dispatch(getPosts());
    }, [dispatch]);

    const posts = useSelector((state) => state.posts);
    const post = posts.find(post => post._id === id);

    useEffect(() => {
        if (post && currentUser) {
            let newNotifications = Array.isArray(notifications) ? notifications.filter((notification) => {
                if ((notification.type === 'comment' || notification.type === 'reply') && notification.content.id === post._id) {
                    dispatch(deleteNotification({ user: currentUser.email, unreads: notification }));
                    return false;
                }
                return true;
            }) : [];
        }
    }, [post, notifications, dispatch, currentUser]);

    if (!post) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    return (
        <View style={{ flex: 1 }}>
            <Posts post={post} />
        </View>
    );
}

export default SinglePost;
