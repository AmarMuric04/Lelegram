import User from "../models/user.js";
import { validationResult } from "express-validator";
import { createJWT } from "../utility/jwt.js";
import Chat from "../models/chat.js";

export const getUser = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);

    if (!user) {
      const error = new Error("User doesn't exist.");
      error.statusCode = 404;

      throw error;
    }

    res.status(200).json({ message: "User successfully fetched.", data: user });
  } catch (err) {
    next(err);
  }
};

export const checkInput = async (req, res, next) => {
  try {
    const { email } = req.body;
    const errors = validationResult(req);
    const validationError = errors.array();

    if (!errors.isEmpty()) {
      const error = new Error("Validation Error");
      error.data = validationError;
      error.statusCode = 422;

      throw error;
    }

    const alreadyExists = await User.findOne({ email });

    if (alreadyExists) {
      const error = new Error("Email already used.");
      error.statusCode = 422;
      error.data = [{ path: "email" }];

      throw error;
    }

    res.status(200).json({ message: "Input is valid" });
  } catch (err) {
    next(err);
  }
};

export const editUser = async (req, res, next) => {
  try {
    const { firstName, lastName, imageUrl } = req.body;

    await User.findByIdAndUpdate(req.userId, {
      $set: { firstName, lastName, imageUrl },
    });

    res.status(200).json({ message: "Succuessfully updated the user" });
  } catch (err) {
    next(err);
  }
};

export const createUser = async (req, res, next) => {
  try {
    const { phoneNumber, email, firstName, lastName, staySignedIn, imageUrl } =
      req.body;

    const user = new User({
      phoneNumber,
      email,
      firstName,
      lastName,
      imageUrl:
        imageUrl ||
        "https://res.cloudinary.com/dccik7g13/image/upload/v1740222827/cduvcfnv5e2ehyv1mtt5.jpg",
    });

    await user.save();

    const gradient = { colors: ["#BE10CE", "#F130FF"], direction: "to right" };

    const chat = new Chat({
      name: "ʚ♡ɞ Saved Messages",
      description: "This is where you store your saved messages.",
      creator: null,
      admins: [],
      users: [user],
      gradient,
      imageUrl: null,
      lastMessage: null,
      type: "saved",
    });

    await chat.save();

    let time = "1d";
    if (staySignedIn) time = "7d";

    const token = createJWT(user, time);

    res.status(201).json({
      message: "User created successfully",
      data: {
        userId: user._id.toString(),
        token,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const signIn = async (req, res, next) => {
  try {
    const { phoneNumber, staySignedIn } = req.body;

    const user = await User.findOne({ phoneNumber });

    console.log(user, phoneNumber);

    if (!user) {
      const error = new Error("User not found.");
      error.statusCode = 404;

      throw error;
    }

    let time = "1d";
    if (staySignedIn) time = "7d";

    const token = createJWT(user, time);

    res.status(200).json({
      message: "Successfully signed in.",
      data: { userId: user._id, token },
    });
  } catch (err) {
    next(err);
  }
};

export const checkPhoneNumber = async (req, res, next) => {
  try {
    const { phoneNumber } = req.body;
    const user = await User.findOne({ phoneNumber });

    if (user) {
      return res
        .status(200)
        .json({ message: "Phone number in database.", data: true });
    }

    res
      .status(201)
      .json({ message: "Phone number not in database", data: false });
  } catch (err) {
    next(err);
  }
};

export const createDirectMessage = async (req, res, next) => {
  try {
    const { userId } = req.body;
    const currentUserId = req.userId;

    if (currentUserId === userId) {
      return res.status(400).json({ message: "You cannot message yourself." });
    }

    let chat = await Chat.findOne({
      users: { $all: [currentUserId, userId] },
      type: "private",
    });

    if (!chat) {
      chat = new Chat({
        creator: null,
        admins: [currentUserId, userId],
        users: [currentUserId, userId],
        name: null,
        description: null,
        imageUrl: null,
        gradient: null,
        type: "private",
      });

      await chat.save();
    }

    res.status(201).json({ message: "Chat started.", chat });
  } catch (err) {
    next(err);
  }
};
