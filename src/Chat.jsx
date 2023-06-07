import React, { useState, useEffect } from "react";
import {
  Typography,
  TextField,
  Button
} from "@mui/material";
import "./Chat.css";
const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.REACT_APP_OPENAI_KEY,
});

const openai = new OpenAIApi(configuration);

function Chat() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (messages.length && messages[messages.length - 1].role === "user") {
      async function fetchAIResponse() {
        const response = await openai.createChatCompletion({
          model: "gpt-4",
          messages: messages,
        });
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            role: "assistant",
            content: response.data.choices[0].message.content,
          },
        ]);
      }
      fetchAIResponse();
    }
  }, [messages]);

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        role: "user",
        content: input,
      },
    ]);
    setInput("");
  };

  return (
    <div className="chat-container">
      <Typography variant="h4">Chat</Typography>
      <div className="chat-history">
        {messages.map((message, index) => (
          <div key={index}>
            <strong>{message.role}: </strong>
            {message.content}
          </div>
        ))}
      </div>

      <form onSubmit={handleFormSubmit}>
        <TextField
          className="chat-input"
          value={input}
          onChange={handleInputChange}
          rows={3}
          multiline
          variant="outlined"
        />
        <Button type="submit" variant="contained" color="primary">Send</Button>
      </form>
    </div>
  );
}

export default Chat;
