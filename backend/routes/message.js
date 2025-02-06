import express from "express";
import * as MessageController from "../controllers/message.js";
import isAuth from "../middleware/is-auth.js";

const router = express.Router();

router.get("/get-messages/:chatId", isAuth, MessageController.getMessages);

router.post("/send-message", isAuth, MessageController.sendMessage);

export default router;
