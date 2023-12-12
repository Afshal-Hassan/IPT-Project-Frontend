import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const getMessagesOfTwoUsers = createAsyncThunk(
  "messageSlice",
  async (data) => {
    try {
      const response = await axios.post(
        `https://chatapp-backend-5tbb.onrender.com/message/all`,
        data
      );
      return response.data.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
);

const MessageSlice = createSlice({
  name: "messageSlice",
  initialState: {
    data: [],
    isLoader: false,
    isError: false,
  },

  reducers: {
    updateMessages: (state, action) => {
      state.isLoader = true;
      state.data.push(action.payload);
      state.isLoader = false;
    },
    refreshMessages: (state, action) => {
      state.isLoader = true;
      state.data = [];
      state.isLoader = false;
    },
  },

  extraReducers: (builder) => {
    builder.addCase(getMessagesOfTwoUsers.pending, (state, action) => {
      state.isLoader = true;
    });

    builder.addCase(getMessagesOfTwoUsers.fulfilled, (state, action) => {
      state.isLoader = false;
      state.data = action.payload;
    });

    builder.addCase(getMessagesOfTwoUsers.rejected, (state, action) => {
      state.isLoader = false;
      state.isError = true;
    });
  },
});

export const { updateMessages, refreshMessages } = MessageSlice.actions;

export default MessageSlice.reducer;
