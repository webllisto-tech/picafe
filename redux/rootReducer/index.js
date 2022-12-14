import { combineReducers } from "@reduxjs/toolkit";
import authSlice from "../features/AuthSlice";

const rootReducer = combineReducers({
    auth: authSlice
});

export default rootReducer;
