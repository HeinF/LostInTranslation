import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { createHeaders } from "../api/index";
import { storageRead, storageSave } from "../utils/storage";
import {
  USER_NOT_FOUND,
  ADD_TRANSLATION_FAILED,
  DELETE_HISTORY_FAILED,
} from "../const/index";

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
      error: USER_NOT_FOUND,
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

export const addTranslation = createAsyncThunk(
  "user/addTranslation",
  async (newTranslation, thunkAPI) => {
    const userState = thunkAPI.getState().user;
    const response = await fetch(`${apiUrl}/${userState.id}`, {
      method: "PATCH",
      headers: createHeaders(),
      body: JSON.stringify({
        translations: [...userState.translations, newTranslation],
      }),
    });
    if (!response.ok) {
      return new Promise.reject();
    }
    const user = await response.json();
    return { user };
  }
);

export const deleteHistory = createAsyncThunk(
  "user/deleteHistory",
  async (notUsed, thunkAPI) => {
    const translationState = thunkAPI.getState().user.translations;
    let toKeep = [];
    if (translationState.length > 9) {
      toKeep = translationState.slice(0, translationState.length - 10);
    }
    const response = await fetch(`${apiUrl}/${thunkAPI.getState().user.id}`, {
      method: "PATCH",
      headers: createHeaders(),
      body: JSON.stringify({
        translations: toKeep,
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
    loading: false,
    error: null,
    storedLocal: false,
  },
  reducers: {
    loadLocalUser: (state) => {
      let localUser = storageRead(localKey);
      if (localUser !== null) {
        state.username = localUser.username;
        state.translations = localUser.translations;
        state.id = localUser.id;
        state.storedLocal = true;
      } else {
        state.storedLocal = false;
      }
    },
    checkLocalUser: (state) => {
      if (storageRead(localKey === null)) {
        state.storedLocal = false;
      }
    },
    logOut: (state) => {
      storeUserLocal(null);
      state.username = null;
      state.translations = [];
      state.id = 0;
      state.loading = false;
      state.error = null;
      state.storedLocal = false;
    },
  },
  extraReducers: {
    [fetchUser.pending]: (state, action) => {
      state.loading = true;
    },
    [fetchUser.rejected]: (state, action) => {
      state.error = action.error;
      state.loading = false;
    },
    [fetchUser.fulfilled]: (state, action) => {
      if (action.payload.error === USER_NOT_FOUND) {
        state.username = action.payload.username;
        state.error = action.payload.error;
      } else {
        state.username = action.payload.user.username;
        state.translations = action.payload.user.translations;
        state.id = action.payload.user.id;
        state.loading = false;
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
      state.loading = true;
    },
    [createUser.rejected]: (state, action) => {
      // If creation failed, set username back to initial state
      state.username = null;
      state.error = action.error;
      state.loading = false;
    },
    [createUser.fulfilled]: (state, action) => {
      state.username = action.payload.user.username;
      state.translations = action.payload.user.translations;
      state.id = action.payload.user.id;
      state.error = null;
      state.loading = false;
      storeUserLocal({
        username: state.username,
        translations: state.translations,
        id: state.id,
      });
      state.storedLocal = true;
    },
    [addTranslation.pending]: (state, action) => {
      state.loading = true;
    },
    [addTranslation.rejected]: (state, action) => {
      state.loading = false;
      state.error = ADD_TRANSLATION_FAILED;
    },

    [addTranslation.fulfilled]: (state, action) => {
      state.loading = false;
      state.error = null;
      state.translations = action.payload.user.translations;
      storeUserLocal({
        username: state.username,
        translations: state.translations,
        id: state.id,
      });
    },
    [deleteHistory.pending]: (state, action) => {
      state.loading = true;
    },
    [deleteHistory.rejected]: (state, action) => {
      state.loading = false;
      state.error = DELETE_HISTORY_FAILED;
    },

    [deleteHistory.fulfilled]: (state, action) => {
      state.loading = false;
      state.error = null;
      state.translations = action.payload.user.translations;
      storeUserLocal({
        username: state.username,
        translations: state.translations,
        id: state.id,
      });
    },
  },
});

export const { loadLocalUser, checkLocalUser, logOut } = userSlice.actions;
export default userSlice.reducer;
