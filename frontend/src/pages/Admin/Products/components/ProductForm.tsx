import { Alert, Button, Col, Form, Row } from "react-bootstrap";
import FormContainer from "../../../../components/FormContainer";
import { ProductState } from "../../../../store/interfaces/productInterfaces";
import Loader from "../../../../components/Loader";
import getErrorString from "../../../../store/errorHandling/getErrorString";

interface ProductFormProps {
  productData: ProductState;
  imagePreview: string | null;
  isLoading: boolean;
  error: any;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isUpdate: boolean;
}

const ProductForm: React.FC<ProductFormProps> = ({
  productData,
  imagePreview,
  isLoading,
  error,
  handleInputChange,
  handleFileChange,
  handleSubmit,
  isUpdate,
}) => {
  return (
    <FormContainer xs={12} className="justify-content-md-center">
      <Form onSubmit={handleSubmit} encType="multipart/form">
        <Row>
          <Col>
            <Form.Group controlId="productName" className="mt-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                placeholder="Enter product name"
                value={productData.name}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="productCategory" className="mt-3">
              <Form.Label>Category</Form.Label>
              <Form.Control
                as="select"
                name="category"
                value={productData.category}
                onChange={handleInputChange}
              >
                <option value="honey">Honey</option>
                <option value="candles">Candles</option>
                <option value="soaps">Soaps</option>
                <option value="other">Other</option>
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="productPrice" className="mt-3">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                name="price"
                placeholder="Enter product price"
                value={productData.price}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="countInStock" className="mt-3">
              <Form.Label>Stock</Form.Label>
              <Form.Control
                type="number"
                name="count_in_stock"
                placeholder="Enter stock"
                value={productData.count_in_stock}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="productDescription" className="mt-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                name="description"
                placeholder="Enter product description"
                value={productData.description}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="productImage" className="mt-3">
              <Form.Label>Image</Form.Label>
              <Form.Control type="file" onChange={handleFileChange} />
            </Form.Group>
            {isLoading ? (
              <Loader style={{ height: '40px', width: '40px' }} className="mt-3"/>
            ) : (
              <Button
                type="submit"
                variant="primary"
                className="btn-block w-100 mt-3"
              >
                {isUpdate ? "Update" : "Create"}
              </Button>
            )}
            {error && !isLoading && (
              <Alert variant="danger" className="mt-3">
                {getErrorString(error)}
              </Alert>
            )}
          </Col>
          <Col>
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Image Preview"
                style={{ width: "60%", marginTop: "20px" }}
              />
            )}
          </Col>
        </Row>
      </Form>
    </FormContainer>
  );
};

export default ProductForm;
