import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  categoryItem: [],
  galleryCategoryItem: [],
};
const categorySlice = createSlice({
  name: "cateory",
  initialState,
  reducers: {
    setCategoryItem: (state, action) => {
      state.categoryItem = action.payload;
    },

    setGalleryCategoryItem: (state, action) => {
      state.galleryCategoryItem = action.payload;
    },
  },
});

export const { setCategoryItem, setGalleryCategoryItem } =
  categorySlice.actions;
export default categorySlice.reducer;
