import { createSlice } from "@reduxjs/toolkit";

const searchSlice = createSlice({
  name: "search",
  initialState: { data: [], isFocused:false },
  reducers: {
    setSearch: (state, action) => {
      state.data = action.payload;
    },
    setIsFocused: (state, action) => {
      state.isFocused = action.payload;
    },
  },
});

export const { setSearch, setIsFocused } = searchSlice.actions;
export default searchSlice.reducer;
