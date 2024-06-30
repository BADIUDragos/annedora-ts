import { Button, Container, Table } from "react-bootstrap";
import { useDeleteUserMutation, useListUsersQuery } from "../../../../store/apis/usersApi";
import { UserInfoState } from "../../../../store/interfaces/authInterfaces";
import { FaCheck, FaEdit, FaTimes, FaTrash } from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";

export const AdminTableUsersPage = () => {

  const navigate = useNavigate()

  const { data: users, error, isLoading } = useListUsersQuery();
  const [deleteUser] = useDeleteUserMutation()

  const deleteUserHandler = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      await deleteUser(id);
    }
  };


  return (
    <Container>
      <h1>Users List</h1>

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
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.isStaff ? (<FaCheck color="green"/>) : (<FaTimes color="red"/>)}</td>
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
