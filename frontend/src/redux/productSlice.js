import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

export const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    setData: (state, action) => {
      console.log(action);
    },
  },
});

export const {
  setDataProduct,
  addCartItem,
  deleteCartItem,
  increaseQty,
  decreaseQty,
} = productSlice.actions;

export default productSlice.reducer;
