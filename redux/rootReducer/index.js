import { combineReducers } from "@reduxjs/toolkit";
import homeSlice from "../features/homeSlice";

const rootReducer = combineReducers({
    home: homeSlice
});

export default rootReducer;
