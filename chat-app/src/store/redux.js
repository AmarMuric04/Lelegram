import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice.js";
import modalReducer from "./modalSlice.js";
import chatReducer from "./chatSlice.js";
import searchReducer from "./searchSlice.js";
import messageReducer from "./messageSlice.js";
import imageReducer from "./imageSlice.js";

const store = configureStore({
  reducer: {
    auth: authReducer,
    modal: modalReducer,
    chat: chatReducer,
    search: searchReducer,
    message: messageReducer,
    image: imageReducer,
  },
});

export default store;
