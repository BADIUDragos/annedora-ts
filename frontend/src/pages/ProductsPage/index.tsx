import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Container, Row, Col, Dropdown } from "react-bootstrap";
import { useListProductsQuery } from "../../store/apis/productApi";

const categories = ["All Products", "Honey", "Candles", "Soaps", "Special"];

const ProductsPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const categoryFromUrl = searchParams.get("category") || "All Products";
  const [selectedCategory, setSelectedCategory] = useState(categoryFromUrl);

  const { data: products, error, isLoading } = useListProductsQuery();

  useEffect(() => {
    if (categoryFromUrl !== selectedCategory) {
      setSelectedCategory(categoryFromUrl);
    }
  }, [categoryFromUrl, selectedCategory]);

  const handleSelect = (category: string) => {
    setSelectedCategory(category);
    if (category === "All Products") {
      navigate("/products");
    } else {
      navigate(`/products?category=${category.toLowerCase()}`);
    }
  };

  return (
    <Container>
      <Row>
        <Col>
          <h1>Products</h1>
        </Col>
        <Col md="auto">
          <Dropdown onSelect={(e) => handleSelect(e as string)}>
            <Dropdown.Toggle id="dropdown-basic" style={{ width: "200px" }}>
              {selectedCategory}
            </Dropdown.Toggle>

            <Dropdown.Menu style={{ width: "200px" }}>
              {categories.map((category) => (
                <Dropdown.Item
                  key={category}
                  eventKey={category}
                  active={category === selectedCategory}
                >
                  {category}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </Col>
      </Row>
      <Row>
        {selectedCategory && <h2>Category: {selectedCategory}</h2>}
      </Row>
    </Container>
  );
};

export default ProductsPage;
