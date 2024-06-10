import { Col, Container, Row } from "react-bootstrap";
import { ProductForm } from "./ProductForm";

export const AdminCreateProductPage = () => {
  return (
    <Container>
      <h1>Create Product</h1>
      <ProductForm/>
    </Container>
  );
};
