import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";

const initialState = {
  cartItem: [],
  loading: false,
  error: null
};

// Base URL
const baseURL = process.env.REACT_APP_SERVER_DOMIN || "http://localhost:8081";

// Async thunk for adding item to cart - requires login
export const addCartItem = createAsyncThunk(
  "cart/addCartItem",
  async (product, { getState, rejectWithValue }) => {
    try {
      // Check if user is logged in
      const userData = getState().user;
      
      if (!userData._id) {
        toast.error("Please login to add items to cart");
        return rejectWithValue("Login required");
      }
      
      // User is logged in, add to cart in server
      const userId = userData._id;
      
      // Check if item already exists in cart
      const currentCart = getState().cart.cartItem;
      const check = currentCart.some((el) => el._id === product._id || el.productId === product._id);
      
      if (check) {
        // Show a more descriptive toast message when item is already in cart
        toast.error("Item is already added to cart");
        return currentCart;
      }
      
      // Add item to server-side cart
      try {
        const response = await fetch(`${baseURL}/cart/add`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            userId,
            productId: product._id,
            model: product.model,
            brand: product.brand,
            image: product.image,
            price: product.price,
            qty: 1
          })
        });
        
        if (!response.ok) {
          throw new Error("Failed to add item to cart");
        }
        
        const responseData = await response.json();
        
        toast.success("Added to cart");
        
        // Get the updated cart from server
        const cartResponse = await fetch(`${baseURL}/cart/${userId}`);
        const cartData = await cartResponse.json();
        
        return cartData.items || [];
      } catch (error) {
        console.error("Server error:", error);
        // If server fails, still add to local state for better UX
        const total = product.price;
        const newCart = [
          ...currentCart,
          { ...product, qty: 1, total: total }
        ];
        
        toast.success("Added to cart");
        return newCart;
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Fetch cart items
export const fetchCartItems = createAsyncThunk(
  "cart/fetchItems",
  async (_, { getState, rejectWithValue }) => {
    try {
      // Check if user is logged in
      const userData = getState().user;
      
      if (!userData._id) {
        return []; // Empty cart for logged out users
      }
      
      // User is logged in, fetch from server
      const userId = userData._id;
      
      const response = await fetch(`${baseURL}/cart/${userId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch cart items");
      }
      
      const data = await response.json();
      return data.items || [];
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Clear cart
export const clearCart = createAsyncThunk(
  "cart/clearCart",
  async (_, { getState, rejectWithValue }) => {
    try {
      // Check if user is logged in
      const userData = getState().user;
      
      if (!userData._id) {
        toast.error("Please login to modify cart");
        return rejectWithValue("Login required");
      }
      
      const userId = userData._id;
      
      // Clear cart from server
      try {
        const response = await fetch(`${baseURL}/cart/clear/${userId}`, {
          method: "DELETE"
        });
        
        if (!response.ok) {
          throw new Error("Failed to clear cart");
        }
        
        toast.success("Cart cleared successfully");
        return [];
      } catch (error) {
        console.error("Server error:", error);
        return rejectWithValue(error.message);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Delete cart item
export const deleteCartItem = createAsyncThunk(
  "cart/deleteCartItem",
  async (itemId, { getState, rejectWithValue }) => {
    try {
      // Check if user is logged in
      const userData = getState().user;
      
      if (!userData._id) {
        toast.error("Please login to modify cart");
        return rejectWithValue("Login required");
      }
      
      const userId = userData._id;
      
      // Remove from server
      try {
        const response = await fetch(`${baseURL}/cart/remove/${userId}/${itemId}`, {
          method: "DELETE"
        });
        
        if (!response.ok) {
          throw new Error("Failed to remove item from cart");
        }
        
        const data = await response.json();
        
        toast.success("Item removed");
        return data.items || [];
      } catch (error) {
        console.error("Server error:", error);
        // If server fails, still remove from local state
        const currentCart = getState().cart.cartItem;
        const updatedCart = currentCart.filter(el => el._id !== itemId);
        
        toast.success("Item removed");
        return updatedCart;
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Increase quantity
export const increaseQty = createAsyncThunk(
  "cart/increaseQty",
  async (itemId, { getState, rejectWithValue }) => {
    try {
      // Check if user is logged in
      const userData = getState().user;
      
      if (!userData._id) {
        toast.error("Please login to modify cart");
        return rejectWithValue("Login required");
      }
      
      const userId = userData._id;
      const currentCart = getState().cart.cartItem;
      const itemIndex = currentCart.findIndex(el => el._id === itemId);
      
      if (itemIndex === -1) {
        return currentCart;
      }
      
      const newQty = currentCart[itemIndex].qty + 1;
      
      // Update on server
      try {
        const response = await fetch(`${baseURL}/cart/update`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            userId,
            itemId,
            qty: newQty
          })
        });
        
        if (!response.ok) {
          throw new Error("Failed to update cart");
        }
        
        const data = await response.json();
        return data.items || [];
      } catch (error) {
        console.error("Server error:", error);
        // If server fails, still update local state
        const updatedCart = [...currentCart];
        updatedCart[itemIndex] = {
          ...updatedCart[itemIndex],
          qty: newQty,
          total: newQty * updatedCart[itemIndex].price
        };
        
        return updatedCart;
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Decrease quantity
export const decreaseQty = createAsyncThunk(
  "cart/decreaseQty",
  async (itemId, { getState, rejectWithValue }) => {
    try {
      // Check if user is logged in
      const userData = getState().user;
      
      if (!userData._id) {
        toast.error("Please login to modify cart");
        return rejectWithValue("Login required");
      }
      
      const userId = userData._id;
      const currentCart = getState().cart.cartItem;
      const itemIndex = currentCart.findIndex(el => el._id === itemId);
      
      if (itemIndex === -1 || currentCart[itemIndex].qty <= 1) {
        return currentCart;
      }
      
      const newQty = currentCart[itemIndex].qty - 1;
      
      // Update on server
      try {
        const response = await fetch(`${baseURL}/cart/update`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            userId,
            itemId,
            qty: newQty
          })
        });
        
        if (!response.ok) {
          throw new Error("Failed to update cart");
        }
        
        const data = await response.json();
        return data.items || [];
      } catch (error) {
        console.error("Server error:", error);
        // If server fails, still update local state
        const updatedCart = [...currentCart];
        updatedCart[itemIndex] = {
          ...updatedCart[itemIndex],
          qty: newQty,
          total: newQty * updatedCart[itemIndex].price
        };
        
        return updatedCart;
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Cart slice
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // Local action to clear cart (no longer used, kept for compatibility)
    resetCart: (state) => {
      state.cartItem = [];
    }
  },
  extraReducers: (builder) => {
    builder
      // Handle addCartItem
      .addCase(addCartItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addCartItem.fulfilled, (state, action) => {
        state.loading = false;
        state.cartItem = action.payload;
      })
      .addCase(addCartItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Handle fetchCartItems
      .addCase(fetchCartItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCartItems.fulfilled, (state, action) => {
        state.loading = false;
        state.cartItem = action.payload;
      })
      .addCase(fetchCartItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Handle clearCart
      .addCase(clearCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(clearCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cartItem = []; // Explicitly set to empty array
      })
      .addCase(clearCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Handle deleteCartItem
      .addCase(deleteCartItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCartItem.fulfilled, (state, action) => {
        state.loading = false;
        state.cartItem = action.payload;
      })
      .addCase(deleteCartItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Handle increaseQty
      .addCase(increaseQty.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(increaseQty.fulfilled, (state, action) => {
        state.loading = false;
        state.cartItem = action.payload;
      })
      .addCase(increaseQty.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Handle decreaseQty
      .addCase(decreaseQty.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(decreaseQty.fulfilled, (state, action) => {
        state.loading = false;
        state.cartItem = action.payload;
      })
      .addCase(decreaseQty.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

// Export the renamed resetCart for compatibility, but use the clearCart thunk for new code
export const { resetCart } = cartSlice.actions;
export default cartSlice.reducer;