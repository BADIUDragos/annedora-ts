import { Row, Col, ListGroup, Card, Alert } from "react-bootstrap";
import Loader from "../../../components/Loader";

import Payment from "./Payment";
import { useOrder } from "../../../store/hooks/orderHooks";
import { useEffect } from "react";
import { useCart } from "../../../store/hooks/cartHooks";
import { useGetTotalMutation } from "../../../store/apis/orderApi";
import { setPrices } from "../../../store/slices/orderSlice";
import { useDispatch } from "react-redux";

const OrderSummary = () => {
  
  const dispatch = useDispatch()
  const cart = useCart();
  const { cartItems } = cart;
  const { prices, option } = useOrder();
  const { subtotal = 0, shipping = 0, tax = 0, total = 0 } = prices || {};
  const [getTotal, {isLoading}] = useGetTotalMutation();

  useEffect(() => {
    const items = cartItems.map((item) => ({
      id: item.id,
      qty: item.qty,
    }));

    getTotal({ items, option })
      .unwrap()
      .then((fetchedPrices) => {
        dispatch(setPrices(fetchedPrices));
      })
      .catch((error) => console.error("Failed to fetch prices:", error));
  }, [option, cartItems, getTotal]);

  if (isLoading) return <Loader />;

  return (
    <>
      <Card className="mb-3">
        <ListGroup variant="flush">
          <ListGroup.Item>
            <h2>Order Summary</h2>
          </ListGroup.Item>

          <ListGroup.Item>
            <Row>
              <Col>Subtotal:</Col>
              <Col>${subtotal}</Col>
            </Row>
          </ListGroup.Item>

          <ListGroup.Item>
            <Row>
              <Col>Shipping:</Col>
              <Col>${shipping}</Col>
            </Row>
          </ListGroup.Item>

          <ListGroup.Item>
            <Row>
              <Col>Taxes:</Col>
              <Col>${tax}</Col>
            </Row>
          </ListGroup.Item>

          <ListGroup.Item>
            <Row>
              <Col>Total:</Col>
              <Col>${total}</Col>
            </Row>
          </ListGroup.Item>
        </ListGroup>
      </Card>
      <Payment amount={total} />
    </>
  );
};

export default OrderSummary;
