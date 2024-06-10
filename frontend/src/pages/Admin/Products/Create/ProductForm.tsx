import { Button, Col, Form, Row } from "react-bootstrap";
import { useEffect, useState } from "react";
import { useCreateProductMutation } from "../../../../store/apis/productApi";
import FormContainer from "../../../../components/FormContainer";
import { ProductState } from "../../../../store/interfaces/productInterfaces";
import { useNavigate } from "react-router-dom";
import Loader from "../../../../components/Loader";

export const ProductForm: React.FC = () => {
  const [addProduct, { isLoading, isSuccess, error }] =
    useCreateProductMutation();
  const [productData, setProductData] = useState<
    Omit<ProductState, "id" | "image" | "rating">
  >({
    name: "",
    category: "",
    description: "",
    price: 0,
    countInStock: 0,
  });
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const navigate = useNavigate()

  useEffect(() => {
    if(isSuccess) {
      navigate("/admin/products")
    }
  }, [isSuccess])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProductData((prevState) => ({
      ...prevState,
      [name]:
        name === "price" || name === "countInStock" ? parseFloat(value) : value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(productData).forEach(([key, value]) => {
      formData.append(key, value.toString());
    });
    if (image) {
      formData.append("image", image);
    }
    await addProduct(formData);
  };

  return (
    <FormContainer xs={12} className="justify-content-md-center">
      <Form onSubmit={handleSubmit}>
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
                name="countInStock"
                placeholder="Enter stock"
                value={productData.countInStock}
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
            {isLoading ? 
            <Loader/> : 
            <Button
              type="submit"
              variant="primary"
              className="btn-block w-100 mt-3"
            >
              Create
            </Button>}
            
          </Col>
          <Col>
            {imagePreview && (
                <img src={imagePreview} alt="Image Preview" style={{ width: '60%', marginTop: '20px' }} />
            )}
          </Col>
        </Row>
      </Form>
    </FormContainer>
  );
};
