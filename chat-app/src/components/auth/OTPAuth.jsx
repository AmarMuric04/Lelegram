import { useEffect, useState } from "react";
import {
  auth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "../../../firebaseConfig";

const OTPAuth = () => {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmation, setConfirmation] = useState(null);

  useEffect(() => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        {
          size: "invisible",
          callback: (response) => {
            console.log("reCAPTCHA solved", response);
          },
        }
      );
    }
  }, []);

  const sendOTP = async () => {
    try {
      const recaptcha = window.recaptchaVerifier;
      if (!recaptcha) {
        throw new Error("reCAPTCHA not initialized");
      }

      const confirmationResult = await signInWithPhoneNumber(
        auth,
        phone,
        recaptcha
      );
      setConfirmation(confirmationResult);
      alert("OTP sent!");
    } catch (error) {
      console.error("Error sending OTP:", error);
      alert("Failed to send OTP. Please try again. " + error.message);
    }
  };

  const verifyOTP = async () => {
    try {
      if (!confirmation) {
        throw new Error("No OTP confirmation available");
      }
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
