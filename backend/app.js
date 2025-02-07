import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import Message from "./message.js";
import dotenv from "dotenv";
import ChatRoutes from "./routes/chat.js";
import UserRoutes from "./routes/user.js";
import MessageRoutes from "./routes/message.js";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "images");
  },
  filename: function (req, file, cb) {
    const fileExtension = file.mimetype.split("/")[1];
    cb(null, `${uuidv4()}.${fileExtension}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(new Error("Only .png, .jpg, and .jpeg formats are allowed"), false);
  }
};

app.use(multer({ storage, fileFilter }).single("imageUrl"));

app.use("/images", express.static(path.join(__dirname, "images")));

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

app.use("/chat", ChatRoutes);
app.use("/user", UserRoutes);
app.use("/message", MessageRoutes);

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message, data });
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
        socket.emit("setUsername", userName);
        socket.emit("setColor", userColor);

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
              color: userColor,
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
