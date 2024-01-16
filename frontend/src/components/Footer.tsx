import { Container, Row, Col, ListGroup } from "react-bootstrap";

function Footer() {
  return (
    <footer>
      <Container>
        <Row>
          <Col md={6}>
            <span className="fw-bold">About app:</span>
            <br />
            <br />
            This can probably be some app description or something else <br />
          </Col>

          <Col md={3}>
            <ListGroup variant="flush">
              <span className="fw-bold">Contact info:</span>
              <ListGroup.Item className="mt-3">
                <i className="fa-solid fa-envelope"></i>{" "}
                support.email@rolls-royce.com
              </ListGroup.Item>
            </ListGroup>
          </Col>

          <Col md={3}>
            <ListGroup variant="flush">
              <span className="fw-bold">Phone numbers ?</span>
              <ListGroup.Item
                action
                href="https://www.instagram.com/miellerie.annedora/"
                className="mt-3"
              >
                <i className="fa-brands fa-instagram"></i> +1 (514) 123 - 4567
              </ListGroup.Item>
            </ListGroup>
          </Col>
        </Row>
        <Row>
          <Col className="text-center py-3"> Copyright &copy; Rolls-Royce</Col>
        </Row>
      </Container>
    </footer>
  );
}

export default Footer;
