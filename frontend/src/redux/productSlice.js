import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast"; // Assuming you use react-hot-toast for notifications

// Keeping your existing functionality
export const fetchProducts = createAsyncThunk(
  "product/fetchProducts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch("http://localhost:8081/product");
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  productList: [],
  loading: false,
  error: null,
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    // We're moving cart functionality to cartSlice.js, but keeping this
    // as a temporary compatibility layer if needed
    addCartItem: (state, action) => {
      // This is just a compatibility wrapper
      toast.success("Added to cart");
      // We don't actually modify state here since cart state is now in cartSlice
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.productList = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { addCartItem } = productSlice.actions;
export default productSlice.reducer;