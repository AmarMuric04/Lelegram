import { createSlice } from "@reduxjs/toolkit";

const messageSlice = createSlice({
  name: "message",
  initialState: {
    message: null,
    messageType: "normal",
    forwardedChat: null,
    messageToEdit: null,
  },
  reducers: {
    setMessage: (state, action) => {
      state.message = action.payload;
    },
    setMessageType: (state, action) => {
      state.messageType = action.payload;
    },
    setForwardedChat: (state, action) => {
      state.forwardedChat = action.payload;
    },
    setMessageToEdit: (state, action) => {
      state.messageToEdit = action.payload;
    },
  },
});

export const {
  setMessage,
  setMessageType,
  setForwardedChat,
  setMessageToEdit,
} = messageSlice.actions;
export default messageSlice.reducer;
