import { describe, it, expect } from "vitest";

import { useLoginMutation } from "../../store/apis/authApi";
import { act } from "react-dom/test-utils";
import { renderHook, waitFor } from "@testing-library/react";
import { AuthState, LoginCredentials } from "../../store/interfaces/authInterfaces";
import { createAuthState, createTokensState, createUserInfoState, newReauthedToken, tokenBody } from "../../store/slices/__tests__/authSetups";
import { initializeTestServer } from "../../__testUtils__/testServerSetup";
import { baseQueriesHandlers, failedRefreshTokenHandler } from "./baseQueriesHandlers";
import setupStore from "../../store";
import { getWrapper } from "../../__testUtils__/testStores";

const server = initializeTestServer(baseQueriesHandlers)

describe("baseQueryWithReauth", () => {
  it("updates tokens on isInvalidTokenError", async () => {
    const initialAuthState: AuthState = createAuthState({
      userInfo: createUserInfoState(),
      tokens: createTokensState({access: tokenBody.access})
    });

    const store = setupStore({auth: initialAuthState});
    const wrapper = getWrapper(store);

    const { result } = renderHook(() => useLoginMutation(undefined), {
      wrapper,
    });
    
    const [login] = result.current;

    const userArgs: LoginCredentials = {
      username: "refreshing tokens",
      password: "password",
    };

    const authState = store.getState().auth;
    expect(authState).toEqual(initialAuthState);

    act(() => {
      login(userArgs);
    });

    await waitFor(() => expect(result.current[1].isError).toEqual(true));

    const newAuthState = store.getState().auth

    expect(newAuthState.tokens).toEqual(newReauthedToken)

  });

  it("logs out on token Reauth failure", async () => {
    server.use(failedRefreshTokenHandler)

    const initialAuthState: AuthState = createAuthState({
      userInfo: createUserInfoState(),
      tokens: createTokensState({access: tokenBody.access})
    });

    const store = setupStore({auth: initialAuthState});
    const wrapper = getWrapper(store);

    const { result } = renderHook(() => useLoginMutation(undefined), {
      wrapper,
    });
    
    const [login] = result.current;

    const userArgs: LoginCredentials = {
      username: "refreshing tokens",
      password: "password",
    };

    const authState = store.getState().auth;
    expect(authState).toEqual(initialAuthState);

    act(() => {
      login(userArgs);
    });

    await waitFor(() => expect(result.current[1].isError).toEqual(true));

    const newAuthState = store.getState().auth

    expect(newAuthState.userInfo).toEqual(null)
    expect(newAuthState.tokens).toEqual(null)
  });
});
