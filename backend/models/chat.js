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
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    image: {
      url: { type: String },
      public_id: { type: String },
    },
    gradient: {
      colors: [{ type: String }],
      direction: { type: String, default: "to right" },
    },
  },
  { timestamps: true }
);

chatSchema.index({ name: "text", description: "text" });

export default mongoose.model("Chat", chatSchema);
