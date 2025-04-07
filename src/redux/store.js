import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from './api/apiSlice';
import authSlice from './reducers/authSlice';

// Create and configure the Redux store
export const store = configureStore({
  // Register all reducers used in the app
  reducer: {
    // Register the API slice reducer (for handling data fetching)
    [apiSlice.reducerPath]: apiSlice.reducer,

    // Register the authentication reducer (for managing auth state)
    auth: authSlice,
  },

  // Add middleware for handling async requests and caching from RTK Query
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware().concat(apiSlice.middleware);
  },
});

// Export the store so it can be used in the app (usually in the <Provider>)
export default store;
