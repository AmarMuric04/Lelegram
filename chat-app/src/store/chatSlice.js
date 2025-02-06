import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
  name: "chat",
  initialState: { activeChat: null },
  reducers: {
    setActiveChat: (state, action) => {
      state.activeChat = action.payload;
    },
  },
});

export const { setActiveChat } = chatSlice.actions;
export default chatSlice.reducer;
