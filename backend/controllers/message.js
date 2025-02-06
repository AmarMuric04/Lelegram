import Message from "../models/message.js";
import mongoose from "mongoose";

export const sendMessage = async (req, res, next) => {
  try {
    const { chatId, message } = req.body;

    const newMessage = new Message({
      chat: chatId,
      message,
      sender: req.userId,
    });

    await newMessage.save();

    res.status(200).json({
      message: "Message sent successfully!",
      data: {
        sender: req.userId,
        message,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const getMessages = async (req, res, next) => {
  try {
    const { chatId } = req.params;

    const messages = await Message.find({
      chat: new mongoose.Types.ObjectId(chatId),
    }).populate("sender");

    if (!messages) {
      const error = new Error("Something went wrong.");
      error.statusCode = 404;

      throw error;
    }

    res
      .status(200)
      .json({ message: "Successfully fetched messages.", data: messages });
  } catch (err) {
    next(err);
  }
};
