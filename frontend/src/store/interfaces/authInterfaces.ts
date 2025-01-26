export interface AuthState {
  tokens: TokensState | null
  userInfo: UserInfoState | null;
}

export interface UserInfoState {
  id: number
  first_name: string
  permissions: string[]
  email: string
  isSuperuser: boolean
  isStaff: boolean
}

export interface RegisterCredentials {
  username: string;
  email: string;
  password: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AccessToken {
  access: string
}

export interface RefreshToken {
  refresh: string
}

export type TokensState = AccessToken & RefreshToken;

export interface EmailInterface {
  email: string
}

export interface ValidateTokenParameters {
  uid: string
  token: string
}

export type UpdatePasswordInterface = ValidateTokenParameters & {
  password: string;
};
