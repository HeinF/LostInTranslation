import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { createHeaders } from "../api/index";
import { storageRead, storageSave } from "../utils/storage";

const apiUrl = process.env.REACT_APP_API_URL;
const localKey = process.env.REACT_APP_LOCAL_STORAGE_KEY;

const storeUserLocal = (userInfo) => {
  storageSave(localKey, userInfo);
};

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
    // Return username so that it can be used to create a new user
    // Return "User not found" as an error so that the component knows to call "createUser"
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
    storedLocal: false,
  },
  reducers: {
    loadLocalUser: (state, action) => {
      let localUser = storageRead(localKey);
      if (localUser !== null) {
        state.username = localUser.username;
        state.translations = localUser.translations;
        state.id = localUser.id;
        state.storedLocal = true;
      }
    },
  },
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
        storeUserLocal({
          username: state.username,
          translations: state.translations,
          id: state.id,
        });
        state.storedLocal = true;
      }
    },
    [createUser.pending]: (state, action) => {
      state.loadingUser = true;
    },
    [createUser.rejected]: (state, action) => {
      // If creation failed, set username back to initial state
      state.username = null;
      state.error = action.error;
      state.loadingUser = false;
    },
    [createUser.fulfilled]: (state, action) => {
      state.username = action.payload.user.username;
      state.translations = action.payload.user.translations;
      state.id = action.payload.user.id;
      state.error = null;
      state.loadingUser = false;
      storeUserLocal({
        username: state.username,
        translations: state.translations,
        id: state.id,
      });
      state.storedLocal = true;
    },
  },
});

export const { loadLocalUser } = userSlice.actions;
export default userSlice.reducer;
