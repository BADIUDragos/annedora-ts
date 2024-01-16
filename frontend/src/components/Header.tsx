import { Navbar, Container, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useAuth, useLogoutMutation } from "../store";

interface IHeader {
  className?: string;
}

const Header: React.FC<IHeader> = ({ className }) => {
  const { tokens, userInfo } = useAuth()

  const [logout] = useLogoutMutation();

  const handleLogout = async () => {
    if (tokens?.refresh) {
      logout({ refresh: tokens.refresh });
    }
  };

  return (
    <header className={className}>
      <Navbar bg="dark" variant="dark" expand="lg" collapseOnSelect>
        <Container className="d-flex align-items-center">
          <Navbar.Brand>
            <Link to={"/"}>
              <img
                src={"/images/logo.png"}
                style={{ width: 50, marginTop: -7 }}
                alt="Rolls-Royce"
              />
            </Link>
          </Navbar.Brand>
          <Navbar.Text className="ml-3">Boilerplate APP</Navbar.Text>
          {userInfo ? (
            <>
              <Navbar.Text className="ml-3">
                Hi {userInfo.username} !
              </Navbar.Text>
              <Nav.Link
                className="ml-3 cursor-pointer"
                onClick={handleLogout}
              >
                Logout
              </Nav.Link>
            </>
          ) : (
            <Link to="/login" className="text-decoration-none">
              <Navbar.Text className="ml-3">Login</Navbar.Text>
            </Link>
          )}
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
