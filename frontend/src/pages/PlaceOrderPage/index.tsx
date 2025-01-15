import { Row, Col, ListGroup, Image, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import CheckoutSteps from "../../components/CheckoutSteps";

import OrderSummary from './components/OrderSummary'
import ToggleChoice from '../../components/ToggleChoice'
import { useCart } from "../../store/hooks/cartHooks";
import { useOrder } from "../../store/hooks/orderHooks";


const PlaceOrderScreen = () => {
  const cart = useCart()
  const selectedOption = useOrder()

  return (
    <div>
      <CheckoutSteps step1 step2 step3 step4 />
      <Row>
        <Col md={8}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>Billing / Shipping</h2>
              <p>
                <strong>Address:</strong>
                {cart.shippingAddress?.address}, {cart.shippingAddress?.city},
                {"   "}
                {cart.shippingAddress?.postalCode},{"   "}
                {"Canada"}
              </p>
            </ListGroup.Item>
            <ListGroup.Item>
              <h2>Order Items</h2>
              {cart.cartItems.length === 0 ? (
                <Alert variant="info">Your cart is empty</Alert>
              ) : (
                <ListGroup variant="flush">
                  {cart.cartItems.map((item, index) => (
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
                          <Link to={`/product/${item.id}`}>
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
          <ToggleChoice
            firstOption="Shipping"
            secondOption="Pick-up"
          />
          {selectedOption === "Shipping" && 
            <p>*A shipping fee of 15$ is applied for orders under 100$, we only ship within the Montreal metropolitan area.</p>
          }
          {selectedOption === "Pick-up" && 
            <p>*Pick-up is in the Chateauguay area, the exact address will be emailed upon purchase confirmation.</p>
          }
          <OrderSummary cart={cart} orderOption={selectedOption} />
        </Col>
      </Row>
    </div>
  );
}

export default PlaceOrderScreen;
