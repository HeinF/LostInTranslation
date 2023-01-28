import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { createHeaders } from "../api/index";

const apiUrl = process.env.REACT_APP_API_URL;

export const fetchUser = createAsyncThunk(
  "user/fetchUser",
  async (username) => {
    const response = await fetch(`${apiUrl}?username=${username}`);

    const userArray = await response.json();
    if (!response.ok) {
      return new Promise.reject();
    }
    if (userArray.length > 0) {
      const user = userArray.pop();
      return { user };
    }
    const user = {
      username: username,
      error: "User not found",
    };
    return user;
  }
);

export const createUser = createAsyncThunk(
  "user/createUser",
  async (username) => {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: createHeaders(),
      body: JSON.stringify({
        username,
        translations: [],
      }),
    });
    if (!response.ok) {
      return new Promise.reject();
    }
    const user = await response.json();
    return { user };
  }
);

export const userSlice = createSlice({
  name: "user",
  initialState: {
    username: null,
    translations: [],
    id: 0,
    loadingUser: false,
    error: null,
  },
  reducers: {},
  extraReducers: {
    [fetchUser.pending]: (state, action) => {
      state.loadingUser = true;
    },
    [fetchUser.rejected]: (state, action) => {
      state.error = action.error;
      state.loadingUser = false;
    },
    [fetchUser.fulfilled]: (state, action) => {
      if (action.payload.error === "User not found") {
        state.username = action.payload.username;
        state.error = action.payload.error;
      } else {
        state.username = action.payload.user.username;
        state.translations = action.payload.user.translations;
        state.id = action.payload.user.id;
        state.loadingUser = false;
        state.error = null;
      }
    },
    [createUser.pending]: (state, action) => {
      state.loadingUser = true;
    },
    [createUser.rejected]: (state, action) => {
      state.error = action.error;
      state.loadingUser = false;
    },
    [createUser.fulfilled]: (state, action) => {
      state.username = action.payload.user.username;
      state.translations = action.payload.user.translations;
      state.id = action.payload.user.id;
      state.error = null;
      state.loadingUser = false;
    },
  },
});

export const {} = userSlice.actions;
export default userSlice.reducer;
