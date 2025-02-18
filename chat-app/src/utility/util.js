import { setUser } from "../store/redux/authSlice";
import { setImage } from "../store/redux/imageSlice";

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
