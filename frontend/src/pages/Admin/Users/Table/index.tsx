import { Alert, Button, Col, Container, Row, Table } from "react-bootstrap";
import {
  useDeleteUserMutation,
  useListUsersQuery,
} from "../../../../store/apis/usersApi";
import { UserInfoState } from "../../../../store/interfaces/authInterfaces";
import { FaCheck, FaEdit, FaTimes, FaTrash } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import Loader from "../../../../components/Loader";
import getErrorString from "../../../../store/errorHandling/getErrorString";

export const AdminTableUsersPage = () => {
  const {
    data: users,
    error: getListError,
    isLoading: getListLoading,
  } = useListUsersQuery();
  const [deleteUser, { error: deleteError, isLoading: deleteLoading }] =
    useDeleteUserMutation();

  const deleteUserHandler = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      await deleteUser(id);
    }
  };

  return (
    <Container>
      <Row>
        <Col>
          <h1>Users List</h1>
        </Col>
        <Col>
          {deleteLoading && <Loader />}
          {getListLoading && <Loader />}
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

      <Table striped bordered hover responsive className="table-sm">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Admin</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {users?.map((user: UserInfoState) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.first_name}</td>
              <td>{user.email}</td>
              <td>
                {user.isStaff ? (
                  <FaCheck color="green" />
                ) : (
                  <FaTimes color="red" />
                )}
              </td>
              <td>
                <NavLink to={`/admin/users/${user.id}`}>
                  <Button className="btn-sm" variant="info">
                    <FaEdit />
                  </Button>
                </NavLink>
                <Button
                  className="btn-sm"
                  variant="danger"
                  onClick={() => deleteUserHandler(user.id)}
                >
                  <FaTrash />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};
