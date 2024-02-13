import { Button, Container, Form } from "react-bootstrap";
import { useState } from "react";
import { useCreateProductMutation } from "../../../../store/apis/productApi";
import FormContainer from "../../../../components/FormContainer";
import { ProductState } from "../../../../store/interfaces/productInterfaces";

const ProductForm: React.FC = () => {
  const [addProduct, {isLoading, isSuccess, error}] = useCreateProductMutation();
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
      setImage(e.target.files[0]);
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
    <FormContainer xs={12} md={6} className="justify-content-md-center">
      <h1>Create Product</h1>
      <Form onSubmit={handleSubmit}>
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
            placeholder="Enter stock"
            value={productData.countInStock}
            onChange={handleInputChange}
          ></Form.Control>
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

        
        
        <Button
          type="submit"
          variant="primary"
          className="btn-block w-100 mt-3"
        >
          Create
        </Button>
      </Form>
    </FormContainer>
  );
};

export const AdminCreateProductPage = () => {
  return (
    <Container>
      <ProductForm onSubmit={handleSubmit} isLoading={isLoading} error={error}/>
    </Container>
  );
};
