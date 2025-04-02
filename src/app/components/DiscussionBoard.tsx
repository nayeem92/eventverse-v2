"use client";

import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

export default function DiscussionBoard() {
  const [messages, setMessages] = useState([
    { id: uuidv4(), userId: "Neel", message: "Excited for the event!", timestamp: new Date().toLocaleTimeString() },
    { id: uuidv4(), userId: "Krushil", message: "Looking forward to it!", timestamp: new Date().toLocaleTimeString() },
  ]);
  const [message, setMessage] = useState("");
  const userId = "You";

  useEffect(() => {
    const messageContainer = document.getElementById("messageContainer");
    if (messageContainer) {
      messageContainer.scrollTop = messageContainer.scrollHeight;
    }
  }, [messages]);

  const sendMessage = () => {
    if (!message.trim()) return;
    setMessages([...messages, { id: uuidv4(), userId, message, timestamp: new Date().toLocaleTimeString() }]);
    setMessage("");
  };

  return (
    <div className="p-5 bg-gray-100 rounded-lg shadow-md w-full max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4 text-center">Event Discussion</h2>
      <div id="messageContainer" className="space-y-3 max-h-60 overflow-auto border p-3 rounded bg-white">
        {messages.map((msg) => (
          <div key={msg.id} className="p-2 bg-gray-200 rounded">
            <strong className="text-blue-600">{msg.userId}</strong>
            <span className="text-gray-500 text-xs ml-2">({msg.timestamp})</span>
            <p className="mt-1 text-gray-800">{msg.message}</p>
          </div>
        ))}
      </div>
      <div className="mt-4 flex space-x-2">
        <input
          className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Write a message..."
        />
        <button
          className="bg-blue-500 hover:bg-blue-600 text-black font-semibold p-3 rounded transition"
          onClick={sendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
}
