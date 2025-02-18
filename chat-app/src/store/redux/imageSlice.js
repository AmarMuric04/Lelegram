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
    resetImage: () => initialState,
  },
});

export const { setImage, resetImage } = imageSlice.actions;
export default imageSlice.reducer;
