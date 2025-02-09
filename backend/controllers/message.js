import Message from "../models/message.js";
import Chat from "../models/chat.js";
import mongoose from "mongoose";
import { getSocket } from "../socket.js";

export const sendMessage = async (req, res, next) => {
  try {
    const { chatId, message, type, referenceMessageId } = req.body;

    console.log(type, referenceMessageId);

    const newMessage = new Message({
      chat: chatId,
      message,
      sender: req.userId,
      type,
      referenceMessageId,
    });

    await newMessage.save();

    const chat = await Chat.findById(chatId);

    chat.lastMessage = newMessage._id;

    await chat.save();

    getSocket().emit("messageSent", {
      data: chatId,
    });

    res.status(201).json({
      message: "Message sent successfully!",
      data: {
        sender: req.userId,
        message,
        type,
        referenceMessageId,
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
      .populate("chat")
      .populate({
        path: "referenceMessageId",
        populate: {
          path: "sender",
        },
      });

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
