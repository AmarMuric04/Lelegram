import User from "../models/user.js";
import { validationResult } from "express-validator";

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

    res.status(201).json({
      message: "User created successfully",
      user: { phoneNumber, email, firstName, lastName },
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
      res
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
