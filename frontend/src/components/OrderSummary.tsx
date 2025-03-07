import { Row, Col, ListGroup, Card } from "react-bootstrap";

import { Prices } from "../store/interfaces/orderInterfaces";
import { useTranslation } from "react-i18next";

const OrderSummary: React.FC<Prices> = (prices) => {
  const { subtotal, shipping, tax, total } = prices;

  const { t } = useTranslation("order");

  return (
    <>
      <Card className="mb-3">
        <ListGroup variant="flush">
          <ListGroup.Item>
            <h2>{t("orderSummary")}</h2>
          </ListGroup.Item>

          <ListGroup.Item>
            <Row>
              <Col>{t("subtotal")}:</Col>
              <Col>${Number(subtotal).toFixed(2)}</Col>
            </Row>
          </ListGroup.Item>

          <ListGroup.Item>
            <Row>
              <Col>{t("shipping")}:</Col>
              <Col>${Number(shipping).toFixed(2)}</Col>
            </Row>
          </ListGroup.Item>

          <ListGroup.Item>
            <Row>
              <Col>{t("taxes")}:</Col>
              <Col>${Number(tax).toFixed(2)}</Col>
            </Row>
          </ListGroup.Item>

          <ListGroup.Item>
            <Row>
              <Col>{t("total")}:</Col>
              <Col>${Number(total).toFixed(2)}</Col>
            </Row>
          </ListGroup.Item>
        </ListGroup>
      </Card>
    </>
  );
};

export default OrderSummary;
