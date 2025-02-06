import express from "express";
import * as ChatController from "../controllers/chat.js";
import isAuth from "../middleware/is-auth.js";

const router = express.Router();

router.get("/get-chats", isAuth, ChatController.getChats);

router.post("/create-chat", isAuth, ChatController.createChat);

export default router;
