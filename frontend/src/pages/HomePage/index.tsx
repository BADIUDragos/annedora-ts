import { Col, Container, Row } from "react-bootstrap";
import AnnedoraCarousel from "./AnnedoraCarousel";
import ProductCategories from "./ProductCategories";
import { useTranslation } from "react-i18next";
import PollinationServices from "./PollinationServices";

const HomePage: React.FC = () => {
  const { t } = useTranslation("home");

  return (
    <Container>
      <Container>
        <Row>
          <Col className="pr-5">
            <AnnedoraCarousel />
          </Col>
          <Col>
            <PollinationServices  />
          </Col>
        </Row>
      </Container>
      <h1>{t("categoriesTitle")}</h1>
      <ProductCategories />
    </Container>
  );
};

export default HomePage;
