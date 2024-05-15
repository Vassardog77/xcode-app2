import React, { useState, useEffect, useRef } from 'react';
import { renameChat } from '../../actions/chatActions';
import { useDispatch } from 'react-redux';
import { View, TextInput, Button, TouchableWithoutFeedback, Keyboard } from 'react-native';

function RenameChat({ room }) {
  const dispatch = useDispatch();
  const [newChatName, setNewChatName] = useState('');
  const [showTextArea, setShowTextArea] = useState(false);
  
  useEffect(() => {
    // In React Native, the keyboard itself is a primary source of "outside" taps.
    const handleKeyboardDismiss = () => {
      setShowTextArea(false);
    };

    Keyboard.addListener('keyboardDidHide', handleKeyboardDismiss);

    return () => {
      Keyboard.removeListener('keyboardDidHide', handleKeyboardDismiss);
    };
  }, []);

  const handleButtonClick = () => {
    if (showTextArea) {
      if (room && room !== "undefined") {
        if (newChatName.trim() !== "") {
          console.log("dispatching");
          dispatch(renameChat({
            room: room,
            newChatName: newChatName
          }));
        }
        // Else, you can handle error feedback through a UI component if you'd like.
      }
      setNewChatName('');
      setShowTextArea(false);
    } else {
      setShowTextArea(true);
    }
  }

  return (
    <TouchableWithoutFeedback onPress={() => setShowTextArea(false)}>
      <View style={{ flex: 1 }}>
        {showTextArea && (
          <TextInput 
            placeholder='Add new name...'
            value={newChatName}
            onChangeText={setNewChatName}
            multiline={true} // Since it's acting like a textarea
            style={{ height: 100, borderColor: 'gray', borderWidth: 1, padding: 10 }}
          />
        )}
        <Button title={showTextArea ? 'Submit' : 'Rename Chat'} onPress={handleButtonClick} />
      </View>
    </TouchableWithoutFeedback>
  );
}

export default RenameChat;
