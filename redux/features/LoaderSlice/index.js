import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  isLoad: false,
};
const loaderSlice = createSlice({
  name: "loader",
  initialState,
  reducers: {
    setIsLoad: (state, action) => {
      state.isLoad = action.payload;
    },
  },
});

export const { setIsLoad } = loaderSlice.actions;
export default loaderSlice.reducer;
