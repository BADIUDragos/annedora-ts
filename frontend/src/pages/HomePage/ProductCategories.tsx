import React from "react";
import { Card, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./ProductCategories.css";
import { useTranslation } from "react-i18next";

const ProductCategories: React.FC = () => {
  const { t } = useTranslation("home");

  const categories = [
    {
      name: t("honey"),
      link: "/products?category=honey",
      image: "/images/honeyCategory.jpeg",
    },
    {
      name: t('candles'),
      link: "/products?category=candles",
      image: "/images/candlesCategory.jpeg",
    },
    {
      name: t('soaps'),
      link: "/products?category=soaps",
      image: "/images/soapsCategory.jpeg",
    },
    {
      name: t('special'),
      link: "/products?category=special",
      image: "/images/specialCategory.jpeg",
    },
    {
      name: t('materials'),
      link: "/products?category=materials",
      image: "/images/materials.jpeg",
    },
  ];

  return (
    <Row className="mt-3">
      {categories.map((category) => (
        <Col key={category.name} md={6} className="mb-4">
          <Link to={category.link} style={{ textDecoration: "none" }}>
            <Card className="category-card">
              <Card.Img variant="bottom" src={category.image} />
              <div className="category-name">{category.name}</div>
            </Card>
          </Link>
        </Col>
      ))}
    </Row>
  );
};

export default ProductCategories;
