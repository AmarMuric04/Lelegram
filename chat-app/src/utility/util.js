import { setUser } from "../store/redux/authSlice";
import { setImage } from "../store/redux/imageSlice";
import emojiRegex from "emoji-regex";

export const generateBase64FromImage = (imageFile) => {
  const reader = new FileReader();
  const promise = new Promise((resolve, reject) => {
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = (err) => reject(err);
  });

  reader.readAsDataURL(imageFile);
  return promise;
};

export const handlePostInput = async (value, files, dispatch) => {
  try {
    if (files && files[0]) {
      const file = files[0];

      const b64 = await generateBase64FromImage(file);

      dispatch(setImage({ url: file, preview: b64 }));
    } else {
      console.error("No file selected.");
    }
  } catch (error) {
    console.error(error);
  }
};

export const copyToClipboard = (text) => {
  navigator.clipboard
    .writeText(text)
    .then(() => alert("Copied to clipboard!"))
    .catch((err) => console.error("Failed to copy:", err));
};

export const checkIfSignedIn = (dispatch) => {
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const expiresIn = Number(localStorage.getItem("expires-in"));

  if (!token || !userId) {
    dispatch(setUser(null));
    return false;
  }

  if (Date.now() >= expiresIn) {
    dispatch(setUser(null));
    return false;
  }

  const timeLeftMs = expiresIn - Date.now();
  console.log(`Signing out in ${timeLeftMs / (1000 * 60 * 60 * 24)} days`);

  const timeout = setTimeout(() => {
    if (Date.now() >= expiresIn) {
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      localStorage.removeItem("expires-in");
      dispatch(setUser(null));
      clearTimeout(timeout);
    }
  }, Math.min(timeLeftMs, 2 ** 31 - 1));

  return true;
};

export const signOut = (dispatch) => {
  dispatch(setUser(null));
  localStorage.removeItem("token");
  localStorage.removeItem("userId");
  localStorage.removeItem("expires-in");
};

export const sendOTP = async (email) => {
  await fetch(`${import.meta.env.VITE_SERVER_PORT}/send-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
};

export const verifyOTP = async (email, otp) => {
  const response = await fetch(
    `${import.meta.env.VITE_SERVER_PORT}/verify-otp`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp }),
    }
  );

  const data = await response.json();

  if (data.success !== true) {
    const error = new Error(data.message);
    error.data = data.data;

    throw error;
  }

  return data;
};

export const isOnlyEmojis = (text) => {
  if (!text) return false;

  const regex = emojiRegex();
  const matches = text.match(regex);
  const textWithoutEmojis = text.replace(regex, "");

  const hasNonEmojis = textWithoutEmojis.trim().length > 0;

  return {
    onlyEmojis: !hasNonEmojis && matches !== null,
    count: matches ? matches.length : 0,
  };
};

const getFormattedTimeAMPM = (date, AMPM) => {
  return new Date(date).toLocaleString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: AMPM,
    hour24: !AMPM,
  });
};

export const getRecentTime = (date, AMPM) => {
  // const messageDate = new Date(date);
  // const currentDate = new Date();
  // const diffInSeconds = Math.floor((currentDate - messageDate) / 1000);
  // const diffInMinutes = Math.floor(diffInSeconds / 60);
  // const diffInHours = Math.floor(diffInMinutes / 60);
  // const diffInDays = Math.floor(diffInHours / 24);

  return getFormattedTimeAMPM(date, AMPM);

  // if (diffInMinutes < 60) {
  //   return `${diffInMinutes} mins ago`;
  // } else if (diffInHours < 24) {
  //   return getFormattedTimeAMPM(date, AMPM);
  //   // return `${diffInHours} hrs ago`;
  // } else if (diffInDays === 1) {
  //   return "Yesterday";
  // }
  // } else if (diffInDays < 7) {
  //   return `${diffInDays} days ago`;
  // } else {
  //   return getFormattedTimeAMPM(date);
  // }
};
