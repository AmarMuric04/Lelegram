import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
    },
    lastSeen: { type: Date, default: null },
  },
  { timestamps: true }
);

export default mongoose.model("User", UserSchema);
