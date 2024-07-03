import { Container } from "react-bootstrap";
import AnnedoraCarousel from "./AnnedoraCarousel";
import ProductCategories from "./ProductCategories";

const HomePage = () => {

  return (
    <Container>
      <h1>Beekeeping life</h1>
      <AnnedoraCarousel/>
      <h1>Our Products</h1>
      <ProductCategories/>
    </Container>
  );
};

export default HomePage;
