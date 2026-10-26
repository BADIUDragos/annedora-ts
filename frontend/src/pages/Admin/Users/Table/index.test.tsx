import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AdminTableUsersPage } from "./index";
import {
  useDeleteUserMutation,
  useListUsersQuery,
  UserListArgs,
} from "../../../../store/apis/usersApi";

vi.mock("../../../../store/apis/usersApi", () => ({
  useListUsersQuery: vi.fn(),
  useDeleteUserMutation: vi.fn(),
}));

const listUsers = vi.mocked(useListUsersQuery);
const deleteUser = vi.mocked(useDeleteUserMutation);

const pageUsers = [
  {
    id: 2,
    first_name: "Newer",
    email: "newer@example.com",
    permissions: [],
    isSuperuser: false,
    isStaff: true,
    created_at: "2024-06-15T12:00:00Z",
  },
  {
    id: 1,
    first_name: "Older",
    email: "older@example.com",
    permissions: [],
    isSuperuser: false,
    isStaff: false,
    created_at: "2024-01-02T12:00:00Z",
  },
];

function renderPage() {
  return render(
    <MemoryRouter>
      <AdminTableUsersPage />
    </MemoryRouter>
  );
}

describe("AdminTableUsersPage", () => {
  beforeEach(() => {
    listUsers.mockReset();
    deleteUser.mockReset();
    deleteUser.mockReturnValue([vi.fn(), { isLoading: false, reset: vi.fn() }]);
    listUsers.mockImplementation((args) => {
      const query = args as UserListArgs;
      return {
        data: {
          count: 60,
          page: query.page,
          page_size: query.pageSize,
          results: pageUsers,
        },
        isLoading: false,
        isFetching: false,
        refetch: vi.fn(),
      };
    });
  });

  it("requests the first page from the server, newest created date first", () => {
    renderPage();

    expect(listUsers).toHaveBeenCalledWith({
      page: 1,
      pageSize: 25,
      sort: "created_at",
      direction: "desc",
    });
    expect(screen.queryByRole("columnheader", { name: "ID" })).toBeNull();
    expect(screen.getByRole("columnheader", { name: /Created/ })).toHaveAttribute(
      "aria-sort",
      "descending"
    );
    expect(screen.getByTestId("sort-desc")).toBeTruthy();

    const rows = screen.getAllByRole("row");
    expect(rows).toHaveLength(3);
    expect(rows[1].textContent).toContain("Newer");
    expect(rows[1].textContent).toContain("June 15th, 2024");
    expect(rows[2].textContent).toContain("Older");
    expect(screen.getByTestId("user-list-summary").textContent).toBe(
      "Showing 1-25 of 60"
    );
  });

  it("sends sort, direction, page, and page size to the server", async () => {
    const user = userEvent.setup();
    renderPage();

    await user.click(screen.getByRole("button", { name: "Created" }));
    expect(listUsers).toHaveBeenLastCalledWith({
      page: 1,
      pageSize: 25,
      sort: "created_at",
      direction: "asc",
    });
    expect(screen.getByRole("columnheader", { name: /Created/ })).toHaveAttribute(
      "aria-sort",
      "ascending"
    );

    await user.click(screen.getByRole("button", { name: "Name" }));
    expect(listUsers).toHaveBeenLastCalledWith({
      page: 1,
      pageSize: 25,
      sort: "first_name",
      direction: "asc",
    });

    await user.click(screen.getByRole("button", { name: "Name" }));
    expect(listUsers).toHaveBeenLastCalledWith({
      page: 1,
      pageSize: 25,
      sort: "first_name",
      direction: "desc",
    });

    await user.selectOptions(screen.getByLabelText("Users per page"), "50");
    expect(listUsers).toHaveBeenLastCalledWith({
      page: 1,
      pageSize: 50,
      sort: "first_name",
      direction: "desc",
    });

    await user.click(screen.getByRole("button", { name: "2" }));
    expect(listUsers).toHaveBeenLastCalledWith({
      page: 2,
      pageSize: 50,
      sort: "first_name",
      direction: "desc",
    });
  });
});
