import mongoose from "mongoose";
import User from "./models/user.js";
import Chat from "./models/chat.js"; // Import Chat model
import Message from "./models/message.js"; // Import Message model
import dotenv from "dotenv";

dotenv.config();

const updateDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    // Update all messages to have a type field with value "normal"
    await Message.updateMany(
      { type: { $exists: false } }, // Only update messages that don't have a "type" field
      { $set: { type: "normal" } }
    );

    mongoose.disconnect();
  } catch (err) {
    mongoose.disconnect();
    console.log("Failed:", err);
  }
};

updateDatabase();
