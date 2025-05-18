import { configureStore } from "@reduxjs/toolkit";
import userSliceReducer from "./userSlice";
import productSlideReducer from "./productSlice";
import cartReducer from "./cartSlice"

export const store = configureStore({
  reducer: {
    user: userSliceReducer,
    product: productSlideReducer,
    cart: cartReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    })
});