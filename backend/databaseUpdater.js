import mongoose from "mongoose";
import User from "./models/user.js";
import Chat from "./models/chat.js"; // Import Chat model
import Message from "./models/message.js"; // Import Message model
import dotenv from "dotenv";

dotenv.config();

const updateDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    const users = await User.find();

    if (!users || users.length === 0) {
      console.log("No users found.");
    } else {
      for (let user of users) {
        // Find all chats for the user
        const chats = await Chat.find({ users: user._id });

        for (let chat of chats) {
          // Get the most recent message from this chat
          const lastMessage = await Message.findOne({ chat: chat._id })
            .sort({ createdAt: -1 }) // Sort by creation date, most recent first
            .limit(1); // Only get the most recent message

          if (lastMessage) {
            // Update the chat's lastMessage field using $set to add the field
            await Chat.updateOne(
              { _id: chat._id },
              {
                $set: {
                  lastMessage: lastMessage._id, // Set the lastMessage field to the message ID
                },
              }
            );
          } else {
            await Chat.updateOne(
              { _id: chat._id },
              {
                $set: {
                  lastMessage: null, // Set the lastMessage field to the message ID
                },
              }
            );
          }
        }
      }
    }

    console.log("Succeeded!");
    mongoose.disconnect();
  } catch (err) {
    mongoose.disconnect();
    console.log("Failed:", err);
  }
};

updateDatabase();
