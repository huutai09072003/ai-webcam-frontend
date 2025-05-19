import { configureStore } from '@reduxjs/toolkit';

import authReducer from './authSlice';

// Load user từ localStorage nếu có
const storedUser = localStorage.getItem("user");
const preloadedState = {
  auth: {
    user: storedUser ? JSON.parse(storedUser) : null,
  },
};

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
  preloadedState,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
