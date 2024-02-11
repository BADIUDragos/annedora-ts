import { Button, Col, Container, Row } from "react-bootstrap";
import { FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export const AdminProductsPage = () => {
  const navigate = useNavigate();

  const createProductHandler = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate("/admin/products/create");
  };

  return (
    <Container>
      <Row className="align-items-center">
        <Col>
          <h1>Products</h1>
        </Col>
        <Col className="text-end">
          <Button className="my-3" onClick={createProductHandler}>
            <FaPlus className="fas fa-plus" /> Create Product
          </Button>
        </Col>
      </Row>
    </Container>
  );
};
