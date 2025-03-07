import { Col, Container, Row } from "react-bootstrap";
import AnnedoraCarousel from "./AnnedoraCarousel";
import ProductCategories from "./ProductCategories";
import PollinationServices from "./PollinationServices";

const HomePage: React.FC = () => {

  return (
    <Container >
      <Container >
        <Row>
          <Col className="pr-5">
            <AnnedoraCarousel />
          </Col>
          <Col>
            <PollinationServices />
          </Col>
        </Row>
      </Container>
      <Container >
        <ProductCategories />
      </Container>
    </Container>
  );
};

export default HomePage;
