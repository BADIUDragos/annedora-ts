import React from 'react';
import { Navbar, Container, Nav, Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import CartMenu from './CartMenu';
import UserMenu from './UserInfo';
import { useTranslation } from 'react-i18next';

interface IHeader {
  className?: string;
}

const Header: React.FC<IHeader> = ({ className }) => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const currentLanguage = i18n.language;

  return (
    <header className={className}>
      <Navbar bg="black" variant="dark" expand="lg" collapseOnSelect>
        <Container>
          <Navbar.Brand as={Link} to="/">
            <Image
              src="/images/logo_cut.png"
              style={{ width: 400, marginTop: -7 }}
              alt="Annedora"
            />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto" style={{marginLeft: "auto"}}>
              <CartMenu />
              <UserMenu />
              <Nav.Link onClick={() => changeLanguage(currentLanguage === 'en' ? 'fr' : 'en')}>
                {currentLanguage === 'en' ? 'FR' : 'EN'}
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;