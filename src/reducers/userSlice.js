import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { createHeaders } from "../api/index";
import { storageRead, storageSave } from "../utils/storage";
import {
  USER_NOT_FOUND,
  ADD_TRANSLATION_FAILED,
  DELETE_HISTORY_FAILED,
} from "../const/index";

// Get environment constants
const apiUrl = process.env.REACT_APP_API_URL;
const localKey = process.env.REACT_APP_LOCAL_STORAGE_KEY;

// Stores user details in local storage
const storeUserLocal = (userInfo) => {
  storageSave(localKey, userInfo);
};
// Checks API for user by the input username. If not found returns a user object with the input username
// and an error to flag that the user was nou found in the API and should be created
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

//  Creates a new user with the given username and an empty array of translations
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
// Adds a new translation to the API
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

// Deletes up to 10 of the newest translations
export const deleteHistory = createAsyncThunk(
  "user/deleteHistory",
  async (notUsed, thunkAPI) => {
    const translationState = thunkAPI.getState().user.translations;
    let toKeep = [];
    // If there are more than 10 translations, we only want to delete the 10 most recent
    if (translationState.length > 10) {
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

// Defining out state and initial state
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
    // If a local user is found, load it into state and set the storedLocal flag to true
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
    // Checks if user is stored locally. Used by components to guard routes
    checkLocalUser: (state) => {
      if (storageRead(localKey === null)) {
        state.storedLocal = false;
      }
    },
    // Clear local storage and set state back to initial state
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
      //If user is not found, retain the input username in state and set flag user not found
      if (action.payload.error === USER_NOT_FOUND) {
        state.username = action.payload.username;
        state.error = action.payload.error;
        // If user is found in API, set state to returned user, store locally and set local flags
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
    //If successful set state to returned user, store locally and set flags
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
    // If addTranslation is successful, add new translation to state and local storage
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
    // If deleteHistory is successful, update state of translation in redux and local storage
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
