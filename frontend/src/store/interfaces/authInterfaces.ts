export interface AuthState {
  tokens: TokensState | null
  userInfo: UserInfoState | null;
}

export interface UserInfoState {
  id: number
  username: string
  permissions: string[]
  email: string
  isSuperuser: boolean
  isStaff: boolean
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
