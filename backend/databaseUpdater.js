import mongoose from "mongoose";
import User from "./models/user.js";
import Chat from "./models/chat.js";
import Message from "./models/message.js";
import dotenv from "dotenv";

dotenv.config();

const updateDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    const users = await User.find();

    for (const user of users) {
      const gradient = {
        colors: ["#BE10CE", "#F130FF"],
        direction: "to right",
      };

      const chat = new Chat({
        name: "ʚ♡ɞ Saved Messages",
        description: "This is where you store your saved messages.",
        creator: user,
        admins: [user],
        users: [user],
        gradient,
        imageUrl: null,
        lastMessage: null,
        type: "saved",
      });
      await chat.save();
    }

    console.log("Success");

    mongoose.disconnect();
  } catch (err) {
    mongoose.disconnect();
    console.log("Failed:", err);
  }
};

updateDatabase();
