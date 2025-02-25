import { useChat } from "@livekit/components-react";
import { useEffect, useState } from "react";

export default function ChatWindow() {
  const chat = useChat();
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const handleMessageReceived = (message) => {
      setMessages((prev) => [...prev, message]);
    };
    chat.on("message_received", handleMessageReceived);

    return () => {
      chat.off("message_received", handleMessageReceived);
    };
  }, [chat]);

  const sendMessage = (text) => {
    chat.sendMessage(text);
  };

  return (
    <div className="chat-window">
      <div className="messages">
        {messages.map((msg, index) => (
          <div key={index}>{msg}</div>
        ))}
      </div>
      <input
        type="text"
        onKeyPress={(e) => {
          if (e.key === "Enter") {
            sendMessage(e.target.value);
            e.target.value = "";
          }
        }}
      />
    </div>
  );
}
