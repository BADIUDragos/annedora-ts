import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { AuthState } from "../../store/interfaces/authInterfaces";
import ProtectedComponent from "../ProtectedComponent";
import { renderWithProviders } from "../../__testUtils__/testStores";

import "@testing-library/jest-dom/vitest";
import {
  createAuthState,
  createUserInfoState,
} from "../../store/slices/__tests__/authSetups";
import { IAuthorizationRequirements } from "../utils/isAuthorized";

export interface IProtectedComponentSetupOptions
  extends IAuthorizationRequirements {
  preloadedState: { auth: AuthState };
}

describe("ProtectedComponent", () => {
  const setup = (options: IProtectedComponentSetupOptions) => {
    const {
      preloadedState,
      requiredPermissions = [],
      requiredStaff = false,
    } = options;

    renderWithProviders(
      <>
        test
        <ProtectedComponent
          requiredPermissions={requiredPermissions}
          requiredStaff={requiredStaff}
        >
          <div>Protected Content</div>
        </ProtectedComponent>
      </>,
      { preloadedState: preloadedState }
    );
  };

  it("renders children for authorized users", () => {
    const state = createAuthState();

    setup({
      preloadedState: { auth: state },
      requiredPermissions: ["view_content"],
      requiredStaff: false,
    });

    expect(screen.getByText("Protected Content")).toBeInTheDocument();
  });

  it("does not render children for unauthorized users", () => {
    const state = createAuthState({
      userInfo: createUserInfoState({ permissions: ["other_permissions"] }),
    });

    setup({
      preloadedState: { auth: state },
      requiredPermissions: ["view_content"],
    });

    expect(screen.queryByText("Protected Content")).not.toBeInTheDocument();
  });

  it("typescript error if at least one protection requirement isn't provided", () => {
    // @ts-expect-error
    <ProtectedComponent>
      <div>Protected Content</div>
    </ProtectedComponent>;
  });
});
