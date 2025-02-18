import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  url: "",
  preview: null,
};

const imageSlice = createSlice({
  name: "image",
  initialState,
  reducers: {
    setImage: (state, action) => {
      state.url = action.payload.url;
      state.preview = action.payload.preview;
    },
  },
});

export const { setImage } = imageSlice.actions;
export default imageSlice.reducer;
