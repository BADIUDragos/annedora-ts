import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";
import { setCredentials, logOut } from "../store/slices/authSlice";
import { RootState } from "../store";
import { TokensState } from "../store/interfaces/authInterfaces";
import { API_URL } from "../constants/urls";
import { Mutex } from "async-mutex";
import isAccessTokenInvalidError from "./typeGuards/isTokenInvalidError";

const mutex = new Mutex();

export const baseQuery = fetchBaseQuery({
  baseUrl: API_URL,
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.tokens?.access;
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  if (result.error && result.error.status === 401) {
    if (isAccessTokenInvalidError(result.error.data)) {
      const refresh = (api.getState() as RootState).auth.tokens?.refresh;
      if (!mutex.isLocked()) {
        const release = await mutex.acquire();
        try {
          const refreshResult = await baseQuery(
            {
              url: "/auth/login/refresh",
              method: "POST",
              body: {
                refresh: refresh,
              },
            },
            api,
            extraOptions
          );

          if (refreshResult.data) {
            api.dispatch(
              setCredentials({
                tokens: refreshResult.data as TokensState,
              })
            );
            result = await baseQuery(args, api, extraOptions);
          } else {
            api.dispatch(logOut());
          }
        } finally {
          release();
        }
      } else {
        await mutex.waitForUnlock();
        result = await baseQuery(args, api, extraOptions);
      }
    }
  }

  return result;
};
