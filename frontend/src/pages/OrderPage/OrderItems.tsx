import React from "react";
import { CreatedOrder } from "../../store/interfaces/orderInterfaces";
import { useTranslation } from "react-i18next";
import { Alert, Col, ListGroup, Row, Image } from "react-bootstrap";
import { Link } from "react-router-dom";

const OrderItems: React.FC<CreatedOrder> = (order) => {
  const { t } = useTranslation("order");

  return (
    <>
      <h2>{t("items")}</h2>
      {order.order_items.length === 0 ? (
        <Alert variant="info">{t("emptyOrder")}</Alert>
      ) : (
        <ListGroup variant="flush">
          {order.order_items.map((item, index) => (
            <ListGroup.Item key={index}>
              <Row>
                <Col md={2}>
                  <Image src={item.image} alt={item.name} fluid rounded />
                </Col>

                <Col>
                  <Link to={`/product/${item.product}`}>{item.name}</Link>
                </Col>

                <Col md={4}>
                  {item.qty} x ${item.price} = $
                  {(item.qty * item.price).toFixed(2)}
                </Col>
              </Row>
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
    </>
  );
};

export default OrderItems;
