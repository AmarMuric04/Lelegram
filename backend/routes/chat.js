import express from "express";
import * as ChatController from "../controllers/chat.js";
import isAuth from "../middleware/is-auth.js";

const router = express.Router();

router.get("/get-all-chats", isAuth, ChatController.getAllChats);

router.get("/get-user-chats", isAuth, ChatController.getUserChats);

router.post("/get-searched-chats", isAuth, ChatController.getSearchedChats);

router.post("/create-chat", isAuth, ChatController.createChat);

router.delete(
  "/remove-user/:chatId",
  isAuth,
  ChatController.removeUserFromChat
);

router.post("/add-user/:chatId", isAuth, ChatController.addUserToChat);

export default router;
