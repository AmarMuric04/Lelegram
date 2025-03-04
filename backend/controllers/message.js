import Message from "../models/message.js";
import Chat from "../models/chat.js";
import Poll from "../models/poll.js";
import mongoose from "mongoose";
import { getSocket } from "../socket.js";

export const sendMessage = async (req, res, next) => {
  try {
    const {
      chatId,
      message,
      type,
      referenceMessageId,
      forwardToChat,
      pollOptions,
      pollQuestion,
      pollSettings,
      pollExplanation,
      pollCorrectAnswer,
      imageUrl,
    } = req.body;

    if (type === "poll") {
      const poll = new Poll({
        question: pollQuestion,
        options: pollOptions.map((option) => ({
          text: option,
          votes: 0,
          voters: [],
        })),
        chat: chatId,
        settings: JSON.parse(req.body.pollSettings || "{}"),
        explanation: pollExplanation,
        correctAnswer: pollCorrectAnswer,
      });

      await poll.save();

      const newMessage = new Message({
        chat: chatId,
        message,
        type,
        referenceMessageId: null,
        forwardedToChat: null,
        sender: req.userId,
        imageUrl: null,
        poll,
      });

      await newMessage.save();
      const chat = await Chat.findById(chatId);
      chat.lastMessage = newMessage._id;
      await chat.save();

      getSocket().emit("messageSent", { data: chatId });

      return res.status(201).json({
        message: "Poll created successfully!",
        data: poll,
      });
    }

    if (type !== "forward" && imageUrl) {
      const newMessage = new Message({
        chat: chatId,
        message,
        sender: req.userId,
        type: type,
        referenceMessageId,
        imageUrl,
      });

      getSocket().emit("messageSent", { data: chatId });
      console.log("Emitted");

      const chat = await Chat.findById(chatId);
      chat.lastMessage = newMessage._id;
      await chat.save();
      await newMessage.save();

      return res.status(201).json({
        message: "Message sent successfully!",
        data: newMessage,
      });
    }

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
            if (
              referencedMessage.type !== "reply" &&
              referencedMessage.referenceMessageId
            ) {
              const message = await Message.findById(
                referencedMessage.referenceMessageId
              );

              forwardedMsg = new Message({
                chat: chatId,
                message: message.message,
                sender: req.userId,
                type: "normal",
                referenceMessageId: null,
              });
            } else {
              forwardedMsg = new Message({
                chat: chatId,
                message: referencedMessage.message,
                sender: req.userId,
                type: "normal",
                referenceMessageId: null,
              });
            }
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
        console.log("Emitted");

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

        const referencedMessage = await Message.findById(referenceMessageId)
          .populate("chat")
          .populate("referenceMessageId");

        if (!referencedMessage) {
          const error = new Error("Referenced message not found.");
          error.statusCode = 404;
          throw error;
        }

        if (referencedMessage.chat.type === "saved") {
          if (referencedMessage.type === "forward") {
            newMessage = new Message({
              chat: chatId,
              message: referencedMessage.referenceMessageId.message,
              sender: req.userId,
              type: "normal",
              referenceMessageId: null,
            });
          } else {
            newMessage = new Message({
              chat: chatId,
              message: referencedMessage.message,
              sender: req.userId,
              type: "normal",
              referenceMessageId: null,
            });
          }
        } else {
          if (referencedMessage.type === "forward") {
            newMessage = new Message({
              ...referencedMessage._doc,
              sender: req.userId,
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
        console.log("Emitted");

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

      getSocket().emit("messageSent", { data: chatId });
      console.log("Emitted");

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

export const sendVoiceMessage = async (req, res, next) => {
  try {
    console.log("Hello");
    const { chatId, audioUrl } = req.body;

    const chat = await Chat.findById(chatId);

    const newMessage = new Message({
      chat: chatId,
      sender: req.userId,
      content: null,
      type: "voice",
      audioUrl: audioUrl || null,
      imageUrl: null,
      repliedTo: null,
      forwardedFrom: null,
      timestamp: new Date(),
    });

    const savedMessage = await newMessage.save();

    chat.lastMessage = newMessage._id;

    await chat.save();

    getSocket().emit("messageSent", {
      data: chatId,
    });
    res.json({ success: true, message: savedMessage });
  } catch (error) {
    next(error);
  }
};
// to-do: refactor this function ↑
export const deleteMessage = async (req, res, next) => {
  try {
    const { messageId } = req.body;

    if (Array.isArray(messageId)) {
      for (const id of messageId) {
        const message = await Message.findById(id);
        const chat = await Chat.findById(message.chat);

        if (!message) {
          const error = new Error("Message not found.");
          error.statusCode = 404;
          throw error;
        }

        if (
          !chat.admins.some((a) => a.toString() === req.userId) &&
          message.sender?.toString() !== req.userId
        ) {
          const error = new Error("You are not the creator of this message.");
          error.statusCode = 405;
          throw error;
        }

        await Message.findByIdAndDelete(id);

        const newLastMessage = await Message.findOne({ chat: chat._id })
          .sort({ createdAt: -1 })
          .limit(1);

        if (newLastMessage) {
          chat.lastMessage = newLastMessage._id;
          await chat.save();
        }

        getSocket().emit("messageSent", {
          data: chat._id,
        });
      }

      return res
        .status(200)
        .json({ message: "Messages successfully deleted." });
    }

    const message = await Message.findById(messageId);
    const chat = await Chat.findById(message.chat);

    if (
      !chat.admins.some((a) => a.toString() === req.userId) &&
      message.sender?.toString() !== req.userId
    ) {
      const error = new Error("You are not the creator of this message.");
      error.statusCode = 405;
      throw error;
    }

    await Message.findByIdAndDelete(messageId);

    const newLastMessage = await Message.findOne({ chat: chat._id })
      .sort({ createdAt: -1 })
      .limit(1);

    if (newLastMessage) {
      chat.lastMessage = newLastMessage._id;
      await chat.save();
    }

    getSocket().emit("messageSent", {
      data: chat,
    });

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

    const messages = await Message.find({ chat: chatId })
      .populate("sender", "firstName lastName username imageUrl _id")
      .populate("chat")
      .populate("poll")
      .populate({
        path: "referenceMessageId",
        select: "sender chat poll message type imageUrl audioUrl",
        populate: [
          {
            path: "sender",
            select: "firstName lastName username imageUrl _id",
          },
          {
            path: "chat",
            select: "users name type imageUrl gradient",
            populate: {
              path: "users",
              select: "firstName lastName imageUrl _id",
            },
          },
          { path: "poll", select: "question options" },
        ],
      })
      .lean();

    res.status(200).json({
      message: "Successfully fetched messages.",
      data: messages,
    });
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
    })
      .populate("chat")
      .populate("sender");

    if (messages.length === 0) {
      return res.status(200).json({
        data: messages,
      });
    }

    messages = messages.map((message) => {
      if (!message.chat) return;
      return {
        ...message.chat._doc,
        message: message.message,
        more: message,
      };
    });

    res.status(200).json({
      data: messages.filter(
        (message) => message.type !== "saved" && message.type !== "private"
      ),
    });
  } catch (err) {
    next(err);
  }
};

export const addReaction = async (req, res, next) => {
  try {
    const { reaction, messageId } = req.body;
    const message = await Message.findById(messageId);

    if (!message) {
      const error = new Error("Message does not exist.");
      error.statusCode = 404;
      throw error;
    }

    const chat = await Chat.findById(message.chat);
    const userReactions = message.reactions.get(reaction) || [];
    let updatedMessage;

    if (userReactions.includes(req.userId)) {
      updatedMessage = await Message.findOneAndUpdate(
        { _id: messageId },
        { $pull: { [`reactions.${reaction}`]: req.userId } },
        { new: true }
      );

      if (updatedMessage.reactions[reaction]?.length === 0) {
        updatedMessage = await Message.findOneAndUpdate(
          { _id: messageId },
          { $unset: { [`reactions.${reaction}`]: "" } },
          { new: true }
        );
      }

      getSocket().emit("messageSent", { data: chat._id });
      console.log("Emitted: Reaction removed");

      return res.status(201).json({
        message: "Reaction successfully removed.",
        data: updatedMessage,
      });
    } else {
      updatedMessage = await Message.findOneAndUpdate(
        { _id: messageId },
        { $addToSet: { [`reactions.${reaction}`]: req.userId } },
        { new: true }
      );
    }

    getSocket().emit("messageSent", { data: chat._id });
    console.log("Emitted: Reaction added");

    res
      .status(201)
      .json({ message: "Reaction successfully added.", data: updatedMessage });
  } catch (err) {
    next(err);
  }
};

export const addSeen = async (req, res, next) => {
  try {
    const { messageId } = req.params;
    const userId = req.userId;

    const message = await Message.findById(messageId);
    if (!message) {
      const error = new Error("Message not found");
      error.statusCode = 404;

      throw error;
    }

    const chat = await Chat.findById(message.chat);
    if (!chat) {
      const error = new Error("Chat not found");
      error.statusCode = 404;

      throw error;
    }

    if (!message.seenBy.includes(userId)) {
      message.seenBy.push(userId);
      await message.save();
    }

    res.status(200).json({ success: true, message: "Message marked as seen" });
  } catch (err) {
    next(err);
  }
};
