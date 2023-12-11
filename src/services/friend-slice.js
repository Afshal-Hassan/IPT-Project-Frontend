import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const getFriendsOfUser = createAsyncThunk(
  "friendSlice",
  async (userId) => {
    try {
      const response = await axios.get(
        `https://chatapp-backend-5tbb.onrender.com/friend/all/${userId}`
      );
      return response.data.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
);

const FriendSlice = createSlice({
  name: "friendSlice",
  initialState: {
    data: [],
    isLoader: false,
    isError: false,
  },

  extraReducers: (builder) => {
    builder.addCase(getFriendsOfUser.pending, (state, action) => {
      state.isLoader = true;
    });

    builder.addCase(getFriendsOfUser.fulfilled, (state, action) => {
      state.isLoader = false;
      state.data = action.payload;
    });

    builder.addCase(getFriendsOfUser.rejected, (state, action) => {
      state.isLoader = false;
      state.isError = true;
    });
  },
});

export default FriendSlice.reducer;
