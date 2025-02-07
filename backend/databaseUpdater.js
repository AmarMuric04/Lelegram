import mongoose from "mongoose";
import Chat from "./models/chat.js"; // Adjust the path as needed
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

const updateChatsWithGradients = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    const gradients = [
      { colors: ["#FF7E5F", "#FEB47B"], direction: "to right" }, // Orange
      { colors: ["#FFDD00", "#FBB034"], direction: "to bottom" }, // Yellow
      { colors: ["#00C6FB", "#005BEA"], direction: "to left" }, // Blue
      { colors: ["#D38312", "#A83279"], direction: "to top" }, // Purple/Red
      { colors: ["#54c322", "#55f785"], direction: "to top right" }, // Purple/Red
      { colors: ["#f755db", "#ae22c3"], direction: "to top left" }, // Purple/Red
      { colors: ["#f755db", "#22c3c1"], direction: "to bottom right" }, // Purple/Red
      { colors: ["#555ef7", "#22c367"], direction: "to bottom left" }, // Purple/Red
    ];

    const chats = await Chat.find();
    console.log(1);
    console.log("Chats fetched:", chats.length);

    if (!chats || chats.length === 0) {
      console.log("No chats found!");
    } else {
      for (let chat of chats) {
        if (chat.gradient) {
          const gradient =
            gradients[Math.floor(Math.random() * gradients.length)];

          await Chat.updateOne({ _id: chat._id }, { $set: { gradient } });
        }
      }
      console.log(2);
    }

    console.log("Chats updated successfully!");
    mongoose.disconnect();
  } catch (err) {
    console.error("Error updating chats:", err);
    mongoose.disconnect();
  }
};

updateChatsWithGradients();
