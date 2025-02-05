import express from "express";
import * as ChatController from "../controllers/chat.js";

const router = express.Router();

router.get("/get-chats", ChatController.getChats);

router.post("/create-chat", ChatController.createChat);

export default router;
