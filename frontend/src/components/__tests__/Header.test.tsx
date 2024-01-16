import { describe, it, expect } from "vitest";
import { renderWithProviders } from "../../__testUtils__/testStores";
import { screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import userEvent from "@testing-library/user-event";

import {
  createAuthState,
  loggedOutState,
} from "../../store/slices/__tests__/authSetups";

import Header from "../Header";
import { AuthState } from "../../store/interfaces/authInterfaces";
import { createTestRouter } from "../../__testUtils__/createTestRouter";

const routes = [
  {
    element: (
      <>
        <Header />
      </>
    ),
    children: [
      { path: "/", element: <div>Home Page</div> },
      { path: "/somepage", element: <div>Any Page</div> },
    ]
  }
];

describe("Header rendering tests", () => {
  const setup = (authState: { auth: AuthState }, route = "/somepage") => {
    return renderWithProviders(
      createTestRouter(routes, route),
      { preloadedState: authState }
    );
  };

  it("link element containing image has href to home page, displays link to Login page if logged out", async () => {
    setup({ auth: loggedOutState });

    const logoImage = screen.getByRole("img");
    expect(logoImage).toHaveAttribute("src", "/images/logo.png");

    const linkElement = logoImage.parentElement;
    expect(linkElement).toHaveAttribute('href', '/');

    const linkElementLogin = screen.getByRole('link', { name: /login/i });
    expect(linkElementLogin).toHaveAttribute('href', '/login');

  });

  it("displays the user's name and Logout if the user is signed in", async () => {
    const authState = createAuthState();

    setup({ auth: authState });

    const usernameText = screen.getByText(`Hi ${authState.userInfo?.username} !`);

    expect(usernameText).toBeInTheDocument;
    const logout = screen.getByRole("button", { name: "Logout" });
    expect(logout).toBeInTheDocument;

    await userEvent.click(logout);

    expect(usernameText).not.toBeInTheDocument;
    expect(logout).not.toBeInTheDocument;

    const logoutButton = screen.getByText('Login');
    expect(logoutButton).toBeInTheDocument();

    const appText = screen.getByText("Boilerplate APP")
    expect(appText).toBeInTheDocument;
  });
});
