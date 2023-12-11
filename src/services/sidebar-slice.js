import { createSlice } from "@reduxjs/toolkit";

const SideBarSlice = createSlice({
  name: "senderAndReceiverData",
  initialState: {
    data: false,
    isLoader: false,
    isError: false,
  },

  reducers: {
    updateSideBarStatus: (state, action) => {
      state.data = action.payload;
    },
  },
});

export const { updateSideBarStatus } = SideBarSlice.actions;

export default SideBarSlice.reducer;
