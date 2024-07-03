import React from "react";
import { Card, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";

const categories = [
  { name: 'Honey', link: '/products?category=honey', image: '/images/honey.png' },
  { name: 'Candles', link: '/products?category=candles', image: '/images/candles.png' },
  { name: 'Soaps', link: '/products?category=soaps', image: '/images/soaps.png' },
  { name: 'Special', link: '/products?category=special', image: '/images/special.png' },
];

const ProductCategories: React.FC = () => {
  return (
    <Row className="mt-3">
      {categories.map((category) => (
        <Col key={category.name} md={6} className="mb-4">
          <Link to={category.link} style={{ textDecoration: "none" }}>
            <Card
              className="h-100"
              style={{ cursor: "pointer" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.boxShadow = "0 4px 8px rgba(0,0,0,0.2)")
              }
              onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
            >
              <Card.Body>
                <Card.Title>{category.name}</Card.Title>
              </Card.Body>
              <Card.Img variant="bottom" src={category.image} style={{}}/>
            </Card>
          </Link>
        </Col>
      ))}
    </Row>
  );
};

export default ProductCategories;
