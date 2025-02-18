import { createSlice } from "@reduxjs/toolkit";

const searchSlice = createSlice({
  name: "search",
  initialState: { data: [], isFocused: false, value: "" },
  reducers: {
    setSearch: (state, action) => {
      state.data = action.payload;
    },
    setIsFocused: (state, action) => {
      if (!action.payload) {
        state.data = null;
        state.value = "";
      }
      state.isFocused = action.payload;
    },
    setValue: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { setSearch, setIsFocused, setValue } = searchSlice.actions;
export default searchSlice.reducer;
