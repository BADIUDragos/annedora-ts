import { Row, Col, ListGroup, Card, Alert } from "react-bootstrap";
import Loader from "./Loader";

import Payment from "../pages/PlaceOrderPage/components/Payment";
import { Prices } from "../store/interfaces/orderInterfaces";
import { useTranslation } from "react-i18next";

const OrderSummary:React.FC<Prices> = (prices) => {
  
  const { subtotal, shipping, tax, total } = prices

  const { t } = useTranslation("order")

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
              <Col>${subtotal}</Col>
            </Row>
          </ListGroup.Item>

          <ListGroup.Item>
            <Row>
              <Col>{t("shipping")}:</Col>
              <Col>${shipping}</Col>
            </Row>
          </ListGroup.Item>

          <ListGroup.Item>
            <Row>
              <Col>{t("taxes")}:</Col>
              <Col>${tax}</Col>
            </Row>
          </ListGroup.Item>

          <ListGroup.Item>
            <Row>
              <Col>{t("total")}:</Col>
              <Col>${total}</Col>
            </Row>
          </ListGroup.Item>
        </ListGroup>
      </Card>
    </>
  );
};

export default OrderSummary;
