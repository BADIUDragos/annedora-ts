import React from "react";
import {
  Alert,
  Button,
  Col,
  ListGroup,
  Row,
  Form,
  Card,
  Image,
  Container,
} from "react-bootstrap";
import { NavLink, useNavigate } from "react-router-dom";
import {
  removeItemFromCart,
  updateItemQty,
} from "../../store/slices/cartSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState, useAuth } from "../../store";

const CartPage: React.FC = () => {
  const { userInfo } = useAuth();

  const navigate = useNavigate();
  const cartItems = useSelector((state: RootState) => state.cart.cartItems);
  const dispatch = useDispatch();

  const removeFromCart = (productId: number) => {
    dispatch(removeItemFromCart(productId));
  };

  const updateQty = (productId: number, qty: number) => {
    dispatch(updateItemQty({ productId, qty }));
  };

  const loginHandler = () => {
    navigate("/login");
  };

  const checkoutHandler = () => {
    navigate("/checkout");
  };

  const cartItemsArray = Object.values(cartItems);

  return (
    <Container>
      <Row>
        <Col md={8}>
          <h1>Shopping Cart</h1>
          {cartItemsArray.length === 0 ? (
            <Alert variant="info">
              Your cart is empty! <NavLink to="/">Browse our products</NavLink>
            </Alert>
          ) : (
            <ListGroup variant="flush">
              {cartItemsArray.map((item) => (
                <ListGroup.Item key={item.id}>
                  <Row>
                    <Col md={2}>
                      <Image src={item.image} alt={item.name} fluid rounded />
                    </Col>
                    <Col md={3}>
                      <NavLink to={`/product/${item.id}`}>{item.name}</NavLink>
                    </Col>
                    <Col md={2}>${item.price}</Col>
                    <Col md={3}>
                      <Form.Control
                        as="select"
                        value={item.qty}
                        onChange={(e) =>
                          updateQty(item.id, Number(e.target.value))
                        }
                      >
                        {[...Array(item.count_in_stock).keys()].map((x) => (
                          <option key={x + 1} value={x + 1}>
                            {x + 1}
                          </option>
                        ))}
                      </Form.Control>
                    </Col>
                    <Col md={1}>
                      <Button
                        type="button"
                        variant="light"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <i className="fas fa-trash"></i>
                      </Button>
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h2>
                  Subtotal (
                  {cartItemsArray.reduce((acc, item) => acc + item.qty, 0)})
                  items
                </h2>
                $
                {cartItemsArray
                  .reduce((acc, item) => acc + item.qty * item.price, 0)
                  .toFixed(2)}
              </ListGroup.Item>
            </ListGroup>
          </Card>

          {userInfo ? (
            <Button
              type="button"
              className="btn-block mt-3 w-100"
              disabled={cartItemsArray.length === 0}
              onClick={checkoutHandler}
            >
              CHECKOUT
            </Button>
          ) : (
            <Button
              type="button"
              className="btn-block mt-3 w-100"
              onClick={loginHandler}
            >
              LOGIN
            </Button>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default CartPage;
