import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import axios from "axios";

const Chat = () => {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [userName, setUserName] = useState("");
  const [userColor, setUserColor] = useState("");

  useEffect(() => {
    const newSocket = io("http://localhost:3000");
    setSocket(newSocket);

    newSocket.on("setUsername", (username) => {
      setUserName(username);
    });

    newSocket.on("setColor", (color) => {
      setUserColor(color);
    });

    newSocket.on("userJoined", (data) => {
      setMessages((prev) => [
        ...prev,
        {
          sender: data.userName,
          content: `Hello, I joined the chat.`,
          timestamp: new Date().toISOString(),
          color: data.color,
        },
      ]);
    });

    newSocket.on("userLeft", (data) => {
      setMessages((prev) => [
        ...prev,
        {
          sender: data.userName,
          content: `I'm out!`,
          timestamp: new Date().toISOString(),
          color: data.color,
        },
      ]);
    });

    newSocket.on("receiveMessage", (message) => {
      setMessages((prev) => [
        ...prev,
        {
          sender: message.userName,
          content: message.content,
          timestamp: new Date().toISOString(),
          color: message.color,
        },
      ]);
    });

    const fetchMessages = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/messages");
        setMessages(response.data);
      } catch (err) {
        console.error("Error fetching messages:", err);
      }
    };

    fetchMessages();

    return () => newSocket.disconnect();
  }, []);

  useEffect(() => {
    const chatBox = document.getElementById("chatBox");
    if (chatBox) chatBox.scrollTop = chatBox.scrollHeight;
  }, [messages]);

  const sendMessage = () => {
    if (socket && newMessage.trim()) {
      const messageData = {
        sender: userName,
        content: newMessage,
        color: userColor,
        timestamp: new Date().toISOString(),
      };
      socket.emit("sendMessage", messageData);
      setMessages((prev) => [
        ...prev,
        {
          sender: userName,
          content: newMessage,
          timestamp: new Date().toISOString(),
          color: userColor,
        },
      ]);
      setNewMessage("");
    }
  };

  return (
    <div className="quicksand w-1/2 bg-[#25252530] shadow-xl rounded-t-[1.5rem]">
      <div
        id="chatBox"
        className="px-8 flex flex-col-reverse max-h-[40rem] overflow-y-scroll"
      >
        {[...messages].reverse().map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              msg.sender === userName ? "justify-end" : "justify-start"
            } mb-4`}
          >
            <div
              style={{
                border: `5px solid ${msg.color}`,
                borderRight:
                  msg.sender === userName
                    ? `5px solid ${msg.color}`
                    : `50px solid ${msg.color}`,
                borderLeft:
                  msg.sender === userName
                    ? `50px solid ${msg.color}`
                    : `5px solid ${msg.color}`,
              }}
              className={`flex flex-col items-start w-1/2 rounded-[1.5rem] p-6 ${
                msg.sender === userName
                  ? "bg-pink-500 text-white rounded-br-none"
                  : "bg-white text-gray-500 rounded-bl-none border-r-40"
              }`}
            >
              <p>{msg.content}</p>
              <div
                className={`flex gap-4 items-center w-full mt-2 justify-start ${
                  msg.sender === userName ? "flex-row-reverse" : ""
                }`}
              >
                <strong className="font-bold">
                  {msg.sender}
                  {msg.sender === userName && " (You)"}
                </strong>
                <em className={`text-xs ${msg.sender === userName && "ml-2"}`}>
                  ({new Date(msg.timestamp).toLocaleTimeString()})
                </em>
              </div>
            </div>
          </div>
        ))}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage();
        }}
        className="flex rounded-[1.5rem] mt-10"
      >
        <input
          className="w-full bg-[#151515] px-4 py-2"
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button className="cursor-pointer hover:bg-orange-500 transition-all bg-pink-500 px-20 py-4">
          Send
        </button>
      </form>
    </div>
  );
};

export default Chat;
