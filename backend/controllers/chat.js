import Chat from "../models/chat.js";
import User from "../models/user.js";
import Message from "../models/message.js";
import mongoose from "mongoose";

export const getUserChats = async (req, res, next) => {
  try {
    const chats = await Chat.find({ users: req.userId });

    const chatsWithLastMessage = await Promise.all(
      chats.map(async (chat) => {
        const lastMessage = await Message.findOne({ chat: chat._id })
          .sort({ createdAt: -1 })
          .select("message createdAt sender")
          .populate("sender");
        return {
          ...chat.toObject(),
          lastMessage: lastMessage || null,
        };
      })
    );

    res.status(200).json({
      message: "Successfully fetched chats.",
      data: chatsWithLastMessage,
    });
  } catch (err) {
    next(err);
  }
};

export const getAllChats = async (req, res, next) => {};

export const getSearchedChats = async (req, res, next) => {
  try {
    const { input } = req.body;

    if (!input) {
      const error = new Error("Search query is required");
      error.statusCode = 400;
      throw error;
    }

    let chats = await Chat.find({
      name: { $regex: input, $options: "i" },
    });

    if (chats.length === 0) {
      const error = new Error("No chats found matching your search.");
      error.statusCode = 404;
      throw error;
    }

    const chatsWithLastMessage = await Promise.all(
      chats.map(async (chat) => {
        const lastMessage = await Message.findOne({ chat: chat._id })
          .sort({ createdAt: -1 })
          .select("message createdAt sender")
          .populate("sender");

        return {
          ...chat.toObject(),
          lastMessage: lastMessage || null,
        };
      })
    );

    res.status(200).json({ data: chatsWithLastMessage });
  } catch (err) {
    next(err);
  }
};

export const createChat = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    const creator = await User.findById(req.userId);

    const gradients = [
      { colors: ["#FF7E5F", "#FEB47B"], direction: "to right" },
      { colors: ["#FFDD00", "#FBB034"], direction: "to right" },
      { colors: ["#00C6FB", "#005BEA"], direction: "to right" },
      { colors: ["#D38312", "#A83279"], direction: "to right" },
    ];

    const gradient = gradients[name.length % gradients.length];

    const chat = new Chat({
      name,
      description,
      creator,
      admins: [creator],
      users: [creator],
      gradient,
    });

    await chat.save();
    res.json(chat);
  } catch (err) {
    next(err);
  }
};

export const removeUserFromChat = async (req, res, next) => {
  try {
    const { chatId } = req.params;
    const { userId } = req.body;

    const chat = await Chat.findById(chatId);

    if (!userId) {
      const error = new Error("Please provide a valid id.");
      chat.statusCode = 404;

      throw error;
    }

    if (!chat) {
      const error = new Error("Chat not found.");
      chat.statusCode = 404;

      throw error;
    }

    chat.users.pull(userId);

    await chat.save();

    res
      .status(200)
      .send({ message: "User removed from the chat.", data: chat });
  } catch (err) {
    next(err);
  }
};

export const addUserToChat = async (req, res, next) => {
  try {
    const { chatId } = req.params;
    const { userId } = req.body;

    if (!userId) {
      const error = new Error("Please provide a valid id.");
      error.statusCode = 400;
      throw error;
    }

    const chat = await Chat.findById(chatId);

    if (!chat) {
      const error = new Error("Chat not found.");
      error.statusCode = 404;
      throw error;
    }

    if (chat.users.some((u) => u.toString() === userId)) {
      const error = new Error("User is already in the chat.");
      error.statusCode = 422;
      throw error;
    }

    chat.users.push(new mongoose.Types.ObjectId(userId));

    await chat.save();

    res
      .status(200)
      .send({ message: "User added to chat successfully.", data: chat });
  } catch (err) {
    next(err);
  }
};
