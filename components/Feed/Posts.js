import React, { useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { deletePost } from '../../actions/posts';
import { FontAwesome } from '@expo/vector-icons';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import LikeComponent from './LikeComponent';
import CommentComponent from './CommentComponent';
import { AuthContext } from '../../context/AuthContext';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation hook

function Post({ post, current_user, dispatch }) {
    const navigation = useNavigation(); // Use the hook to get navigation

    if (!post) {
        return null;
    }

    return (
        <View style={styles.postContainer}>
            <TouchableOpacity onPress={() => navigation.navigate('ProfileScreen', { creator: post.creator })}>
                <View style={styles.header}>
                    <Image source={{ uri: post?.profile_pic || 'defaultPicLinkHere' }} style={styles.profilePic} />
                    <Text>{post.creator.split('@')[0]}</Text>
                </View>
            </TouchableOpacity>
            {post.selectedFile && <Image source={{ uri: post.selectedFile }} style={styles.postImage} />}
            <View style={styles.postContent}>
                <Text>{post.message}</Text>
                {post.creator === current_user.email && 
                <TouchableOpacity onPress={() => dispatch(deletePost(post._id))}>
                    <FontAwesome name="trash" size={24} color="black" />
                </TouchableOpacity>}
            </View>
            <LikeComponent post={post} current_user={current_user} dispatch={dispatch} />
            <CommentComponent post={post} current_user={current_user} dispatch={dispatch} />
        </View>
    );
}

function Posts({ post: singlePost }) {
    const dispatch = useDispatch();

    // Use AuthContext to fetch the current user
    const { user: currentUser } = useContext(AuthContext);

    const posts = useSelector((state) => state.posts);

    if (!posts || !Array.isArray(posts)) {
        return <Text>Loading posts...</Text>;
    }

    const postsToRender = singlePost ? [singlePost] : posts;

    return (
        <View style={styles.postsContainer}>
            {postsToRender.slice().reverse().map((post, index) => 
                <Post key={index} post={post} current_user={currentUser} dispatch={dispatch} />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    postContainer: {
        marginBottom: 20,
        borderWidth: 1,
        borderColor: 'grey',
        padding: 10,
        backgroundColor: 'white',
        borderRadius: 5,  // Optional: to give rounded corners
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    profilePic: {
        width: 40, 
        height: 40, 
        borderRadius: 20
    },
    postImage: {
        width: '100%', 
        height: 200
    },
    postContent: {
        flexDirection: 'row',
        justifyContent: 'space-between', 
        alignItems: 'center'
    },
    postsContainer: {
        padding: 20
    }
});

export default Posts;
