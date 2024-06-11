import { Alert, Button, Col, Container, Row, Table } from "react-bootstrap";
import { FaEdit, FaPlus, FaTrash } from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import {
  useDeleteProductMutation,
  useListProductsQuery,
} from "../../../../store/apis/productApi";
import Loader from "../../../../components/Loader";
import getErrorString from "../../../../store/errorHandling/getErrorString";

export const AdminProductsPage = () => {
  const navigate = useNavigate();

  const { data: products, error, isLoading } = useListProductsQuery();
  const [deleteProduct] = useDeleteProductMutation();

  if (isLoading) return <Loader />;
  if (error) return <Alert variant="danger">{getErrorString(error)}</Alert>;

  const createProductHandler = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate("/admin/products/create");
  };

  const deleteProductHandler = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      await deleteProduct(id);
    }
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

      <Table striped bordered hover responsive className="table-sm">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Category</th>
            <th>Price</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {products?.map((product) => (
            <tr key={product.id}>
              <td>{product.id}</td>
              <td>{product.name}</td>
              <td>{product.category}</td>
              <td>${product.price}</td>

              <td>
                <NavLink to={`/admin/products/${product.id}`}>
                  <Button className="btn-sm" variant="info">
                    <FaEdit />
                  </Button>
                </NavLink>
                <Button
                  className="btn-sm"
                  variant="danger"
                  onClick={() => deleteProductHandler(product.id)}
                >
                  <FaTrash />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};
