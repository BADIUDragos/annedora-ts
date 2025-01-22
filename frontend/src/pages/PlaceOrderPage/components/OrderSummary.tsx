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
  const { subtotal, shipping, tax, total } = prices;
  const [getTotal, {isLoading}] = useGetTotalMutation();

  useEffect(() => {
    const fetchTotal = async () => {
      const items = cartItems.map((item) => ({
        id: item.id,
        qty: item.qty,
      }));
  
      try {
        const fetchedPrices = await getTotal({ items, option }).unwrap();
        dispatch(setPrices(fetchedPrices));
      } catch (error) {
        console.error("Failed to fetch prices:", error);
      }
    };
  
    fetchTotal();
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
      {typeof total === 'number' ? <Payment amount={total} /> : <Loader />}
    </>
  );
};

export default OrderSummary;
