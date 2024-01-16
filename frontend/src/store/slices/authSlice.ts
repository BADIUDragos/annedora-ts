import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  AuthState,
  TokensState,
} from "../interfaces/authInterfaces";
import { decodeToken } from "../../functions/decodeToken";

export const getTokensFromLocalStorage = (): TokensState | null => {
  try {
    const tokensString = localStorage.getItem("tokens");
    if (!tokensString) {
      return null;
    }
    return JSON.parse(tokensString) as TokensState;
  } catch (error: any) {
    return null;
  }
};

export const getInitialAuthState = (): AuthState => {
  const parsedTokens = getTokensFromLocalStorage();
  if (!parsedTokens) {
    return { tokens: null, userInfo: null };
  }

  const userInfo = decodeToken(parsedTokens.access);
  if (!userInfo) {
    return { tokens: null, userInfo: null };
  }

  return { tokens: parsedTokens, userInfo: userInfo };
};

const initialState: AuthState = getInitialAuthState();

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials(
      state,
      action: PayloadAction<{
        tokens: TokensState;
      }>
    ) {
      state.tokens = action.payload.tokens;
      state.userInfo = decodeToken(state.tokens.access);

      localStorage.setItem(
        "tokens",
        JSON.stringify({
          access: state.tokens.access,
          refresh: state.tokens.refresh,
        })
      );
    },
    logOut(state) {
      state.tokens = null;
      state.userInfo = null;
      localStorage.removeItem("tokens");
    },
  },
});

export const { setCredentials, logOut } = authSlice.actions;

export default authSlice.reducer;
export type AuthSlice = ReturnType<typeof authSlice.reducer>;
