import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { base_url } from "../../api";
import { useDispatch } from 'react-redux';
import { sendNotification } from '../../actions/notificationActions';
import Addpeople from "./Addpeople";
import RenameChat from "./RenameChat";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { 
  View, Text, TextInput, TouchableOpacity, ScrollView, 
  StyleSheet, KeyboardAvoidingView, Platform 
} from 'react-native';

function Chat({ route }) {
  const { socket, username, room } = route.params;
  const dispatch = useDispatch();
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const [messageHistory, setMessageHistory] = useState([]);
  const [currentUser, setCurrentUser] = useState({});
  const chatWindowRef = useRef(null);

  useEffect(() => {
    (async () => {
      const user = await AsyncStorage.getItem('user');
      setCurrentUser(JSON.parse(user));
    })();
  }, []);

  let roomEmails = room.split(",").map(email => email.trim());
  let recipient = roomEmails.filter(email => email !== currentUser.email);

  const scrollToBottom = () => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollToEnd({ animated: true });
    }
  };

  const sendMessage = async () => {
    if (currentMessage !== "") {
      const messageData = {
        room: room,
        author: username,
        message: currentMessage,
        time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes(),
      };

      await socket.emit("send_message", messageData);
      setMessageList((list) => [...list, messageData]);
      setCurrentMessage("");

      dispatch(sendNotification({
        type : "message",
        room: room,
        recipient : recipient,
        sender : currentUser.email,
        content : messageData
      }));
    }
  };

  useEffect(() => {
    axios.post(base_url+'/chats', { "room": room })
      .then(response => {
        if (response.data){
          setMessageHistory(response.data);
        }
      });
  }, []);

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessageList((list) => [...list, data]);
    });
    // Cleanup to avoid memory leaks on unmounting
    return () => socket.off("receive_message");
  }, [socket]);

  return (
    !room || room === "undefined" ? <View /> :
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.addPeopleButton}>
        <Addpeople room={room} />
        <RenameChat room={room} />
      </View>
      <ScrollView 
        ref={chatWindowRef} 
        style={styles.chatWindow}
        onContentSizeChange={scrollToBottom}
      >
        <View style={styles.chatBody}>
          {messageHistory.concat(messageList).map((messageContent) => (
            <View key={messageContent._id}>
              <Text style={username === messageContent.author ? styles.messageYou : styles.messageOther}>
                {messageContent.message}
              </Text>
              <Text style={username === messageContent.author ? styles.messageAuthorYou : styles.messageAuthorOther}>
                {messageContent.author.split('@')[0]}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
      <View style={styles.chatFooter}>
        <TextInput
          style={styles.input}
          value={currentMessage}
          placeholder="message..."
          onChangeText={setCurrentMessage}
          onSubmitEditing={sendMessage}
        />
        <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
          <Text>&#9658;</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  addPeopleButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },
  chatWindow: {
    flex: 1,
  },
  chatBody: {
    padding: 10,
  },
  messageYou: {
    alignSelf: 'flex-end',
    backgroundColor: '#e1ffc7',
    padding: 10,
    borderRadius: 5,
    margin: 5,
  },
  messageOther: {
    alignSelf: 'flex-start',
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    margin: 5,
  },
  messageAuthorYou: {
    alignSelf: 'flex-end',
    fontSize: 10,
    color: '#aaa',
  },
  messageAuthorOther: {
    fontSize: 10,
    color: '#aaa',
  },
  chatFooter: {
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginRight: 10,
    padding: 5,
  },
  sendButton: {
    padding: 10,
  },
});

export default Chat;
