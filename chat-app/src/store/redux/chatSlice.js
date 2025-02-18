import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
  name: "chat",
  initialState: { activeChat: null, userChats: [] },
  reducers: {
    setActiveChat: (state, action) => {
      state.activeChat = action.payload;
    },
    setUserChats: (state, action) => {
      state.userChats = action.payload;
    },
  },
});

export const { setActiveChat, setUserChats } = chatSlice.actions;
export default chatSlice.reducer;
