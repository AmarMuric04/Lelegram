import Chat from "../models/chat.js";

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
