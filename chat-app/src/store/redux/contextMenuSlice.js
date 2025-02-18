import { createSlice } from "@reduxjs/toolkit";

const contextMenuSlice = createSlice({
  name: "contextMenu",
  initialState: {
    open: false,
    contextMenuPosition: null,
  },
  reducers: {
    openContextMenu: (state, action) => {
      state.open = true;
      state.contextMenuPosition = action.payload;
    },
    closeContextMenu: (state) => {
      state.open = false;
      state.contextMenuPosition = null;
    },
  },
});

export const { openContextMenu, closeContextMenu } = contextMenuSlice.actions;
export default contextMenuSlice.reducer;
