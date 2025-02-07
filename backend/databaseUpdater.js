import mongoose from "mongoose";
import User from "./models/user.js";
import dotenv from "dotenv";

dotenv.config();

const updateDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    const users = await User.find();

    if (!users || users.length === 0) {
    } else {
      for (let user of users) {
        await User.updateOne(
          { _id: user._id },
          { $set: { imageUrl: "images/pfp.jpg" } }
        );
      }
    }

    console.log("Succeeded!");
    mongoose.disconnect();
  } catch (err) {
    mongoose.disconnect();
    console.log("Failed");
  }
};

updateDatabase();
