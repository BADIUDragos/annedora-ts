import { Alert, Card, Col, ListGroup, Row, Container } from "react-bootstrap";
import { useParams } from "react-router-dom";
import Loader from "../../components/Loader";
import { useGetOrderByIdQuery } from "../../store/apis/orderApi";
import ProtectedComponent from "../../components/ProtectedComponent";
import getErrorString from "../../store/errorHandling/getErrorString";
import { useTranslation } from "react-i18next";
import OrderStatus from "./OrderStatus";
import OrderInfo from "./OrderInfo";
import OrderItems from "./OrderItems";
import OrderSummary from "../../components/OrderSummary";
import { Prices } from "../../store/interfaces/orderInterfaces";
import UpdateOrderStatus from "./UpdateOrderStatus";

const OrderPage = () => {
  const { id } = useParams<{ id: string }>();

  const { data: order, error, isError } = useGetOrderByIdQuery(Number(id));

  const { t } = useTranslation("order");

  if (isError) {
    return (
      <Container>
        <Alert variant="danger">{getErrorString(error)}</Alert>
      </Container>
    );
  }

  if (!order) {
    return (
      <Container>
        <Loader />
      </Container>
    );
  }

  const prices = {
    subtotal: order.subtotal,
    tax: order.tax_price,
    shipping: order.shipping_price,
    total: order.total_price,
  };

  return (
    <Container>
      <h1>
        {t("order")}: {order.id}
      </h1>
      <Row>
        <Col md={8}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <OrderInfo {...order} />
              <OrderStatus {...order} />
            </ListGroup.Item>
            <ListGroup.Item>
              <OrderItems {...order} />
            </ListGroup.Item>
          </ListGroup>
        </Col>

        <Col md={4}>
          <OrderSummary {...prices} />
          <ProtectedComponent requiredStaff>
            <UpdateOrderStatus {...order} />
          </ProtectedComponent>
        </Col>
      </Row>
    </Container>
  );
};

export default OrderPage;
