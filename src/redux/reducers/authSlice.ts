import { createSlice } from '@reduxjs/toolkit';

// Define the initial state for authentication
// It tries to load the token from localStorage if it exists
const initialState = {
  userToken: (() => {
    const storedToken = localStorage.getItem('token'); // Get token from localStorage
    return storedToken ? JSON.parse(storedToken) : null; // If it exists, parse it; otherwise return null
  })(),
};

// Create a Redux slice for authentication
// A slice contains state, reducers, and action creators
export const authSlice = createSlice({
  name: 'auth', // Name of this slice
  initialState, // The state we defined above

  reducers: {
    // Set user credentials and save the token
    setCredentials: (state, action) => {
      state.userToken = action.payload; // Update token in state
      localStorage.setItem('token', JSON.stringify(action.payload)); // Save token in localStorage
    },

    // Log out the user by clearing the token
    logout: (state) => {
      state.userToken = null; // Clear token from state
      localStorage.removeItem('token'); // Remove token from localStorage
    },
  },
});

// Export the reducer to be added to the store
export default authSlice.reducer;

// Export the actions so we can use them in components
export const { setCredentials, logout } = authSlice.actions;
