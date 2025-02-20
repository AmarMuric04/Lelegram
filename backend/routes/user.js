import express from "express";
import * as UserController from "../controllers/user.js";
import { body } from "express-validator";
import isAuth from "../middleware/is-auth.js";

const router = express.Router();

router.get("/get-user/:userId", isAuth, UserController.getUser);

router.post("/signin", UserController.signIn);

router.post(
  "/check-input",
  [
    body("firstName")
      .not()
      .isEmpty()
      .withMessage("Please provide your first name."),
    body("lastName")
      .not()
      .isEmpty()
      .withMessage("Please provide your first name."),
    body("email").isEmail().withMessage("Provide a valid email."),
  ],
  UserController.checkInput
);

router.post("/create-user", UserController.createUser);

router.post("/check-phoneNumber", UserController.checkPhoneNumber);

export default router;
