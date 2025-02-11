import mongoose from "mongoose";

const chatGroupSchema = new mongoose.Schema({
  creator: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
  chatIds: [{ type: mongoose.Types.ObjectId, ref: "Chat", required: true }],
  name: {
    type: String,
  },
  type: {
    type: String,
    required: true,
  },
});

export default mongoose.model("chatGroup", chatGroupSchema);
