import Chat from "../models/chat.js";
import User from "../models/user.js";

export const getChats = async (req, res, next) => {
  try {
    const chats = await Chat.find({ users: req.userId });
    res
      .status(200)
      .json({ message: "Successfully fetched chats.", data: chats });

    console.log(chats);
  } catch (err) {
    next(err);
  }
};

export const createChat = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    const creator = await User.findById(req.userId);

    const chat = new Chat({
      name,
      description,
      creator,
      admins: [creator],
      users: [creator],
    });
    await chat.save();
    res.json(chat);
  } catch (err) {
    next(err);
  }
};
