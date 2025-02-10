import Chat from "../models/chat.js";
import User from "../models/user.js";
import mongoose from "mongoose";

export const getChat = async (req, res, next) => {
  try {
    const { chatId } = req.params;
    const chats = await Chat.findById(chatId)
      .populate("users")
      .populate("admins");

    res.status(200).json({
      message: "Successfully fetched chats.",
      data: chats,
    });
  } catch (err) {
    next(err);
  }
};

export const getUserChats = async (req, res, next) => {
  try {
    const chats = await Chat.find({ users: req.userId }).populate({
      path: "lastMessage",
      populate: [{ path: "sender" }, { path: "referenceMessageId" }],
    });

    chats.sort((a, b) => {
      const dateA = a.lastMessage
        ? new Date(a.lastMessage.createdAt)
        : new Date(a.createdAt);
      const dateB = b.lastMessage
        ? new Date(b.lastMessage.createdAt)
        : new Date(b.createdAt);
      return dateB - dateA;
    });

    res.status(200).json({
      message: "Successfully fetched chats.",
      data: chats,
    });
  } catch (err) {
    next(err);
  }
};

export const getAllChats = async (req, res, next) => {
  try {
    const chats = await Chat.find().populate({
      path: "lastMessage",
      populate: [{ path: "sender" }, { path: "referenceMessageId" }],
    });

    chats.sort((a, b) => {
      const dateA = a.lastMessage
        ? new Date(a.lastMessage.createdAt)
        : new Date(a.createdAt);
      const dateB = b.lastMessage
        ? new Date(b.lastMessage.createdAt)
        : new Date(b.createdAt);
      return dateB - dateA;
    });

    res.status(200).json({
      message: "Successfully fetched chats.",
      data: chats.filter((c) => c.name !== "ʚ♡ɞ Saved Messages"),
    });
  } catch (err) {
    next(err);
  }
};
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
    }).populate({
      populate: [{ path: "sender" }, { path: "referenceMessageId" }],
    });

    res
      .status(200)
      .json({ data: chats.filter((c) => c.name !== "ʚ♡ɞ Saved Messages") });
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

    let imageUrl;
    if (req.file) imageUrl = req.file.path.replace("\\", "/");
    else console.log("Image not found");

    const chat = new Chat({
      name,
      description,
      creator,
      admins: [creator],
      users: [creator],
      gradient,
      imageUrl,
      lastMessage: null,
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

    const chat = await Chat.findById(chatId)
      .populate("users")
      .populate("admins");

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

    const chat = await Chat.findById(chatId)
      .populate("users")
      .populate("admins");

    if (!chat) {
      const error = new Error("Chat not found.");
      error.statusCode = 404;
      throw error;
    }

    if (chat.users.some((u) => u._id.toString() === userId)) {
      const error = new Error("User is already in the chat.");
      error.statusCode = 422;
      throw error;
    }

    const user = await User.findById(userId);

    // Add the user to the chat
    chat.users.push(new mongoose.Types.ObjectId(userId));

    // Save the chat
    await chat.save();

    // Populate the users and admins fields again after saving
    const updatedChat = await Chat.findById(chatId)
      .populate("users")
      .populate("admins");

    res
      .status(200)
      .send({ message: "User added to chat successfully.", data: updatedChat });
  } catch (err) {
    next(err);
  }
};
