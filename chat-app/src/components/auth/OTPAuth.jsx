import { useState } from "react";
import {
  auth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "../../../firebaseConfig";

const OTPAuth = () => {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmation, setConfirmation] = useState(null);

  // Set up reCAPTCHA for production
  const setUpRecaptcha = () => {
    if (window.recaptchaVerifier) return;

    window.recaptchaVerifier = new RecaptchaVerifier(
      "recaptcha-container",
      {
        size: "invisible",
        callback: (response) => {
          console.log("reCAPTCHA solved", response);
        },
      },
      auth
    );
  };

  // Send OTP to the user's phone
  const sendOTP = async () => {
    try {
      setUpRecaptcha(); // Set up reCAPTCHA

      const confirmationResult = await signInWithPhoneNumber(
        auth,
        phone,
        window.recaptchaVerifier
      );
      setConfirmation(confirmationResult); // Store confirmation result
      alert("OTP sent!");
    } catch (error) {
      console.error("Error sending OTP:", error);
      alert("Failed to send OTP. Please try again. " + error);
    }
  };

  // Verify OTP
  const verifyOTP = async () => {
    try {
      await confirmation.confirm(otp);
      alert("Phone number verified!");
    } catch (error) {
      console.error("Error verifying OTP:", error);
      alert("Invalid OTP.");
    }
  };

  return (
    <div>
      <div id="recaptcha-container"></div>
      <input
        type="text"
        placeholder="Enter phone number"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />
      <button onClick={sendOTP}>Send OTP</button>

      {confirmation && (
        <>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <button onClick={verifyOTP}>Verify OTP</button>
        </>
      )}
    </div>
  );
};

export default OTPAuth;
