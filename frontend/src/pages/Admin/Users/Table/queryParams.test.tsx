import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import setupStore from "../../../../store";
import { AdminTableUsersPage } from "./index";

vi.mock("../../../../constants/urls", () => ({
  API_URL: "http://api.test/",
}));

const pageUsers = [
  {
    id: 2,
    first_name: "Newer",
    email: "newer@example.com",
    permissions: [] as string[],
    isSuperuser: false,
    isStaff: true,
    created_at: "2024-06-15T12:00:00Z",
  },
];

function requestedUrl(input: RequestInfo | URL): URL {
  const raw = typeof input === "string" ? input : input instanceof URL ? input.toString() : input.url;
  return new URL(raw, "http://localhost");
}

describe("admin user list request", () => {
  const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
    const pageSize = requestedUrl(input).searchParams.get("page_size");
    return new Response(
      JSON.stringify({
        count: 1,
        page: 1,
        page_size: Number(pageSize ?? 25),
        results: pageUsers,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  });

  beforeEach(() => {
    fetchMock.mockClear();
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("sends page_size, not pageSize, on the user list request", async () => {
    const user = userEvent.setup();
    render(
      <Provider store={setupStore()}>
        <MemoryRouter>
          <AdminTableUsersPage />
        </MemoryRouter>
      </Provider>
    );

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalled();
    });

    const first = requestedUrl(fetchMock.mock.calls[0][0]);
    expect(first.pathname).toContain("base/users");
    expect(first.searchParams.get("page")).toBe("1");
    expect(first.searchParams.get("page_size")).toBe("25");
    expect(first.searchParams.get("pageSize")).toBeNull();
    expect(first.searchParams.get("sort")).toBe("created_at");
    expect(first.searchParams.get("direction")).toBe("desc");

    await user.selectOptions(await screen.findByLabelText("Users per page"), "50");

    await waitFor(() => {
      const latest = requestedUrl(fetchMock.mock.calls.at(-1)?.[0] ?? "");
      expect(latest.searchParams.get("page_size")).toBe("50");
    });
    const latest = requestedUrl(fetchMock.mock.calls.at(-1)?.[0] ?? "");
    expect(latest.searchParams.get("page")).toBe("1");
    expect(latest.searchParams.get("pageSize")).toBeNull();
    expect(latest.searchParams.get("sort")).toBe("created_at");
    expect(latest.searchParams.get("direction")).toBe("desc");
  });
});
