import Chat from "../models/chat.js";
import User from "../models/user.js";
import Message from "../models/message.js";
import mongoose from "mongoose";
import { getSocket } from "../socket.js";

export const getChat = async (req, res, next) => {
  try {
    const { chatId } = req.params;

    const chat = await Chat.findById(chatId)
      .populate("users")
      .populate("admins")
      .populate({
        path: "lastMessage",
        populate: [{ path: "sender" }, { path: "referenceMessageId" }],
      })
      .populate({
        path: "pinnedMessage",
        populate: [{ path: "sender" }, { path: "referenceMessageId" }],
      });

    if (!chat) {
      return res.status(404).json({ message: "Chat not found." });
    }

    if (chat.type === "saved") {
      const userId = req.userId.toString();
      const isAuthorized =
        chat.users.some((user) => user._id.toString() === userId) ||
        chat.admins.some((admin) => admin._id.toString() === userId);

      if (!isAuthorized) {
        return res.status(403).json({ message: "Access denied." });
      }
    }

    const lastMessageId = chat.lastMessage ? chat.lastMessage._id : null;
    let lastReadMessageId = chat.lastReadMessages?.get(req.userId) || null;

    if (lastMessageId) {
      await Chat.updateOne(
        { _id: chatId },
        { $set: { [`lastReadMessages.${req.userId}`]: lastMessageId } }
      );
    }

    res.status(200).json({
      message: "Successfully fetched chat.",
      data: { ...chat._doc, lastReadMessageId, _id: chat._id },
    });
  } catch (err) {
    next(err);
  }
};

export const getUserChats = async (req, res, next) => {
  try {
    const chats = await Chat.find({ users: req.userId })
      .populate({
        path: "lastMessage",
        populate: [{ path: "sender" }, { path: "referenceMessageId" }],
      })
      .populate("users");

    chats.sort((a, b) => {
      const dateA = a.lastMessage
        ? new Date(a.lastMessage.createdAt)
        : new Date(a.createdAt);
      const dateB = b.lastMessage
        ? new Date(b.lastMessage.createdAt)
        : new Date(b.createdAt);
      return dateB - dateA;
    });

    const chatsWithMissedCount = await Promise.all(
      chats.map(async (chat) => {
        const lastReadMessageId = chat.lastReadMessages?.get(req.userId);

        let missedCount = 0;
        if (lastReadMessageId) {
          missedCount = await Message.countDocuments({
            chat: chat._id,
            _id: { $gt: lastReadMessageId },
          });
        }

        const chatObj = chat.toObject();
        chatObj.missedCount = missedCount;

        return chatObj;
      })
    );

    res.status(200).json({
      message: "Successfully fetched chats.",
      data: {
        chats: chatsWithMissedCount,
      },
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

    for (const chat of chats) {
      const missedCounts = {};

      for (const userId of chat.users) {
        const lastReadMessageId = chat.lastReadMessages.get(userId);

        if (lastReadMessageId) {
          const missedCount = await Message.countDocuments({
            chat: chat._id,
            _id: { $gt: lastReadMessageId },
          });
          missedCounts[userId] = missedCount;
        } else {
          missedCounts[userId] = 0;
        }
      }

      chat.missedCounts = missedCounts;
    }

    res.status(200).json({
      message: "Successfully fetched chats.",
      data: {
        chats: chats.filter((c) => c.type !== "saved" && c.type !== "private"),
      },
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
      path: "lastMessage",
      populate: [{ path: "sender" }, { path: "referenceMessageId" }],
    });

    for (const chat of chats) {
      const missedCounts = {};

      for (const userId of chat.users) {
        const lastReadMessageId = chat.lastReadMessages.get(userId);

        if (lastReadMessageId) {
          const missedCount = await Message.countDocuments({
            chat: chat._id,
            _id: { $gt: lastReadMessageId },
          });
          missedCounts[userId] = missedCount;
        } else {
          missedCounts[userId] = 0;
        }
      }

      chat.missedCounts = missedCounts;
    }

    res.status(200).json({
      data: {
        chats: chats.filter((c) => c.type !== "saved"),
      },
    });
  } catch (err) {
    next(err);
  }
};

export const createChat = async (req, res, next) => {
  try {
    const { name, description, imageUrl } = req.body;
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
      imageUrl: imageUrl || null,
      lastMessage: null,
      type: "group",
    });

    const systemMessage = new Message({
      message: `created the chat`,
      sender: req.userId,
      chat: chat._id,
      type: "system",
    });

    await systemMessage.save();
    chat.lastMessage = systemMessage._id;
    await chat.save();

    getSocket().emit("messageSent", { data: chat._id });

    res.status(200).json(chat);
  } catch (err) {
    next(err);
  }
};

export const editChat = async (req, res, next) => {
  try {
    const { name, description, imageUrl } = req.body;

    const { chatId } = req.params;

    const chat = await Chat.findById(chatId);

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }
    if (!chat.admins.includes(req.userId)) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const systemMessage = new Message({
      message: `modified the chat's look`,
      sender: req.userId,
      chat: chatId,
      type: "system",
    });

    await systemMessage.save();
    chat.lastMessage = systemMessage._id;
    await chat.save();

    getSocket().emit("messageSent", { data: chatId });

    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      { name, description, imageUrl },
      { new: true }
    );
    res.json(updatedChat);
  } catch (err) {
    next(err);
  }
};

export const deleteChat = async (req, res, next) => {
  try {
    const { chatId } = req.body;

    if (!chatId) {
      const error = new Error("Invalid chatId provided.");
      error.statusCode = 400;

      throw error;
    }

    const chat = await Chat.findById(chatId);

    if (!chat) {
      const error = new Error("Chat not found.");
      error.statusCode = 404;

      throw error;
    }

    if (chat.type !== "group" && chat.creator.toString() !== req.userId) {
      const error = new Error("You are not allowed to delete this chat.");
      error.statusCode = 403;

      throw error;
    }

    await Chat.findByIdAndDelete(chatId);

    res.status(200).json({ message: "Chat successfully deleted.", data: chat });
  } catch (err) {
    next(err);
  }
};

export const removeUserFromChat = async (req, res, next) => {
  try {
    const { chatId } = req.params;
    const { userId } = req.body;
    console.log(req.body);

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

    const systemMessage = new Message({
      message: `left the chat`,
      sender: userId,
      chat: chatId,
      type: "system",
    });

    await systemMessage.save();
    if (chat.type !== "broadcast") {
      chat.lastMessage = systemMessage._id;
    }
    await chat.save();

    getSocket().emit("messageSent", { data: chatId });

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

    chat.users.push(new mongoose.Types.ObjectId(userId));

    const systemMessage = new Message({
      message: `joined the chat`,
      sender: userId,
      chat: chatId,
      type: "system",
    });

    await systemMessage.save();
    if (chat.type !== "broadcast") {
      chat.lastMessage = systemMessage._id;
    }
    await chat.save();

    getSocket().emit("messageSent", { data: chatId });

    const updatedChat = await Chat.findById(chatId)
      .populate("users")
      .populate("admins");

    res.status(200).send({
      message: "User added to chat successfully.",
      data: updatedChat,
    });
  } catch (err) {
    next(err);
  }
};

export const addPinnedMessage = async (req, res, next) => {
  try {
    const { chatId, messageId } = req.body;

    const chat = await Chat.findById(chatId);

    if (!chat) {
      const error = new Error("Could not find the chat.");
      error.statusCode = 404;

      throw error;
    }

    if (chat.pinnedMessage?.toString() === messageId) {
      await Chat.findByIdAndUpdate(chatId, {
        $set: { pinnedMessage: null },
      });

      return res
        .status(201)
        .json({ message: "Successfully removed a pinned message", data: chat });
    }

    await Chat.findByIdAndUpdate(chatId, {
      $set: { pinnedMessage: messageId },
    });

    res
      .status(201)
      .json({ message: "Successfully added a pinned message", data: chat });
  } catch (err) {
    next(err);
  }
};
