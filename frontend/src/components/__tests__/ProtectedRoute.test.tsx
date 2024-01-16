import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import ProtectedRoute from "../ProtectedRoute";
import { renderWithProviders } from "../../__testUtils__/testStores";

import "@testing-library/jest-dom/vitest";
import {
  createAuthState,
  createUserInfoState,
} from "../../store/slices/__tests__/authSetups";
import { createTestRouter } from "../../__testUtils__/createTestRouter";
import { IProtectedComponentSetupOptions } from "./ProtectedComponent.test";

describe("ProtectedRoute", () => {
  const setup = (
    options: IProtectedComponentSetupOptions,
    redirectUrl: string = "/login"
  ) => {
    const {
      preloadedState,
      requiredPermissions = [],
      requiredStaff = false,
    } = options;

    const routes = [
      {
        path: "/protected",
        element: (
          <ProtectedRoute
            redirectUrl={redirectUrl}
            requiredPermissions={requiredPermissions}
            requiredStaff={requiredStaff}
          >
            <div>Protected Content</div>
          </ProtectedRoute>
        ),
      },
      {
        path: "/login",
        element: <div>Login Page</div>,
      },
    ];

    renderWithProviders(createTestRouter(routes, "/protected"), {
      preloadedState: preloadedState,
    });
  };

  it("renders children for authorized users", () => {
    const state = createAuthState();

    setup({
      preloadedState: { auth: state },
      requiredPermissions: ["view_content"],
    });

    expect(screen.getByText("Protected Content")).toBeInTheDocument();
  });

  it("does not render children for unauthorized users", () => {

    setup({
      preloadedState: { auth: createAuthState({
        userInfo: createUserInfoState({ permissions: ["other_permissions"] }),
      }) },
      requiredPermissions: ["view_content"],
    });

    expect(screen.queryByText("Protected Content")).not.toBeInTheDocument();
  });

  it("typescript error if at least one protection requirement isn't provided", () => {
    // @ts-expect-error
    <ProtectedRoute>
      <div>Protected Content</div>
    </ProtectedRoute>;
  });
});
