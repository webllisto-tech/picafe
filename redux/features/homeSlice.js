import { createSlice } from "@reduxjs/toolkit";

const initialState = {};

const homeSlice = createSlice({
  name: "home",
  initialState,
  reducers: {
    hello: () => {
      console.log('hello');
    },
  },
});

export const { hello } = homeSlice.actions;
export default homeSlice.reducer;
