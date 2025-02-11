import Message from "../models/message.js";
import Chat from "../models/chat.js";
import mongoose from "mongoose";
import { getSocket } from "../socket.js";

export const sendMessage = async (req, res, next) => {
  try {
    const { chatId, message, type, referenceMessageId, forwardToChat } =
      req.body;

    if (type !== "forward" && !message) {
      const error = new Error("Message is required when not forwarding.");
      error.statusCode = 404;
      throw error;
    }

    let newMessage;

    if (type === "forward") {
      if (Array.isArray(referenceMessageId)) {
        const forwardedMessages = [];

        if (message) {
          const commentMessage = new Message({
            chat: chatId,
            message,
            sender: req.userId,
            type: "normal",
            referenceMessageId: null,
          });
          await commentMessage.save();
        }

        for (const refId of referenceMessageId) {
          const referencedMessage = await Message.findById(refId).populate(
            "chat"
          );
          if (!referencedMessage) continue;
          let forwardedMsg;

          if (referencedMessage.chat.type === "saved") {
            forwardedMsg = new Message({
              chat: chatId,
              message: referencedMessage.message,
              sender: req.userId,
              type: "normal",
              referenceMessageId: null,
            });
          } else {
            if (referencedMessage.type === "forward") {
              forwardedMsg = new Message({
                ...referencedMessage._doc,
                sender: req.userId,
                _id: new mongoose.Types.ObjectId(),
                chat: chatId,
              });
            } else {
              forwardedMsg = new Message({
                chat: chatId,
                message: null,
                sender: req.userId,
                type: "forward",
                referenceMessageId: refId,
              });
            }
          }
          await forwardedMsg.save();
          forwardedMessages.push(forwardedMsg);
        }

        const chat = await Chat.findById(chatId);
        if (forwardedMessages.length > 0) {
          chat.lastMessage =
            forwardedMessages[forwardedMessages.length - 1]._id;
          await chat.save();
        }
        getSocket().emit("messageSent", { data: chatId });

        return res.status(201).json({
          message: "Messages forwarded successfully!",
          data: forwardedMessages.map((msg) => ({
            sender: req.userId,
            message: msg.message,
            type: msg.type,
            referenceMessageId: msg.referenceMessageId,
            forwardToChat,
          })),
        });
      } else {
        if (message) {
          const commentMessage = new Message({
            chat: chatId,
            message,
            sender: req.userId,
            type: "normal",
            referenceMessageId: null,
          });
          await commentMessage.save();
        }

        const referencedMessage = await Message.findById(
          referenceMessageId
        ).populate("chat");
        if (!referencedMessage) {
          const error = new Error("Referenced message not found.");
          error.statusCode = 404;
          throw error;
        }

        if (referencedMessage.chat.type === "saved") {
          newMessage = new Message({
            chat: chatId,
            message: referencedMessage.message,
            sender: req.userId,
            type: "normal",
            referenceMessageId: null,
          });
        } else {
          if (referencedMessage.type === "forward") {
            newMessage = new Message({
              ...referencedMessage._doc,
              _id: new mongoose.Types.ObjectId(),
              chat: chatId,
            });
          } else {
            newMessage = new Message({
              chat: chatId,
              message: null,
              sender: req.userId,
              type: "forward",
              referenceMessageId,
            });
          }
        }
        await newMessage.save();

        const chat = await Chat.findById(chatId);
        chat.lastMessage = newMessage._id;
        await chat.save();

        getSocket().emit("messageSent", { data: chatId });

        return res.status(201).json({
          message: "Message forwarded successfully!",
          data: {
            sender: req.userId,
            type: newMessage.type,
            referenceMessageId: newMessage.referenceMessageId,
            forwardToChat,
          },
        });
      }
    } else {
      const referencedMessage = await Message.findById(referenceMessageId);
      if (type === "reply" && referencedMessage.type === "forward") {
        newMessage = new Message({
          chat: chatId,
          message,
          sender: req.userId,
          type,
          referenceMessageId: referencedMessage.referenceMessageId,
        });
      } else {
        newMessage = new Message({
          chat: chatId,
          message,
          sender: req.userId,
          type,
          referenceMessageId,
        });
      }
      await newMessage.save();

      const chat = await Chat.findById(chatId);
      chat.lastMessage = newMessage._id;
      await chat.save();

      return res.status(201).json({
        message: "Message sent successfully!",
        data: {
          sender: req.userId,
          message,
          type: "normal",
          referenceMessageId: null,
          forwardToChat,
        },
      });
    }
  } catch (err) {
    next(err);
  }
};

export const deleteMessage = async (req, res, next) => {
  try {
    const { messageId } = req.body;

    if (Array.isArray(messageId)) {
      for (const id of messageId) {
        const message = await Message.findById(id);

        if (message.sender.toString() !== req.userId) {
          const error = new Error("You are not the creator of this message.");
          error.statusCode = 405;

          throw error;
        }
      }
    }
    if (Array.isArray(messageId)) {
      for (const id of messageId) {
        const message = await Message.findById(id);

        if (!message) {
          const error = new Error("Message not found.");
          error.statusCode = 404;

          throw error;
        }

        if (message.sender.toString() !== req.userId) {
          const error = new Error("You are not the creator of this message.");
          error.statusCode = 405;

          throw error;
        }

        await Message.findByIdAndDelete(id);
      }
      return res
        .status(200)
        .json({ message: "Messages successfully deleted." });
    }

    const message = await Message.findById(messageId);

    if (message.sender.toString() !== req.userId) {
      const error = new Error("You are not the creator of this message.");
      error.statusCode = 405;

      throw error;
    }

    await Message.findByIdAndDelete(messageId);

    res.status(200).json({ message: "Message successfully deleted." });
  } catch (err) {
    next(err);
  }
};

export const editMessage = async (req, res, next) => {
  try {
    const { chatId, message, messageId } = req.body;

    const messageToEdit = await Message.findById(messageId).populate("sender");

    if (messageToEdit.sender._id.toString() !== req.userId) {
      const error = new Error("Message does not belong to you.");
      error.statusCode = 405;

      throw error;
    }

    if (messageToEdit.message === message) {
      return;
    }
    3;

    messageToEdit.message = message;
    messageToEdit.edited = true;

    await messageToEdit.save();

    getSocket().emit("messageSent", {
      data: chatId,
    });

    res.status(201).json({
      message: "Message sent successfully!",
      data: {
        messageToEdit,
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
        populate: [{ path: "sender" }, { path: "chat" }],
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
