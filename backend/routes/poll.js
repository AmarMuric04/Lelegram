import express from "express";
import * as PollController from "../controllers/poll.js";
import isAuth from "../middleware/is-auth.js";

const router = express.Router();

// router.post("/create-poll", isAuth, PollController.createPoll);

export default router;
