import { Nav, NavDropdown, Navbar } from "react-bootstrap";
import { useAuth, useLogoutMutation } from "../../store";
import { Link } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import { FaUser } from "react-icons/fa";
import { useTranslation } from "react-i18next";

const Login: React.FC = () => {
  const { t } = useTranslation("home");

  return (
    <LinkContainer to="/login">
      <Nav.Link>
        <FaUser style={{ marginRight: '0.4rem' }}/>
        {t('login')}
      </Nav.Link>
    </LinkContainer>
  );
};

const UserMenu: React.FC = () => {
  const { t } = useTranslation("home");
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
          <NavDropdown title={userInfo.first_name} id="username" className="me-3">
            <LinkContainer to={"/orders"}>
              <NavDropdown.Item>{t('myOrders')}</NavDropdown.Item>
            </LinkContainer>
            <NavDropdown.Item onClick={handleLogout}>{t('logout')}</NavDropdown.Item>
          </NavDropdown>
          {userInfo.isStaff ? (
            <NavDropdown title="Admin" id="adminmenu">
              <LinkContainer to="/admin/users">
                <NavDropdown.Item>{t('users')}</NavDropdown.Item>
              </LinkContainer>
              <LinkContainer to="/admin/products">
                <NavDropdown.Item>{t('products')}</NavDropdown.Item>
              </LinkContainer>
              <LinkContainer to="/admin/orders">
                <NavDropdown.Item>{t('orders')}</NavDropdown.Item>
              </LinkContainer>
            </NavDropdown>
          ) : null}
        </>
      ) : (
        <Link to={"/login"} className="text-decoration-none">
          <Navbar.Text className="ml-3">{t('login')}</Navbar.Text>
        </Link>
      )}
    </>
  );
};

export default UserMenu;
