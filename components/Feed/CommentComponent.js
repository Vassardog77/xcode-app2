// CommentComponentNative.js
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, TouchableWithoutFeedback, Keyboard, ScrollView } from 'react-native';
import { v4 as uuidv4 } from 'uuid'; 
import { createComment } from '../../actions/commentActions';
import { sendNotification } from '../../actions/notificationActions';
import ReplyComponent from './ReplyComponent'; // Ensure you've a React Native version of this.
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faReply } from '@fortawesome/free-solid-svg-icons';

const CommentComponentNative = ({ post, current_user, dispatch }) => {
    const [comment, setComment] = useState(''); 
    const [postComments, setPostComments] = useState(post.comments || []);
    const [showReplies, setShowReplies] = useState({});

    useEffect(() => {
        setPostComments(post.comments || []);
    }, [post]);

    const handleSubmitComment = () => {
        if(comment.trim() === '') {
            return;
        }
        const commentId = uuidv4(); 
        const newComment = {id: commentId, postId: post._id, user: current_user.email, comment: comment};
        dispatch(createComment(newComment));
        dispatch(sendNotification({
            type : "comment",
            recipient : [post.creator],
            sender : current_user.email,
            content : {
                message: comment,
                id: post._id
            }
        }));
        setPostComments([...postComments, newComment]);
        setComment('');
    };

    const toggleShowReplies = (commentId) => {
        setShowReplies((prevShowReplies) => ({
            ...prevShowReplies,
            [commentId]: !prevShowReplies[commentId],
        }));
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <TextInput
                        style={{ flex: 1, borderWidth: 1, borderColor: 'gray', borderRadius: 5, margin: 10 }}
                        value={comment}
                        onChangeText={setComment}
                        placeholder="Add a comment..."
                    />
                    <Button title="Submit" onPress={handleSubmitComment} />
                </View>
                <ScrollView>
                    {postComments.slice().reverse().map((cmt) => (
                        <View key={cmt._id} style={styles.commentContainer}>
                            <View style={styles.commentHeader}>
                                <Text>
                                    <Text style={{fontWeight: 'bold'}}>{cmt.user.split('@')[0]}</Text>: {cmt.comment}
                                </Text>
                                <TouchableWithoutFeedback onPress={() => toggleShowReplies(cmt.id)}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <FontAwesomeIcon icon={faReply} />
                                        <Text>{showReplies[cmt.id] ? "" : ""}</Text>
                                    </View>
                                </TouchableWithoutFeedback>
                            </View>
                            {showReplies[cmt.id] && <ReplyComponent parentComment={cmt} post={post} current_user={current_user} dispatch={dispatch} />}
                        </View>
                    ))}
                </ScrollView>
            </View>
        </TouchableWithoutFeedback>
    );
};

const styles = {
    commentContainer: {
        marginBottom: 10,
        marginRight: '5%' // This sets the margin on the right side to 20%.
    },
    commentHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    }
};

export default CommentComponentNative;