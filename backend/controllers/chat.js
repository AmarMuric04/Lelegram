import Chat from "../models/chat.js";

export const getChats = async (req, res, next) => {
  try {
    const chats = await Chat.find();
    console.log(chats);
    res
      .status(200)
      .json({ message: "Successfully fetched chats.", data: chats });
  } catch (err) {
    next(err);
  }
};

export const createChat = async (req, res, next) => {
  console.log(req.body);
  try {
    const chat = new Chat(req.body);
    await chat.save();
    res.json(chat);
  } catch (err) {
    next(err);
  }
};
