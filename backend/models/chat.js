import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    admins: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    removedUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    name: {
      type: String,
    },
    description: {
      type: String,
    },
    imageUrl: {
      type: String,
    },
    gradient: {
      colors: [{ type: String }],
      direction: { type: String, default: "to right" },
    },
    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ChatMessage",
    },
    pinnedMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ChatMessage",
    },
    type: {
      type: String,
      required: true,
    },
    lastReadMessages: {
      type: Map,
      of: mongoose.Schema.Types.ObjectId,
      default: {},
    },
  },
  { timestamps: true }
);

export default mongoose.model("Chat", chatSchema);
