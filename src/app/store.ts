// src/app/store.ts
import { configureStore } from '@reduxjs/toolkit';
import todosReducer from '../features/todosSlice';
import authReducer from '../features/authSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    todos: todosReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

