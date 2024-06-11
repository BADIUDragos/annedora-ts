import { Container} from "react-bootstrap";
import ProductForm from "../components/ProductForm";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateProductMutation } from "../../../../store/apis/productApi";
import { ProductState } from "../../../../store/interfaces/productInterfaces";

export const AdminCreateProductPage: React.FC = () => {
  const [addProduct, { isLoading, isSuccess, error }] = useCreateProductMutation();
  const [productData, setProductData] = useState<ProductState>({
    id: 0,
    name: "",
    image: "",
    category: "",
    description: "",
    rating: 0,
    price: 0,
    countInStock: 0,
  });
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isSuccess) {
      navigate("/admin/products");
    }
  }, [isSuccess, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProductData((prevState) => ({
      ...prevState,
      [name]: name === "price" || name === "countInStock" ? parseFloat(value) : value,
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
    <Container>
      <h1>Create Product</h1>
      <ProductForm
        productData={productData}
        imagePreview={imagePreview}
        isLoading={isLoading}
        error={error}
        handleInputChange={handleInputChange}
        handleFileChange={handleFileChange}
        handleSubmit={handleSubmit}
        isUpdate={false}
      />
    </Container>
  );
};