import { createSlice } from "@reduxjs/toolkit";

const messageSlice = createSlice({
  name: "message",
  initialState: { message: null, messageType: "normal", forwardedChat: null },
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
  },
});

export const { setMessage, setMessageType, setForwardedChat } =
  messageSlice.actions;
export default messageSlice.reducer;
