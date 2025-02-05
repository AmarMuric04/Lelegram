import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    value: "",
    selected: {},
    phoneNumber: "",
    isSigningIn: false,
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
    setIsSigningIn: (state, action) => {
      console.log(action.payload);
      state.isSigningIn = action.payload;
    },
  },
});

export const { setPhoneNumber, setIsSigningIn, setSelected, setValue } =
  authSlice.actions;
export default authSlice.reducer;
