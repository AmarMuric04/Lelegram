import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  sender: { type: String, required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  color: { type: String, required: true },
});

const Message = mongoose.model("Message", messageSchema);

export default Message;
