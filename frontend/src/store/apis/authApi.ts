import {
  RefreshToken,
  LoginCredentials,
  TokensState,
  RegisterCredentials,
} from "../interfaces/authInterfaces";
import { logOut, setCredentials } from "../.";
import { baseApi } from "./baseApi";

const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation<TokensState, LoginCredentials>({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setCredentials({ tokens: data }));
        } catch (error: unknown) {
          /* empty */
        }
      },
    }),
    logout: build.mutation<void, RefreshToken>({
      query: (refresh) => ({
        url: "/auth/logout",
        method: "POST",
        body: refresh,
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(logOut());
          dispatch(baseApi.util.resetApiState())
        } catch (error) {
          dispatch(logOut());
          dispatch(baseApi.util.resetApiState())
        }
      },
    }),
    register: build.mutation<TokensState, RegisterCredentials>({
      query: (credentials) => ({
        url: "/auth/register",
        method: "POST",
        body: credentials,
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setCredentials({ tokens: data }));
        } catch (error: unknown) {
          /* empty */
        }
      },
    }),
  }),
});

export const { useLoginMutation, useLogoutMutation, useRegisterMutation } = authApi;
export { authApi };
