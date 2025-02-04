import { useState } from "react";
import {
  auth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "./firebaseConfig";

const PhoneAuth = () => {
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [error, setError] = useState("");

  // Send OTP
  const sendOTP = () => {
    setError("");
    window.recaptchaVerifier = new RecaptchaVerifier(
      auth,
      "recaptcha-container",
      {
        size: "invisible",
      }
    );

    signInWithPhoneNumber(auth, phone, window.recaptchaVerifier)
      .then((result) => {
        setConfirmationResult(result);
        alert("OTP sent!");
      })
      .catch((err) => setError(err.message));
  };

  // Verify OTP
  const verifyOTP = () => {
    if (!confirmationResult) return;
    confirmationResult
      .confirm(code)
      .then((result) => {
        alert("Phone Verified! User: " + result.user.phoneNumber);
      })
      .catch((err) => setError(err.message));
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-80">
        <h2 className="text-lg font-semibold mb-4">Phone Verification</h2>

        {!confirmationResult ? (
          <>
            <input
              type="tel"
              placeholder="+1234567890"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full p-2 border rounded mb-2"
            />
            <button
              onClick={sendOTP}
              className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
            >
              Send Code
            </button>
          </>
        ) : (
          <>
            <input
              type="text"
              placeholder="Enter OTP"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full p-2 border rounded mb-2"
            />
            <button
              onClick={verifyOTP}
              className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
            >
              Verify Code
            </button>
          </>
        )}

        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

        <div id="recaptcha-container"></div>
      </div>
    </div>
  );
};

export default PhoneAuth;
