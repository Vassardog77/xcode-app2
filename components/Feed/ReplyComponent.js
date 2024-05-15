import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { v4 as uuidv4 } from 'uuid';
import { createComment } from '../../actions/commentActions';
import { sendNotification } from '../../actions/notificationActions';

const ReplyComponent = ({ parentComment, post, current_user, dispatch }) => {
    const [newReply, setNewReply] = useState('');
    const [parentCommentReplies, setParentCommentReplies] = useState(parentComment.replies || []);

    useEffect(() => {
        setParentCommentReplies(parentComment.replies || []);
    }, [parentComment]);

    const handleAddReply = () => {
        if (newReply.trim() === '') {
            return;
        }
        const replyId = uuidv4();
        const newReplyData = {
            id: replyId,
            postId: post._id,
            parentCommentId: parentComment.id,
            user: current_user.email,
            reply: newReply
        };
        dispatch(createComment(newReplyData));
        dispatch(sendNotification({
            type: "reply",
            recipient: [parentComment.user],
            sender: current_user.email,
            content: {
                message: newReply,
                id: post._id
            }
        }));
        setParentCommentReplies([...parentCommentReplies, newReplyData]);
        setNewReply('');
    };

    return (
        <View style={styles.replyContainer}>
            <View>
                {parentCommentReplies.slice().reverse().map((reply) => (
                    <View key={reply.id} style={styles.replyItem}>
                        <Text style={styles.replyText}>
                            <Text style={styles.boldText}>{reply.user.split('@')[0]}</Text>: {reply.reply}
                        </Text>
                    </View>
                ))}
            </View>
            <View style={styles.replyBar}>
                <TextInput
                    style={styles.textInput}
                    value={newReply}
                    onChangeText={setNewReply}
                    placeholder="Add a reply..."
                />
                <Button title="Submit" onPress={handleAddReply} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    replyContainer: {
        flex: 1,
        padding: 10
    },
    replyItem: {
        marginVertical: 5
    },
    replyText: {
        fontSize: 14
    },
    boldText: {
        fontWeight: 'bold'
    },
    replyBar: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10
    },
    textInput: {
        flex: 1,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        marginRight: 10,
        padding: 5
    }
});

export default ReplyComponent;
