import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: "",
  message: null,
  messageType: "normal",
  forwardedChat: null,
  messageToEdit: null,
  isSelecting: false,
  selected: [],
};

const messageSlice = createSlice({
  name: "message",
  initialState,
  reducers: {
    setValue: (state, action) => {
      state.value = action.payload;
    },
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
    setIsSelecting: (state, action) => {
      state.isSelecting = action.payload;
    },
    setSelected: (state, action) => {
      state.selected = action.payload;
    },
    startForwarding: (state) => {
      state.messageType = "forward";
      state.message = state.selected;
      state.forwardedChat = null;
    },
    resetMessage: () => initialState,
  },
});

export const {
  setMessage,
  setMessageType,
  setForwardedChat,
  setMessageToEdit,
  setIsSelecting,
  setSelected,
  resetMessage,
  setValue,
  startForwarding,
} = messageSlice.actions;
export default messageSlice.reducer;
