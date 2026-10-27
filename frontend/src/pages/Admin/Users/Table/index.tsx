import { Dispatch, SetStateAction, useEffect, useState } from "react";
import moment from "moment";
import {
  Alert,
  Button,
  Col,
  Container,
  Form,
  Pagination,
  Row,
  Table,
} from "react-bootstrap";
import { FaCaretDown, FaCaretUp, FaCheck, FaEdit, FaTimes, FaTrash } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import Loader from "../../../../components/Loader";
import getErrorString from "../../../../store/errorHandling/getErrorString";
import {
  SortDirection,
  UserPageSize,
  UserSortField,
  useDeleteUserMutation,
  useListUsersQuery,
} from "../../../../store/apis/usersApi";

const PAGE_SIZES: UserPageSize[] = [10, 25, 50, 100];
const DEFAULT_PAGE_SIZE: UserPageSize = 25;

const SORTABLE_COLUMNS: { field: UserSortField; label: string }[] = [
  { field: "first_name", label: "Name" },
  { field: "email", label: "Email" },
  { field: "is_staff", label: "Admin" },
  { field: "created_at", label: "Created" },
];

export const AdminTableUsersPage = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState<UserPageSize>(DEFAULT_PAGE_SIZE);
  const [sort, setSort] = useState<UserSortField>("created_at");
  const [direction, setDirection] = useState<SortDirection>("desc");

  const {
    data,
    error: getListError,
    isLoading: getListLoading,
    isFetching,
  } = useListUsersQuery({ page, pageSize, sort, direction });
  const [deleteUser, { error: deleteError, isLoading: deleteLoading }] =
    useDeleteUserMutation();

  const totalPages = data ? Math.max(1, Math.ceil(data.count / pageSize)) : page;
  const currentPage = Math.min(page, totalPages);

  useEffect(() => {
    if (data && page > totalPages) {
      setPage(totalPages);
    }
  }, [data, page, totalPages]);

  const deleteUserHandler = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      await deleteUser(id);
    }
  };

  const onSort = (field: UserSortField) => {
    setPage(1);
    if (sort === field) {
      setDirection((current) => (current === "asc" ? "desc" : "asc"));
      return;
    }
    setSort(field);
    setDirection("asc");
  };

  const onPageSizeChange = (value: string) => {
    const next = Number(value);
    if ((PAGE_SIZES as readonly number[]).includes(next)) {
      setPageSize(next as UserPageSize);
      setPage(1);
    }
  };

  const start =
    data && data.count > 0 ? (currentPage - 1) * pageSize + 1 : 0;
  const end = data ? Math.min(currentPage * pageSize, data.count) : 0;

  return (
    <Container>
      <Row>
        <Col>
          <h1>Users List</h1>
        </Col>
        <Col>
          {deleteLoading && <Loader />}
          {(getListLoading || isFetching) && <Loader />}
        </Col>
      </Row>
      <Row>
        {deleteError && (
          <Alert variant="danger">{getErrorString(deleteError)}</Alert>
        )}
        {getListError && (
          <Alert variant="danger">{getErrorString(getListError)}</Alert>
        )}
      </Row>

      <Row className="align-items-center mb-3">
        <Col xs="auto">
          <Form.Group controlId="users-per-page" className="d-flex align-items-center gap-2">
            <Form.Label className="mb-0">Users per page</Form.Label>
            <Form.Select
              aria-label="Users per page"
              value={pageSize}
              onChange={(event) => onPageSizeChange(event.target.value)}
              style={{ width: "auto" }}
            >
              {PAGE_SIZES.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
        <Col>
          {data && (
            <span data-testid="user-list-summary">
              Showing {start}-{end} of {data.count}
            </span>
          )}
        </Col>
      </Row>

      <Table striped bordered hover responsive className="table-sm">
        <thead>
          <tr>
            {SORTABLE_COLUMNS.map((column) => {
              const active = sort === column.field;
              const ariaSort = active
                ? direction === "asc"
                  ? "ascending"
                  : "descending"
                : "none";
              return (
                <th key={column.field} scope="col" aria-sort={ariaSort}>
                  <button
                    type="button"
                    className="btn btn-link btn-sm p-0 text-start text-decoration-none text-reset fw-bold"
                    onClick={() => onSort(column.field)}
                  >
                    {column.label}
                    {active &&
                      (direction === "asc" ? (
                        <FaCaretUp
                          aria-hidden="true"
                          className="ms-1"
                          data-testid="sort-asc"
                        />
                      ) : (
                        <FaCaretDown
                          aria-hidden="true"
                          className="ms-1"
                          data-testid="sort-desc"
                        />
                      ))}
                  </button>
                </th>
              );
            })}
            <th scope="col">
              <span className="visually-hidden">Actions</span>
            </th>
          </tr>
        </thead>

        <tbody>
          {data?.results.map((user) => (
            <tr key={user.id}>
              <td>{user.first_name}</td>
              <td>{user.email}</td>
              <td>
                {user.isStaff ? (
                  <FaCheck color="green" />
                ) : (
                  <FaTimes color="red" />
                )}
              </td>
              <td className="text-nowrap" title={user.created_at}>
                {user.created_at
                  ? moment(user.created_at).format("MMMM Do, YYYY")
                  : ""}
              </td>
              <td>
                <NavLink to={`/admin/users/${user.id}`}>
                  <Button
                    className="btn-sm"
                    variant="info"
                    aria-label={`Edit ${user.first_name}`}
                  >
                    <FaEdit />
                  </Button>
                </NavLink>
                <Button
                  className="btn-sm ms-1"
                  variant="danger"
                  aria-label={`Delete ${user.first_name}`}
                  onClick={() => deleteUserHandler(user.id)}
                >
                  <FaTrash />
                </Button>
              </td>
            </tr>
          ))}
          {data && data.results.length === 0 && (
            <tr>
              <td colSpan={5}>No users to display.</td>
            </tr>
          )}
        </tbody>
      </Table>

      {data && data.count > 0 && (
        <Pagination aria-label="User list pages">
          {renderPageItems(currentPage, totalPages, setPage)}
        </Pagination>
      )}
    </Container>
  );
};

function renderPageItems(
  currentPage: number,
  totalPages: number,
  onPageChange: Dispatch<SetStateAction<number>>
) {
  const paginationItems = [];

  if (currentPage > 1) {
    paginationItems.push(
      <Pagination.First key="first" onClick={() => onPageChange(1)} />
    );
    paginationItems.push(
      <Pagination.Prev
        key="prev"
        onClick={() => onPageChange(currentPage - 1)}
      />
    );
  }

  for (let i = 1; i <= totalPages; i++) {
    if (Math.abs(currentPage - i) <= 2 || i === 1 || i === totalPages) {
      paginationItems.push(
        <Pagination.Item
          key={i}
          active={i === currentPage}
          onClick={() => onPageChange(i)}
        >
          {i}
        </Pagination.Item>
      );
    }
  }

  if (currentPage < totalPages) {
    paginationItems.push(
      <Pagination.Next
        key="next"
        onClick={() => onPageChange(currentPage + 1)}
      />
    );
    paginationItems.push(
      <Pagination.Last
        key="last"
        onClick={() => onPageChange(totalPages)}
      />
    );
  }

  return paginationItems;
}
