import User from "../models/user.js";
import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import { createJWT } from "../utility/jwt.js";

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

export const createUser = async (req, res, next) => {
  try {
    const { phoneNumber, email, firstName, lastName } = req.body;
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

    const user = new User({
      phoneNumber,
      email,
      firstName,
      lastName,
    });

    await user.save();

    const token = createJWT(user);

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
    const { phoneNumber } = req.body;

    const user = await User.findOne({ phoneNumber });

    if (!user) {
      const error = new Error("User not found.");
      error.statusCode = 404;

      throw error;
    }

    const token = createJWT(user);

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
