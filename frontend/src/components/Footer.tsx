import { Container, Row, Col, ListGroup } from "react-bootstrap";
import {
  FaEnvelope,
  FaFacebook,
  FaInstagram,
  FaPhone,
  FaTiktok,
} from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";

const Footer: React.FC = () => {
  return (
    <footer>
      <Container>
        <Row>
          <Col md={6}>
            <span style={{ fontWeight: "bold" }}>About us:</span>
            <br />
            <br />
            Annedora is a small family owned business making honey and other bee
            products. We're passionate about our bees and we want to share our
            passion with you. We hope you'll enjoy our products as much as we do
            !<br />
          </Col>

          <Col md={3}>
            <ListGroup variant="flush">
              <span style={{ fontWeight: "bold" }}>Contact info:</span>
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

          <Col md={3}>
            <ListGroup variant="flush">
              <span style={{ fontWeight: "bold" }}>
                Follow the bees on social media !
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
