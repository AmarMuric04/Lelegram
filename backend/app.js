import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import Message from "./message.js";
import cors from "cors";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    methods: "GET, POST, PUT, PATCH, DELETE",
    allowedHeaders: "Content-Type, Authorization",
  })
);

const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST"],
  },
});
app.use(express.json());

app.get("/api/messages", async (req, res) => {
  try {
    const messages = await Message.find().sort({ timestamp: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected");
    server.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
      io.on("connection", (socket) => {
        const userName = `User-${Math.floor(Math.random() * 10000)}`;

        const getRandomColor = () => {
          const randomColor = `#${Math.floor(Math.random() * 16777215).toString(
            16
          )}`;
          return randomColor;
        };

        const userColor = getRandomColor();
        socket.emit("setUsername", userName); // Send username to the client
        socket.emit("setColor", userColor); // Send username to the client

        io.emit("userJoined", {
          userName,
          userId: socket.id,
          color: userColor,
        });

        socket.on("sendMessage", async (data) => {
          console.log(`${userName} is sending a message...`);
          try {
            const newMessage = new Message({
              ...data,
              userName: userName,
              color: userColor,
            });
            await newMessage.save();

            socket.broadcast.emit("receiveMessage", {
              ...data,
              userName: userName,
              color: userColor, // Include color when broadcasting
            });
          } catch (err) {
            console.error("Error saving message:", err);
          }
        });

        socket.on("disconnect", () => {
          console.log(`${userName} disconnected:`, socket.id);
          io.emit("userLeft", {
            userName,
            userId: socket.id,
            color: userColor,
          });
        });
      });
    });
  })
  .catch((err) => console.log(err));
