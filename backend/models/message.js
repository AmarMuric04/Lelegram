import mongoose from "mongoose";
const messageSchema = new mongoose.Schema(
  {
    message: {
      type: String,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    chat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
    },
    type: {
      type: String,
      required: true,
    },
    referenceMessageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ChatMessage",
    },
    edited: {
      type: Boolean,
    },
    reactions: {
      type: Map,
      of: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
      default: {},
    },
    imageUrl: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("ChatMessage", messageSchema);
