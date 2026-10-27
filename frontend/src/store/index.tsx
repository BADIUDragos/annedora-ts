import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { rootReducer, RootState } from "./combinedReducer";
import { useLogoutMutation, useLoginMutation } from "./apis/authApi";

import { useAuth } from "./hooks/authSliceHooks";
import { logOut, setCredentials } from "./slices/authSlice";
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

export type { RootState };

export { logOut, setCredentials };

export { useLoginMutation, useLogoutMutation };

export { useAuth };

export default setupStore;
