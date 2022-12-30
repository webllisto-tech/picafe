import { combineReducers } from "@reduxjs/toolkit";
import authSlice from "../features/AuthSlice";
import loaderSlice from "../features/LoaderSlice";
import categorySlice from "../features/CategorySlice";

const rootReducer = combineReducers({
  auth: authSlice,
  loader: loaderSlice,
  category: categorySlice,
});

export default rootReducer;
