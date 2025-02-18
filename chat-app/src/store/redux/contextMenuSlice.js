import { createSlice } from "@reduxjs/toolkit";

const contextMenuSlice = createSlice({
  name: "contextMenu",
  initialState: {
    open: false,
    contextMenuInfo: null,
    id: null,
  },
  reducers: {
    openContextMenu: (state, action) => {
      state.open = true;
      state.contextMenuInfo = action.payload;
    },
    closeContextMenu: (state) => {
      state.open = false;
      state.contextMenuInfo = null;
    },
  },
});

export const { openContextMenu, closeContextMenu } = contextMenuSlice.actions;
export default contextMenuSlice.reducer;
