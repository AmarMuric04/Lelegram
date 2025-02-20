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
    otp: {
      type: String,
    },
  },
  { timestamps: true }
);

UserSchema.methods.setOTP = async function (otp) {
  const salt = await bcrypt.genSalt(10);
  this.otp = await bcrypt.hash(otp, salt);
  this.otpExpires = Date.now() + 5 * 60 * 1000;
};

UserSchema.methods.verifyOTP = async function (enteredOtp) {
  return await bcrypt.compare(enteredOtp, this.otp);
};

export default mongoose.model("User", UserSchema);
