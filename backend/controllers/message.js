import chat from "../models/chat.js";
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
    })
      .populate("sender")
      .populate("chat");

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

export const getSearchedMessages = async (req, res, next) => {
  try {
    const { input } = req.body;

    if (!input) {
      const error = new Error("Search query is required");
      error.statusCode = 400;

      throw error;
    }

    let messages = await Message.find({
      message: { $regex: input, $options: "i" },
    }).populate("chat");

    if (messages.length === 0) {
      const error = new Error("No messages found matching your search.");
      error.statusCode = 404;

      throw error;
    }

    messages = messages.map((message) => ({
      ...message.chat._doc,
      message: message.message,
      more: message,
    }));

    res.status(200).json({
      data: messages,
    });
  } catch (err) {
    next(err);
  }
};
