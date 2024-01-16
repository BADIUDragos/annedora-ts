import {
  AuthState,
  TokensState,
  UserInfoState,
} from "../../interfaces/authInterfaces";

export const loggedOutState = {
  tokens: null,
  userInfo: null,
};

/* {
  "id": 1,
  "username": "user",
  "permissions": [
    "view_content"
  ],
  "email": "user@rolls-royce.com",
  "isSuperuser": false,
  "isStaff": false
} */
export const tokenBody: TokensState = {
  access:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJ1c2VyIiwicGVybWlzc2lvbnMiOlsidmlld19jb250ZW50Il0sImVtYWlsIjoidXNlckByb2xscy1yb3ljZS5jb20iLCJpc1N1cGVydXNlciI6ZmFsc2UsImlzU3RhZmYiOmZhbHNlfQ.w5IlmWh_ED29v5dKTyVxlsMTCl8r0DymmJsjUsYahx4",
  refresh: "mock_refresh_token",
};

/* {
  "id": 1,
  "username": "other_user",
  "permissions": [
    "view_content",
    "delete_content"
  ],
  "email": "other_user@rolls-royce.com",
  "isSuperuser": false,
  "isStaff": false
} */
export const otherTokenBody: TokensState = {
  access:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJvdGhlcl91c2VyIiwicGVybWlzc2lvbnMiOlsidmlld19jb250ZW50IiwiZGVsZXRlX2NvbnRlbnQiXSwiZW1haWwiOiJvdGhlcl91c2VyQHJvbGxzLXJveWNlLmNvbSIsImlzU3VwZXJ1c2VyIjpmYWxzZSwiaXNTdGFmZiI6ZmFsc2V9.nWHNpb4ic5fu3EHTDLoRovQrYkkbw_y_7FIk0eLpKlQ",
  refresh: "mock_refresh_token2",
};

/* {
  "id": 1,
  "username": "user",
  "permissions": [
    "view_content",
    "new_permission"
  ],
  "email": "user@rolls-royce.com",
  "isSuperuser": false,
  "isStaff": false
} */

export const newReauthedToken: TokensState = {
  access:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJ1c2VyIiwicGVybWlzc2lvbnMiOlsidmlld19jb250ZW50IiwibmV3X3Blcm1pc3Npb24iXSwiZW1haWwiOiJ1c2VyQHJvbGxzLXJveWNlLmNvbSIsImlzU3VwZXJ1c2VyIjpmYWxzZSwiaXNTdGFmZiI6ZmFsc2V9.f93HUkTw-mSssaS_09BgBL03pyP8IsDgoZ2GxjQTqcM",
  refresh: "new_mock_refresh_token",
};

export const createUserInfoState = (
  overrides: Partial<UserInfoState> = {}
): UserInfoState => {
  const defaultUserInfo: UserInfoState = {
    id: 1,
    username: "user",
    email: "user@rolls-royce.com",
    permissions: ["view_content"],
    isSuperuser: false,
    isStaff: false,
  };

  return { ...defaultUserInfo, ...overrides };
};

export const createTokensState = (
  overrides: Partial<TokensState> = {}
): TokensState => {
  const defaultTokens: TokensState = {
    access: "mock_access_token",
    refresh: "mock_refresh_token",
  };

  return { ...defaultTokens, ...overrides };
};

export const createAuthState = (
  overrides: Partial<AuthState> = {}
): AuthState => {
  const completeTokensOverrides = overrides.tokens
    ? createTokensState(overrides.tokens)
    : {};

  const completeUserInfoOverrides = overrides.userInfo
    ? createUserInfoState(overrides.userInfo)
    : {};

  return {
    tokens: { ...createTokensState(), ...completeTokensOverrides },
    userInfo: { ...createUserInfoState(), ...completeUserInfoOverrides },
  };
};
