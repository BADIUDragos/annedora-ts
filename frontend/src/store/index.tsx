import {
  configureStore,
  ThunkDispatch,
  UnknownAction,
} from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { rootReducer, RootState } from "./combinedReducer";
import { useLogoutMutation, useLoginMutation } from "./apis/authApi";

import { useAuth } from "./hooks/authSliceHooks";
import { logOut, setCredentials, AuthSlice } from "./slices/authSlice";
import { baseApi } from "./apis/baseApi";

const setupStore = () => {
  return configureStore({
    reducer: rootReducer,

    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(baseApi.middleware),
    devTools: true,
  });
};

setupListeners(setupStore().dispatch);

export type AppDispatch = ThunkDispatch<RootState, unknown, UnknownAction>;
export type { RootState };
export type AppStore = ReturnType<typeof setupStore>;

//slice actions
export { logOut, setCredentials };

//slice types
export type { AuthSlice };

//api mutations
export { useLoginMutation, useLogoutMutation };

//selectors
export { useAuth };

export default setupStore;
