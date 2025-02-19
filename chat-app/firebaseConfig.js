// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBPas5avZxMDD2TGydDVUbpGQrvlyl1QB8",
  authDomain: "telegram-murga.firebaseapp.com",
  projectId: "telegram-murga",
  storageBucket: "telegram-murga.firebasestorage.app",
  messagingSenderId: "930439866576",
  appId: "1:930439866576:web:c648dee1b337a47487d6d5",
  measurementId: "G-XQRZ123L2V",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
auth.useDeviceLanguage();

const setUpRecaptcha = (containerId) => {
  window.recaptchaVerifier = new RecaptchaVerifier(
    containerId,
    {
      size: "invisible",
    },
    auth
  );
};

export { auth, setUpRecaptcha, signInWithPhoneNumber };
