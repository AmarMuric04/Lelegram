import mongoose from "mongoose";

const pollSchema = mongoose.Schema({
  chat: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Chat",
    required: true,
  },
  question: {
    type: String,
    required: true,
  },
  options: [
    {
      text: String,
      votes: { type: Number, default: 0 },
      voters: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    },
  ],
  settings: {
    anonymousVoting: {
      type: Boolean,
    },
    multipleAnswers: {
      type: Boolean,
    },
    quizMode: {
      type: Boolean,
    },
  },
  explanation: {
    type: String,
  },
});

export default mongoose.model("Poll", pollSchema);
