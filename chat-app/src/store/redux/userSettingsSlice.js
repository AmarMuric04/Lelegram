import { createSlice } from "@reduxjs/toolkit";

const userSettingsSlice = createSlice({
  name: "userSettings",
  initialState: {
    theme: "dark-theme",
    timeFormat: "24hours",
    sendMessageBy: "Enter",
  },
  reducers: {
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
    setTimeFormat: (state, action) => {
      state.timeFormat = action.payload;
    },
    setSendMessageBy: (state, action) => {
      state.sendMessageBy = action.payload;
    },
  },
});

export const { setTheme, setTimeFormat, setSendMessageBy } =
  userSettingsSlice.actions;
export default userSettingsSlice.reducer;
