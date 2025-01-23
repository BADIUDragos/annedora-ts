import moment from "moment";
import {
  Alert,
  Button,
  Card,
  Col,
  ListGroup,
  Row,
  Image,
  Container,
} from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import Loader from "../components/Loader";
import {
  useGetOrderByIdQuery,
  useMarkOrderAsDeliveredMutation,
  useMarkOrderAsShippedMutation,
} from "../store/apis/orderApi";
import ProtectedComponent from "../components/ProtectedComponent";
import getErrorString from "../store/errorHandling/getErrorString";

const OrderPage = () => {
  const { id } = useParams<{ id: string }>();

  const { data: order, error, isError } = useGetOrderByIdQuery(Number(id));


  const [
    markOrderAsShipped,
    { isLoading: loadingShipped, isSuccess: shippedSuccess },
  ] = useMarkOrderAsShippedMutation();
  const [
    markOrderAsDelivered,
    { isLoading: loadingDelivered, isSuccess: deliveredSuccess },
  ] = useMarkOrderAsDeliveredMutation();

  const markAsShippedHandler = async () => {
    if (order && window.confirm("Are you sure you shipped this product ?")) {
      await markOrderAsShipped(order.id);
    }
  };

  const markAsDeliveredHandler = async () => {
    if (order && window.confirm("Are you sure this product was delivered ?")) {
      await markOrderAsDelivered(order.id);
    }
  };

  if (isError) {
    return <Container><Alert variant="danger">{getErrorString(error)}</Alert></Container>
  }

  if (!order) {
    return <Container><Loader/></Container>;
  }



  return (
    <Container>
      <h1>Order: {order.id}</h1>
      <Row>
        <Col md={8}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>Shipping</h2>
              <p>
                <strong>Name: </strong> {order.user.first_name}{" "}
              </p>
              <p>
                <strong>Email: </strong> {order.user.email}{" "}
              </p>
              <p>
                <strong>Shipping:</strong>
                {order.shipping_address.address}, {order.shipping_address.city},
                {"   "}
                {order.shipping_address.postalCode},{"   "}
                {"Canada"}
              </p>
              {order.is_paid ? (
                <Alert variant="success">
                  Paid on {moment(order.paid_at).format("MMMM Do, YYYY")}
                </Alert>
              ) : (
                <Alert variant="warning">Not Paid</Alert>
              )}
              {order.is_shipped ? (
                <Alert variant="success">
                  Shipped on{" "}
                  {moment(order.shipped_date).format("MMMM Do, YYYY")}
                </Alert>
              ) : (
                <Alert variant="warning">Not Shipped</Alert>
              )}
              {order.is_delivered ? (
                <Alert variant="success">
                  Delivered on{" "}
                  {moment(order.delivered_at).format("MMMM Do, YYYY")}
                </Alert>
              ) : (
                <Alert variant="warning">Not Delivered</Alert>
              )}
            </ListGroup.Item>
            <ListGroup.Item>
              <h2>Order Items</h2>
              {order.order_items.length === 0 ? (
                <Alert variant="info">Order is empty</Alert>
              ) : (
                <ListGroup variant="flush">
                  {order.order_items.map((item, index) => (
                    <ListGroup.Item key={index}>
                      <Row>
                        <Col md={2}>
                          <Image
                            src={item.image}
                            alt={item.name}
                            fluid
                            rounded
                          />
                        </Col>

                        <Col>
                          <Link to={`/product/${item.product}`}>
                            {item.name}
                          </Link>
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
            </ListGroup.Item>
          </ListGroup>
        </Col>

        <Col md={4}>
          <Card className="mb-4">
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h2>Order Summary</h2>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Items:</Col>
                  <Col>${order.subtotal}</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Shipping:</Col>
                  <Col>${order.shipping_price}</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Taxes:</Col>
                  <Col>${order.tax_price}</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Total:</Col>
                  <Col>${order.total_price}</Col>
                </Row>
              </ListGroup.Item>
            </ListGroup>

            <ProtectedComponent requiredStaff>
              <ListGroup>
                <ListGroup.Item>
                  <Button
                    type="button"
                    className="btn btn-block w-100"
                    onClick={markAsShippedHandler}
                    disabled={order.is_shipped}
                  >
                    Mark As Shipped
                  </Button>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Button
                    type="button"
                    className="btn btn-block w-100"
                    onClick={markAsDeliveredHandler}
                    disabled={order.is_delivered}
                  >
                    Mark As Delivered
                  </Button>
                </ListGroup.Item>
              </ListGroup>
            </ProtectedComponent>
          </Card>

          {loadingShipped || (loadingDelivered && <Loader className="mt-3" />)}
        </Col>
      </Row>
    </Container>
  );
};

export default OrderPage;
