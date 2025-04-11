import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Container, Row, Col, Dropdown } from "react-bootstrap";
import { useListProductsQuery } from "../../store/apis/productApi";
import Product from "./Product";
import Loader from "../../components/Loader";
import { useTranslation } from "react-i18next";

const categories = ["All Products", "Honey", "Candles", "Soaps", "Other", "Materials", "Events"];

const ProductsPage: React.FC = () => {
  const { t } = useTranslation("home");
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const categoryFromUrl = searchParams.get("category") || "All Products";
  const [selectedCategory, setSelectedCategory] = useState(categoryFromUrl);

  const { data: products, isLoading } = useListProductsQuery();

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

  const filteredProducts = products?.filter((product) =>
    selectedCategory === "All Products" || product.category === selectedCategory
  );

  return (
    <Container>
      <Row>
        <Col>
          <h1>{t('products')}</h1>
        </Col>
        <Col md="auto">
          <Dropdown onSelect={(e) => handleSelect(e as string)}>
            <Dropdown.Toggle id="dropdown-basic" style={{ width: "auto" }}>
              {t(selectedCategory)}
            </Dropdown.Toggle>

            <Dropdown.Menu style={{ width: "200px" }}>
              {categories.map((category) => (
                <Dropdown.Item
                  key={category}
                  eventKey={category}
                  active={category === selectedCategory}
                >
                  {t(category)}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </Col>
      </Row>
      <Row>
        {isLoading && <Loader/>}
        {filteredProducts && filteredProducts.map((product) => (
          <Col
            key={product.id}
            xs={6}
            sm={3}
            md={6}
            lg={4}
            xl={3}
            style={{ display: "flex" }}
          >
            <Product {...product} />
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default ProductsPage;
