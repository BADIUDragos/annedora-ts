import { Container, Row, Col, ListGroup } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import {
  FaEnvelope,
  FaFacebook,
  FaInstagram,
  FaPhone,
  FaTiktok,
} from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";

const Footer: React.FC = () => {

  const { t } = useTranslation('home')

  return (
    <footer>
      <Container>
        <Row>
          <Col xs={12} md={6} className="mb-4">
            <span style={{ fontWeight: "bold" }}>{t('aboutUs')}:</span>
            <br />
            <br />
            {t('aboutUsDescription')}
            <br />
          </Col>

          <Col xs={12} md={3} className="mb-4">
            <ListGroup variant="flush">
              <span style={{ fontWeight: "bold" }}>{t("contactInfo")}:</span>
              <ListGroup.Item className="mt-3">
                <FaEnvelope /> info@annedora.ca
              </ListGroup.Item>
              <ListGroup.Item>
                <FaPhone /> + 1 (514) 824-6417
              </ListGroup.Item>
              <ListGroup.Item>
                <FaLocationDot /> Chateauguay, QC, Canada
              </ListGroup.Item>
            </ListGroup>
          </Col>

          <Col xs={12} md={3} className="mb-4">
            <ListGroup variant="flush">
              <span style={{ fontWeight: "bold" }}>
                {t("socialMedia")}
              </span>
              <ListGroup.Item
                action
                href="https://www.instagram.com/miellerie.annedora/"
                className="mt-3"
              >
                <FaInstagram /> miellerie.annedora
              </ListGroup.Item>
              <ListGroup.Item
                action
                href="https://www.facebook.com/profile.php?id=100087444407877"
              >
                <FaFacebook /> Miellerie Annedora
              </ListGroup.Item>
              <ListGroup.Item
                action
                href="https://www.tiktok.com/@miellerieannedoraa"
              >
                <FaTiktok /> miellerieannedoraa
              </ListGroup.Item>
            </ListGroup>
          </Col>
        </Row>
        <Row>
          <Col className="text-center py-3"> Copyright &copy; Annedora</Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
