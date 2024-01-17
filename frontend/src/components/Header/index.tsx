import { Navbar, Container, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import CartMenu from "./CartMenu";
import UserMenu from "./UserInfo";

interface IHeader {
  className?: string;
}

const Header: React.FC<IHeader> = ({ className }) => {
  return (
    <header className={className}>
      <Navbar bg="black" variant="dark" expand="lg" collapseOnSelect>
        <Container>
          <Navbar.Brand>
            <Link to={"/"}>
              <img
                src={"/images/logo_cut.png"}
                style={{ width: 400, marginTop: -7 }}
                alt="Annedora"
              />
            </Link>
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <CartMenu />
              <UserMenu />
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
