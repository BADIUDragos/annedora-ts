import { Nav, NavDropdown, Navbar } from "react-bootstrap";
import { useAuth, useLogoutMutation } from "../../store";
import { Link } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";

const Login: React.FC = () => {
  return (
    <LinkContainer to="/login">
      <Nav.Link>
        <div className="fas fa-user" style={{ marginRight: "0.4rem" }} />
        Login
      </Nav.Link>
    </LinkContainer>
  );
};

const UserMenu: React.FC = () => {
  const { tokens, userInfo } = useAuth();

  const [logout] = useLogoutMutation();

  const handleLogout = async () => {
    if (tokens?.refresh) {
      logout({ refresh: tokens.refresh });
    }
  };

  if (!userInfo) return <Login />;

  return (
    <>
      {userInfo ? (
        <>
          <NavDropdown title={userInfo.username} id="username" className="me-3">
            <LinkContainer to={"/profile"}>
              <NavDropdown.Item>Profile</NavDropdown.Item>
            </LinkContainer>
            <NavDropdown.Item onClick={handleLogout}> Logout </NavDropdown.Item>
          </NavDropdown>
          {userInfo.isStaff ? (
            <NavDropdown title="Admin" id="adminmenu">
              <LinkContainer to="/admin/userlist">
                <NavDropdown.Item> Users </NavDropdown.Item>
              </LinkContainer>
              <LinkContainer to="/admin/productlist">
                <NavDropdown.Item> Products </NavDropdown.Item>
              </LinkContainer>
              <LinkContainer to="/admin/orderlist">
                <NavDropdown.Item> Orders </NavDropdown.Item>
              </LinkContainer>
            </NavDropdown>
          ) : null}
        </>
      ) : (
        <Link to={"/login"} className="text-decoration-none">
          <Navbar.Text className="ml-3">Login</Navbar.Text>
        </Link>
      )}
    </>
  );
};

export default UserMenu;
