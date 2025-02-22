import express from "express";
import mongoose from "mongoose";
import Message from "./message.js";
import dotenv from "dotenv";
import ChatRoutes from "./routes/chat.js";
import UserRoutes from "./routes/user.js";
import MessageRoutes from "./routes/message.js";
import PollRoutes from "./routes/poll.js";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import { fileURLToPath } from "url";
import { initSocket } from "./socket.js";
import { createServer } from "http";
import nodemailer from "nodemailer";

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
    if (file.fieldname === "imageUrl") {
      cb(null, "images");
    } else if (file.fieldname === "audioUrl") {
      cb(null, "voices");
    } else {
      cb(new Error("Invalid field name"), null);
    }
  },
  filename: function (req, file, cb) {
    const fileExtension = file.mimetype.split("/")[1];
    cb(null, `${uuidv4()}.${fileExtension}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype.startsWith("image/") ||
    file.mimetype.startsWith("audio/")
  ) {
    cb(null, true);
  } else {
    cb(new Error("Only image and audio formats are allowed"), false);
  }
};

app.use(
  multer({ storage, fileFilter }).fields([
    { name: "imageUrl", maxCount: 1 },
    { name: "audioUrl", maxCount: 1 },
  ])
);

app.use("/images", express.static(path.join(__dirname, "images")));
app.use("/voices", express.static(path.join(__dirname, "voices")));

app.use(express.json());

app.get("/api/messages", async (req, res) => {
  try {
    const messages = await Message.find().sort({ timestamp: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

const transporter = nodemailer.createTransport({
  secure: true,
  host: "smtp.gmail.com",
  port: 465,
  auth: {
    user: process.env.NODEMAILER_EMAIL,
    pass: process.env.NODEMAILER_PASSWORD,
  },
});

const otpStorage = {};

app.post("/send-otp", async (req, res) => {
  const { email } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000);
  otpStorage[email] = otp;

  const mailOptions = {
    from: process.env.NODEMAILER_EMAIL,
    to: email,
    subject: "Your OTP Code",
    html: `
    <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
      <h2 style="color: #3498db;">Your OTP Code</h2>
      <p style="font-size: 18px;">Use this code to verify your email:</p>
      <div style="background: #f4f4f4; padding: 10px; display: inline-block; font-size: 24px; font-weight: bold; border-radius: 5px;">
        ${otp}
      </div>
      <p style="margin-top: 20px; color: #555;">This code is valid for 10 minutes.</p>
    </div>
  `,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: "OTP sent successfully!" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post("/verify-otp", (req, res, next) => {
  try {
    const { email, otp } = req.body;
    if (otpStorage[email] && otpStorage[email] == otp) {
      delete otpStorage[email];
      res.status(200).json({ success: true, message: "OTP verified!" });
    } else {
      const error = new Error("Incorrect code. Please Try again.");
      error.statusCode = 400;
      error.data = [{ path: "code" }];
      throw error;
    }
  } catch (err) {
    next(err);
  }
});

app.use("/chat", ChatRoutes);
app.use("/user", UserRoutes);
app.use("/message", MessageRoutes);
app.use("/poll", PollRoutes);

app.use((error, req, res, next) => {
  console.error(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message, data });
});

import User from "./models/user.js";

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected");

    server.listen(port, () => console.log("Server running on port 3000"));
    const io = initSocket(server);
    const typingUsers = {};

    io.on("connection", async (socket) => {
      const userId = socket.handshake.query.userId;
      if (userId) {
        await User.findByIdAndUpdate(userId, { lastSeen: null });
        console.log("Giving the user lastSeen null");
        io.emit("messageSent", { data: null });
      }

      socket.on("userTyping", ({ user, chatId }) => {
        if (!typingUsers[chatId]) {
          typingUsers[chatId] = new Set();
        }
        typingUsers[chatId].add(user._id);
        io.emit("messageSent", { data: chatId });
      });

      socket.on("stopTyping", ({ user, chatId }) => {
        if (typingUsers[chatId]) {
          typingUsers[chatId].delete(user._id);
          if (typingUsers[chatId].size === 0) {
            delete typingUsers[chatId];
          }
        }
        io.emit("userStoppedTyping", { chatId, user });
      });

      socket.on("offer", (offer) => {
        socket.broadcast.emit("offer", offer);
      });

      socket.on("answer", (answer) => {
        socket.broadcast.emit("answer", answer);
      });

      socket.on("ice-candidate", (candidate) => {
        socket.broadcast.emit("ice-candidate", candidate);
      });

      socket.on("disconnect", async () => {
        await User.findByIdAndUpdate(userId, { lastSeen: new Date() });
        console.log("Giving the user lastSeen " + new Date());
        io.emit("messageSent", { data: null });
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
