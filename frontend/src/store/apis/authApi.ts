import {
  RefreshToken,
  LoginCredentials,
  TokensState,
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
          dispatch(setCredentials({tokens: data}));
        } catch (error: unknown) { /* empty */ }
      },
    }),
    logout: build.mutation<null, RefreshToken>({
      query: (refresh) => ({
        url: "/auth/logout",
        method: "POST",
        body: refresh,
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(logOut());
        } catch (error) {
          dispatch(logOut());
        }
      },
    }),
  }),
});

export const { useLoginMutation,  useLogoutMutation } = authApi;
export { authApi };
