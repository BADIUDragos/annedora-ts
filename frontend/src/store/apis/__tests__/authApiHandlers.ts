import { HttpResponse, delay, http } from "msw";
import { API_URL } from "../../../constants/urls";
import { tokenBody } from "../../slices/__tests__/authSetups";

export const successfullLoginHandler = http.post(
  `${API_URL}/auth/login`,
  async () => {
    return HttpResponse.json(tokenBody);
  }
);

export const successfulLogoutHandler = http.post(
  `${API_URL}/auth/logout`,
  async () => {
    return new HttpResponse(null, {
      status: 200,
    });
  }
);

export const authApiHandler = [
  successfullLoginHandler,
  successfulLogoutHandler,
];

export const failedLoginHandler = http.post(
  `${API_URL}/auth/login`,
  async () => {
    return HttpResponse.json(
      { detail: "No active account found with the given credentials" },
      { status: 401 }
    );
  }
);

export const failedLogOutHandler = http.post(
  `${API_URL}/auth/logout`,
  async () => {
    return HttpResponse.json({ detail: "Some error" }, { status: 401 });
  }
);

export const useLoginMutationFailedLoginHandler = http.post(
  `${API_URL}/auth/login`,
  async () => {
    await delay(100);
    return HttpResponse.json(
      { detail: "No active account found with the given credentials" },
      { status: 401 }
    );
  }
);
