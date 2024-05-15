import React, { useEffect, useState } from 'react';
import { Configuration, OpenAIApi } from "openai";
import axios from 'axios';
import { base_url } from "../../api";
import { View, Text, TextInput, Button, StyleSheet, ScrollView } from 'react-native';

function Chatbot() {
  const [content, setContent] = useState("");
  const [postDescription, setPostDescription] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [apiKey, setApiKey] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios.post(base_url + '/posts/chatbot')
      .then(res => setApiKey(res.data.key))
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    if (!apiKey || !submitted) return;
    const openai = new OpenAIApi(new Configuration({
      apiKey: apiKey
    }));

    const prompt = `
      This is the description of my upcoming social media post: ${postDescription}.
      Can you suggest some catchy captions?
      Note: Please start your response with "Here are some potential captions for your post:" 
      Then immediately start listing the captions in the format of 1. 2. 3. 
      Please never deviate from this format.
      `;

    setLoading(true);
    openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are an expert social media manager." },
        { role: "user", content: prompt }
      ]
    }).then(res => {
      setContent("");
      typeWriterEffect(res.data.choices[0].message.content);
      setSubmitted(false);
      setLoading(false);
    });

  }, [submitted, apiKey]);

  const typeWriterEffect = (text) => {
    let index = 0;
    let temp = '';
    const interval = setInterval(() => {
      if (index < text.length) {
        temp += text.charAt(index);
        setContent(temp);
        index++;
      } else {
        clearInterval(interval);
      }
    }, 50);
  }

  const handleSubmit = () => {
    setSubmitted(true);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Need some help with captions? Try our AI caption generator!</Text>
      <TextInput
        style={styles.textarea}
        multiline
        placeholder="Enter your post description..."
        value={postDescription}
        onChangeText={text => setPostDescription(text)}
  />
      <Button title="Generate Captions" onPress={handleSubmit} />
      {loading ? <Text>Loading...</Text> : <ScrollView style={styles.content}><Text>{content}</Text></ScrollView>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    
    padding: 10
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 30
  },
  textarea: {
    height: 100,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    padding: 10
  },
  content: {
    flex: 1,
    marginTop: 20
  }
});

export default Chatbot;
