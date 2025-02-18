import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    value: "",
    selected: {},
    phoneNumber: "",
    isSigningIn: false,
    user: {},
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
      state.isSigningIn = action.payload;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
  },
});

export const {
  setPhoneNumber,
  setIsSigningIn,
  setUser,
  setSelected,
  setValue,
} = authSlice.actions;
export default authSlice.reducer;
