import { describe, expect, it } from "vitest";
import { createTestRouter } from "../__testUtils__/createTestRouter";
import { renderWithProviders } from "../__testUtils__/testStores";
import { AuthState } from "../store/interfaces/authInterfaces";
import { routes } from "./router";
import {
  createAuthState,
  loggedOutState,
} from "../store/slices/__tests__/authSetups";

import { screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import userEvent from "@testing-library/user-event";

const setup = (authState: { auth: AuthState }, initialRoute = "/") => {
  return renderWithProviders(createTestRouter(routes, initialRoute), {
    preloadedState: authState,
  });
};

describe("Header component", () => {
  it("navigates to Login Page when user is logged out and clicks on Header Login button", async () => {
    setup({ auth: loggedOutState });

    const loginButton = screen.getByText("Login");
    await userEvent.click(loginButton);

    const heading = screen.getByText("Sign In", { selector: "h1" });
    expect(heading).toBeInTheDocument();
  });

  it("redirects to homepage on Logout", async () => {
    setup({ auth: createAuthState() });

    const logout = screen.getByRole("button", { name: "Logout" });
    expect(logout).toBeInTheDocument;

    await userEvent.click(logout)

    const homePageText = screen.getByText("homepage", { selector: "div" });
    expect(homePageText).toBeInTheDocument;
  });

});

describe("Login Page", () => {

  it("shows something from login component and header", () => {
    setup({ auth: createAuthState() }, "/login");
    
    const usernameInput = screen.queryByPlaceholderText("Enter Username");
    expect(usernameInput).not.toBeInTheDocument();

    const logoImage = screen.getByRole("img");
    expect(logoImage).toHaveAttribute("src", "/images/logo.png");
  })


  it("renders home page if user is logged out and tries to go to '/login' ", () => {
    setup({ auth: createAuthState() }, "/login");

    const homePageText = screen.getByText("homepage", { selector: "div" });
    expect(homePageText).toBeInTheDocument;
  })
})

describe("Not Found Page", () => {
  it("displays something from home page and header", () => {
    setup({ auth: createAuthState() }, "/notFoundPage");

    const notFoundText = screen.getByText("This page doesn't exist.");
    expect(notFoundText).toBeInTheDocument();

    const spanElement = screen.getByText('Boilerplate APP');
    expect(spanElement).toBeInTheDocument();
  })
})

describe("Home Page", () => {
  it("displays something from home page and header", () => {
    setup({ auth: createAuthState() }, "/");

    const homePageText = screen.getByText("homepage");
    expect(homePageText).toBeInTheDocument()

    const logoImage = screen.getByRole("img");
    expect(logoImage).toHaveAttribute("src", "/images/logo.png");
  })
})


