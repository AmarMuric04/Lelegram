import mongoose from "mongoose";
const messageSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      required: true,
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
  },
  { timestamps: true }
);

export default mongoose.model("ChatMessage", messageSchema);
