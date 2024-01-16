export type TokenError = {
  code: string;
  messages: { token_type: string }[];
};

export const isTokenError = (errorData: unknown): errorData is TokenError => {
  const TokenError = errorData as TokenError;
  if (TokenError.code && TokenError.messages && Array.isArray(TokenError.messages)) {
    return true
  }
  return false
}

const isAccessTokenInvalidError = (errorData: unknown): TokenError | boolean => {
  if (isTokenError(errorData)) {

    return (
      errorData.code === "token_not_valid" &&
      errorData.messages.some((msg) => msg.token_type === "access")
    );

  }
  return false
};

export default isAccessTokenInvalidError;
