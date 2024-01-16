import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import { baseApi } from './apis/baseApi';

export const rootReducer = combineReducers({
  [baseApi.reducerPath]: baseApi.reducer,
  auth: authReducer,
});

export type RootState = ReturnType<typeof rootReducer>;