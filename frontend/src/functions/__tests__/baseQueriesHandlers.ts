import { HttpResponse, http } from "msw";
import { API_URL } from "../../constants/urls";
import { newReauthedToken } from "../../store/slices/__tests__/authSetups";
import { TokenError } from "../typeGuards/isTokenInvalidError";

export const invalidAccessTokenErrorData: TokenError = {
  code: "token_not_valid",
  messages: [
    {
      token_type: "access",
    },
  ],
};

export const baseQueriesHandlers = [
  http.post(`${API_URL}/auth/login`, async () => {
    return new HttpResponse(JSON.stringify(invalidAccessTokenErrorData), {
      status: 401,
    });
  }),
  http.post(`${API_URL}/auth/login/refresh`, async () => {
    return HttpResponse.json(newReauthedToken);
  }),
];

export const failedRefreshTokenHandler = http.post(
  `${API_URL}/auth/login/refresh`,
  async () => {
    return new HttpResponse(null, {
      status: 401,
    });
  }
);
