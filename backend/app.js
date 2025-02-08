import express from "express";
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
import { initSocket, getSocket } from "./socket.js";
import { createServer } from "http";

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;
const server = createServer(app);

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
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB connected");

    server.listen(port, () => console.log("Server running on port 3000"));
    const io = initSocket(server);

    io.on("connection", (socket) => {
      console.log("A user connected:", socket.id);

      socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
      });
    });
  })
  .catch((err) => {
    console.error("MongoDB Connection Error:", err);
    process.exit(1);
  });

mongoose.connection.on("error", (err) => {
  console.error("MongoDB Error:", err);
});
mongoose.connection.on("disconnected", () => {
  console.warn("MongoDB disconnected");
});
