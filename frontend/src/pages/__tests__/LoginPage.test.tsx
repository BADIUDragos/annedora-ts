import { describe, it, expect } from "vitest";
import { renderWithProviders } from "../../__testUtils__/testStores";
import { screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import userEvent from "@testing-library/user-event";

import {
  createAuthState,
  loggedOutState,
} from "../../store/slices/__tests__/authSetups";

import LoginPage from "../LoginPage";
import { AuthState } from "../../store/interfaces/authInterfaces";
import { createTestRouter } from "../../__testUtils__/createTestRouter";
import { initializeTestServer } from "../../__testUtils__/testServerSetup";
import {  authApiHandler, useLoginMutationFailedLoginHandler } from "../../store/apis/__tests__/authApiHandlers";


const routes = [
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/",
    element: <div>HomePage</div>,
  },
];

const setup = (authState: { auth: AuthState }) => {
  return renderWithProviders(createTestRouter(routes, "/login"), {
    preloadedState: authState,
  });
};

describe("Testing UI components", () => {
  it("renders the username input, password input and submit button", () => {
    setup({ auth: loggedOutState });
    const usernameInput = screen.getByRole('textbox', { name: /username/i });
    expect(usernameInput).toBeInTheDocument();

    const passwordInput = screen.getByPlaceholderText("Enter Password");
    expect(passwordInput).toBeInTheDocument();

    const submitButton = screen.getByRole("button", { name: "Sign In" });
    expect(submitButton).toBeInTheDocument();
  });

  it("is unaccessible if user is logged in, redirects to home", () => {
    setup({ auth: createAuthState() });
    const homePageText = screen.getByText("HomePage");
    expect(homePageText).toBeInTheDocument();

    const usernameInput = screen.queryByPlaceholderText("Enter Username");
    expect(usernameInput).not.toBeInTheDocument();
  });
});


const server = initializeTestServer([useLoginMutationFailedLoginHandler])

describe("Submit functionality", () => {

  it("tests loader and error handling of login submission", async () => {
    setup({ auth: loggedOutState });

    const usernameInput = screen.getByPlaceholderText("Enter Username");
    const passwordInput = screen.getByPlaceholderText("Enter Password"); 
    const submitButton = screen.getByRole("button", { name: "Sign In" });

    await userEvent.type(usernameInput, "username");
    await userEvent.type(passwordInput, "password");
    await userEvent.click(submitButton);

    expect(screen.queryByRole("button", { name: "Sign In" })).not.toBeInTheDocument();

    const spinner = await screen.findByTestId("loader")
    expect(spinner).toBeInTheDocument();
    expect(submitButton).not.toBeInTheDocument()

    const errorMsg = await screen.findByText("No active account found with the given credentials")

    expect(errorMsg).toBeInTheDocument()

  });

  it("logins successfully and goes to homepage", async () => {
    server.use(authApiHandler[0])
    setup({ auth: loggedOutState });

    const usernameInput = screen.getByPlaceholderText("Enter Username");
    const passwordInput = screen.getByPlaceholderText("Enter Password"); 
    const submitButton = screen.getByRole("button", { name: "Sign In" });

    await userEvent.type(usernameInput, "username");
    await userEvent.type(passwordInput, "password");
    await userEvent.click(submitButton);

    await screen.findByText("HomePage")
    expect(usernameInput).not.toBeInTheDocument()
  })
});
