import { useState } from "react";
import {
  auth,
  setUpRecaptcha,
  signInWithPhoneNumber,
} from "../../../firebaseConfig.js";

const OTPAuth = () => {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmation, setConfirmation] = useState(null);

  const sendOTP = async () => {
    try {
      console.log("sending OTp");
      setUpRecaptcha("recaptcha-container");
      const confirmationResult = await signInWithPhoneNumber(
        auth,
        phone,
        window.recaptchaVerifier
      );
      setConfirmation(confirmationResult);
      alert("OTP sent!");
    } catch (error) {
      console.error("Error sending OTP:", error);
    }
  };

  const verifyOTP = async () => {
    try {
      await confirmation.confirm(otp);
      alert("Phone number verified!");
    } catch (error) {
      console.error("OTP verification failed:", error);
    }
  };

  return (
    <div>
      <h2>Phone Authentication</h2>
      <div id="recaptcha-container"></div>
      {!confirmation ? (
        <>
          <input
            type="text"
            placeholder="+1234567890"
            onChange={(e) => setPhone(e.target.value)}
          />
          <button onClick={sendOTP}>Send OTP</button>
        </>
      ) : (
        <>
          <input
            type="text"
            placeholder="Enter OTP"
            onChange={(e) => setOtp(e.target.value)}
          />
          <button onClick={verifyOTP}>Verify OTP</button>
        </>
      )}
    </div>
  );
};

export default OTPAuth;
