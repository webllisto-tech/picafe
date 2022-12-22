import { combineReducers } from "@reduxjs/toolkit";
import authSlice from "../features/AuthSlice";
import loaderSlice from "../features/LoaderSlice";

const rootReducer = combineReducers({
  auth: authSlice,
  loader: loaderSlice,
});

export default rootReducer;
