import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import cartReducer from "./slices/cartSlice";
import { baseApi } from "./apis/baseApi";

export const rootReducer = combineReducers({
  [baseApi.reducerPath]: baseApi.reducer,
  auth: authReducer,
  cart: cartReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
