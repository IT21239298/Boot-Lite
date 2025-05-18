import { createSlice } from "@reduxjs/toolkit";

// Function to load saved user data from localStorage
const loadUserFromStorage = () => {
  try {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      return JSON.parse(savedUser);
    }
    return {
      email: "",
      firstName: "",
      image: "",
      lastName: "",
      _id: "",
    };
  } catch (error) {
    console.error("Error loading user data from localStorage:", error);
    return {
      email: "",
      firstName: "",
      image: "",
      lastName: "",
      _id: "",
    };
  }
};

// Get initial state from localStorage if available
const initialState = loadUserFromStorage();

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginRedux: (state, action) => {
      console.log(action.payload.data);

      // Update state
      state._id = action.payload.data._id;
      state.firstName = action.payload.data.firstName;
      state.lastName = action.payload.data.lastName;
      state.email = action.payload.data.email;
      state.image = action.payload.data.image;

      // Save to localStorage
      localStorage.setItem('user', JSON.stringify({
        _id: action.payload.data._id,
        firstName: action.payload.data.firstName,
        lastName: action.payload.data.lastName,
        email: action.payload.data.email,
        image: action.payload.data.image,
      }));
    },
    logoutRedux: (state, action) => {
      // Clear state
      state._id = "";
      state.firstName = "";
      state.lastName = "";
      state.email = "";
      state.image = "";

      // Remove from localStorage
      localStorage.removeItem('user');
    },
  },
});

export const { loginRedux, logoutRedux } = userSlice.actions;

export default userSlice.reducer;