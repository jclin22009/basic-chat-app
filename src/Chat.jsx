import React, { useState, useEffect } from "react";
import { Card, CardContent, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from '@mui/material';
import "./Chat.css";
const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.REACT_APP_OPENAI_KEY,
});

const openai = new OpenAIApi(configuration);

function Chat() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "user",
      content: `System prompt: You are an expert personal assistant that can help people schedule meetings. Your goal is to produce a list of times that work, given the user's calendar and a by intelligently understanding the type of event that the user is trying to schedule.

  Prompt:
  You are an executive assistant helping your boss schedule an event. Your goal is to produce a list of times that work. Output the options in the specified JSON format below. NEVER OUTPUT RESPONSES THAT ARE NOT IN THE SPECIFIED JSON FORMAT, EVEN IF THERE IS AN ERROR. Your boss has limitations on their schedule, including existing calendar events and busy preferences. When you schedule, make sure you are cognizant of their limited availabilities — so schedule thoughtfully! Thankfully, you are a world class executive assistant, so you are sure to schedule smartly. Here’s an example of the input and an output you might generate:
  
  Example input:
  - User's query: "I'd like to get lunch with my friend"
  - User's existing schedule: [
    {
      "title": "MTG: Khizer, Kevin, Steven",
      "start": "2023-06-01 22:00:00.000Z",
      "end": "2023-06-01 23:00:00.000Z",
      "location": "https://stanford.zoom.us/j/95790235498?pwd=MkZrZ3FoMFdvbFJTOTFRSjAvbUVOdz09",
      "attendees": [
        {
          "name": null,
          "email": "kinzerfest@gmail.com"
        },
        {
          "name": "Syed Khizer Rahim Khaderi",
          "email": "kkhaderi@stanford.edu"
        },
        {
          "name": "Kevin Tran",
          "email": "kvtran@stanford.edu"
        }
      ]
    },
    {
      "title": "Onboarding Lab",
      "start": "2023-06-01 23:00:00.000Z",
      "end": "2023-06-01 23:30:00.000Z",
      "location": null,
      "attendees": []
    },
    {
      "title": "CS 278",
      "start": "2023-04-04 23:30:00.000Z",
      "end": "2023-04-05 00:30:00.000Z",
      "location": "Gates Computer Science, 353 Serra Mall, Stanford, CA 94305, USA",
      "attendees": []
    },
    {
      "title": "PSYCH 70",
      "start": "2023-04-04 17:30:00.000Z",
      "end": "2023-04-04 19:00:00.000Z",
      "location": "Dinkelspiel Auditorium, 471 Lagunita Dr, Stanford, CA 94305, USA",
      "attendees": []
    },
    {
      "title": "PWR 2AW",
      "start": "2023-04-03 16:30:00.000Z",
      "end": "2023-04-03 18:30:00.000Z",
      "location": "Hume Center for Writing and Speaking, 450 Jane Stanford Way Bldg 250, Stanford, CA 94305, USA",
      "attendees": []
    },
    {
      "title": "PSYC 135",
      "start": "2023-04-03 20:30:00.000Z",
      "end": "2023-04-03 22:00:00.000Z",
      "location": "Building 420, 450 Jane Stanford Way Building 420, Stanford, CA 94305, USA",
      "attendees": []
    },
    {
      "title": "CS 278 Section",
      "start": "2023-04-14 00:30:00.000Z",
      "end": "2023-04-14 01:30:00.000Z",
      "location": "Gates Computer Science, 353 Serra Mall, Stanford, CA 94305, USA",
      "attendees": []
    },
    {
      "title": "Memorial Day",
      "start": null,
      "end": null,
      "location": null,
      "attendees": []
    },
    {
      "title": "First Day of LGBTQ+ Pride Month",
      "start": null,
      "end": null,
      "location": null,
      "attendees": []
    },
    {
      "title": "ASQ Survey Part 2 [Sp23-PSYC-235-01/135-01]",
      "start": "2023-05-31 22:00:00.000Z",
      "end": "2023-05-31 22:00:00.000Z",
      "location": null,
      "attendees": []
    }
  ]
  
  Example output:
  {
    "message": "Sure, you're very free later this week for lunch!",
    "time_suggestions": ["7 Jun 2023 13:15 PDT", "8 Jun 2023 11:30 PDT", "8 Jun 2023 12:30 PDT"],
    "response_suggestions": ["What about this weekend?", "None of those work"]
  }
  
  Remember to always output in exactly the required JSON format:
  {
    "message": "string",
    "time_suggestions": ["string"],
    "response_suggestions": ["string"]
  }
  
  Where "message" is your response which should be 1-2 sentences that summarize the user's availability for their desired event, "time_suggestions" is a list of 2-5 times in the standardized time format of the user's timezone, and "response_suggestions" are a list of short 2-4 word next questions that the user might want to follow up with to your response. These response suggestions are phrased as if they were questions the user might ask you, or statements they might respond with to follow up and respond to your time. For example, a user might say "Weekend times?" to indicate they want you to suggest times that work over the weekend or "Prefer evening" to indicate to you that they want times later in the day. Your response suggestions should be intelligent based on the specific context of the event the user is trying to schedule as well as the times you initially suggested to them.
  
  Assuming you understand this, please await a real prompt now.`,
    },

    {
      role: "assistant",
      content:
        "Great! I am ready to assist with scheduling tasks. Please provide the information for the event you'd like me to help schedule.",
    },
  ]);

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
      <h1>Chat</h1>
      <div className="chat-history">
  {messages.map((message, index) => (
    <div key={index}>
      <strong>{message.role}:</strong>
      {message.role === "assistant" && message.content.startsWith("{") ? (
        // The assistant's response is a JSON string, parse it and render as HTML
        (() => {
          const response = JSON.parse(message.content);
          return (
            <Card variant="outlined">
              <CardContent>
                <h4>{response.message}</h4>
                <FormControl component="fieldset">
                  <FormLabel component="legend">Time Suggestions:</FormLabel>
                  <RadioGroup>
                    {response.time_suggestions.map((time, index) => 
                      <FormControlLabel key={index} value={time} control={<Radio />} label={new Date(time).toString()} />
                    )}
                  </RadioGroup>
                </FormControl>
                <FormControl component="fieldset">
                  <FormLabel component="legend">Response Suggestions:</FormLabel>
                  <RadioGroup>
                    {response.response_suggestions.map((suggestion, index) => 
                      <FormControlLabel key={index} value={suggestion} control={<Radio />} label={suggestion} />
                    )}
                  </RadioGroup>
                </FormControl>
              </CardContent>
            </Card>
          );
        })()
      ) : (
        // Render the content as plain text
        message.content
      )}
    </div>
  ))}
</div>


      <form onSubmit={handleFormSubmit}>
        <textarea
          className="chat-input"
          value={input}
          onChange={handleInputChange}
          rows={3}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default Chat;
