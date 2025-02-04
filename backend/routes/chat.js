import express from "express";
import * as ChatController from "../controllers/chat.js";

const router = express.Router();

router.post("/create-chat", ChatController.createChat);

export default router;
