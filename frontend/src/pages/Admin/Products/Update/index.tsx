import { Container } from "react-bootstrap";
import ProductForm from "../components/ProductForm";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ProductState } from "../../../../store/interfaces/productInterfaces";
import {
  useGetProductByIdQuery,
  useUpdateProductMutation,
} from "../../../../store/apis/productApi";

export const AdminEditProductPage = () => {
  const { id } = useParams<{ id: string }>();
  const {
    data: product,
    isLoading: isFetching,
    error: fetchError,
  } = useGetProductByIdQuery(Number(id));
  const [
    updateProduct,
    { isLoading: isUpdating, isSuccess, error: updateError },
  ] = useUpdateProductMutation();

  const [productData, setProductData] = useState<ProductState>({
    id: 0,
    name: "",
    image: "",
    category: "",
    description: "",
    rating: 0,
    price: 0,
    count_in_stock: 0,
  });
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (product) {
      setProductData(product);
      setImagePreview(product.image);
    }

    if (isSuccess) {
      navigate("/admin/products");
    }
  }, [product, isSuccess]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProductData((prevState) => {
      const newValue = name === "price" || name === "count_in_stock" ? parseFloat(value) : value;
      const updatedData = { ...prevState, [name]: newValue };
      return updatedData;
    });
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
    } else {
      formData.delete("image");
    }
    await updateProduct({ id: Number(id), formData });
  };

  return (
    <Container>
      <h1>Update Product</h1>
      {isFetching ? (
        <p>Loading...</p>
      ) : fetchError ? (
        <p>Error loading product data: {fetchError.toString()}</p>
      ) : (
        <ProductForm
          productData={productData}
          imagePreview={imagePreview}
          isLoading={isUpdating}
          error={updateError}
          handleInputChange={handleInputChange}
          handleFileChange={handleFileChange}
          handleSubmit={handleSubmit}
          isUpdate={true}
        />
      )}
    </Container>
  );
};
