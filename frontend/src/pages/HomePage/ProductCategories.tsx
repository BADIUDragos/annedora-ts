import React from "react";
import { Card, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./ProductCategories.css";

const categories = [
  {
    name: "Honey",
    link: "/products?category=honey",
    image: "/images/honeyCategory.jpeg",
  },
  {
    name: "Candles",
    link: "/products?category=candles",
    image: "/images/candlesCategory.jpeg",
  },
  {
    name: "Soaps",
    link: "/products?category=soaps",
    image: "/images/soapsCategory.jpeg",
  },
  {
    name: "Special",
    link: "/products?category=special",
    image: "/images/specialCategory.jpeg",
  },
];

const ProductCategories: React.FC = () => {
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
