import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../reducers/userSlice";

//Setup redux store
export default configureStore({
  reducer: {
    user: userReducer,
  },
});
