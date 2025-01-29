import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    value: "",
    selected: {},
    phoneNumber: "",
  },
  reducers: {
    setSelected: (state, action) => {
      state.selected = action.payload;
    },
    setValue: (state, action) => {
      state.value = action.payload;
    },
    setPhoneNumber: (state, action) => {
      state.phoneNumber = action.payload;
    },
  },
});

export const { setPhoneNumber, setSelected, setValue } = authSlice.actions;
export default authSlice.reducer;
