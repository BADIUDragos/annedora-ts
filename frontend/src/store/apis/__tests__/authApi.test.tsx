import { describe, it, expect } from "vitest";

import {
  useLoginMutation,
  useLogoutMutation,
} from "../authApi";

import {
  AuthState,
  LoginCredentials,
} from "../../interfaces/authInterfaces";
import {
  errorMutation,
  rejectedMutation,
  fulfilledMutation,
  pendingMutation,
  uninitializedMutation,
} from "./mutationObjectStates";
import { act } from "react-dom/test-utils";
import { renderHook, waitFor } from "@testing-library/react";

import { authApiHandler, failedLogOutHandler, failedLoginHandler } from "./authApiHandlers";
import { createAuthState, createTokensState, createUserInfoState, loggedOutState, tokenBody } from "../../slices/__tests__/authSetups";
import { initializeTestServer } from "../../../__testUtils__/testServerSetup";
import setupStore from "../..";
import { getWrapper } from "../../../__testUtils__/testStores";


const server = initializeTestServer(authApiHandler);

describe("Login User", () => {
  it("runs the userLoginMutation successfully", async () => {

    const expectedAuthState: AuthState = createAuthState({
      userInfo: createUserInfoState(),
      tokens: createTokensState({access: tokenBody.access})
    });

    const store = setupStore();
    const wrapper = getWrapper(store);

    const { result } = renderHook(() => useLoginMutation(undefined), {
      wrapper,
    });

    const [login] = result.current;

    expect(result.current[1]).toMatchObject(uninitializedMutation);

    const userArgs: LoginCredentials = {
      username: "success",
      password: "password",
    };

    const authState = store.getState().auth;
    expect(authState).toEqual(loggedOutState);

    act(() => {
      login(userArgs);
    });

    expect(result.current[1]).toMatchObject(pendingMutation("login", userArgs));

    await waitFor(() => expect(result.current[1].isSuccess).toEqual(true));

    expect(result.current[1]).toMatchObject(
      fulfilledMutation("login", userArgs, tokenBody)
    );

    const newUserInfoState = store.getState().auth;
    expect(newUserInfoState).toEqual(expectedAuthState);
  });

  it("fails to login", async () => {

    server.use(failedLoginHandler)

    const store = setupStore();
    const wrapper = getWrapper(store);

    const { result } = renderHook(() => useLoginMutation(undefined), {
      wrapper,
    });

    const [login] = result.current;

    expect(result.current[1]).toMatchObject(uninitializedMutation);

    const userArgs: LoginCredentials = {
      username: "failure",
      password: "bad password",
    };

    const authState = store.getState().auth;
    expect(authState).toEqual(loggedOutState);

    act(() => {
      login(userArgs);
    });

    expect(result.current[1]).toMatchObject(pendingMutation("login", userArgs));

    await waitFor(() => expect(result.current[1].isError).toEqual(true));

    expect(result.current[1]).toMatchObject(
      rejectedMutation("login", userArgs)
    );

    const newUserInfoState = store.getState().auth;
    expect(newUserInfoState).toEqual(loggedOutState);
  });

  it("runs the userLogoutMutation successfully", async () => {

    const preloadedState = {
      auth: createAuthState({
        userInfo: createUserInfoState(),
        tokens: createTokensState({access: tokenBody.access})
    })};

    const store = setupStore(preloadedState);
    const wrapper = getWrapper(store);

    const { result } = renderHook(() => useLogoutMutation(undefined), {
      wrapper,
    });

    const [logout] = result.current;

    expect(result.current[1]).toMatchObject(uninitializedMutation);

    const refreshArg = {
      refresh: preloadedState.auth.tokens?.refresh as string,
    };

    const authState = store.getState().auth;
    expect(authState).toEqual(preloadedState.auth);

    act(() => {
      logout(refreshArg);
    });

    expect(result.current[1]).toMatchObject(
      pendingMutation("logout", refreshArg)
    );

    await waitFor(() => expect(result.current[1].isSuccess).toEqual(true));

    expect(result.current[1]).toMatchObject(
      fulfilledMutation("logout", refreshArg, null)
    );

    const newUserInfoState = store.getState().auth;
    expect(newUserInfoState).toEqual(loggedOutState);
  });

  it("fails userLogoutMutation but still logs out of front end", async () => {

    server.use(failedLogOutHandler)

    const preloadedState = {
      auth: createAuthState({
        userInfo: createUserInfoState(),
        tokens: createTokensState({access: tokenBody.access})
    })};

    const store = setupStore(preloadedState);
    const wrapper = getWrapper(store);

    const { result } = renderHook(() => useLogoutMutation(undefined), {
      wrapper,
    });

    const [logout] = result.current;

    expect(result.current[1]).toMatchObject(uninitializedMutation);

    const refreshArg = {
      refresh: preloadedState.auth.tokens?.refresh as string,
    };

    const authState = store.getState().auth;
    expect(authState).toEqual(preloadedState.auth);

    act(() => {
      logout(refreshArg);
    });

    expect(result.current[1]).toMatchObject(
      pendingMutation("logout", refreshArg)
    );

    await waitFor(() => expect(result.current[1].isError).toEqual(true));

    expect(result.current[1]).toMatchObject(
      rejectedMutation("logout", refreshArg)
    );

    const newUserInfoState = store.getState().auth;
    expect(newUserInfoState).toEqual(loggedOutState);
  });
});
