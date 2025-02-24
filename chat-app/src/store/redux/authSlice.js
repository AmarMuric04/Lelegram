import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    value: "",
    selected: {},
    phoneNumber: "",
    isSigningIn: false,
    user: {},
    email: "",
    firstName: "",
    lastName: "",
    staySignedIn: false,
    countryCode: "",
    countryName: "",
  },
  reducers: {
    setCountryCode: (state, action) => {
      state.countryCode = action.payload;
    },
    setCountryName: (state, action) => {
      state.countryName = action.payload;
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
      console.log(action.payload, state.user);
    },
    setEmail: (state, action) => {
      state.email = action.payload;
    },
    setFirstName: (state, action) => {
      state.firstName = action.payload;
    },
    setLastName: (state, action) => {
      state.lastName = action.payload;
    },
    setStaySignedIn: (state, action) => {
      state.staySignedIn = action.payload;
    },
  },
});

export const {
  setPhoneNumber,
  setIsSigningIn,
  setUser,
  setSelected,
  setValue,
  setEmail,
  setFirstName,
  setLastName,
  setStaySignedIn,
  setCountryCode,
  setCountryName,
} = authSlice.actions;
export default authSlice.reducer;
