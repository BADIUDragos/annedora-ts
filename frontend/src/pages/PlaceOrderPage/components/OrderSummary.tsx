import { Row, Col, ListGroup, Card, Alert } from "react-bootstrap";
import { useSelector } from "react-redux";
import Loader from "../../../components/Loader";

import Payment from './Payment'

const OrderSummary = (props) => {
    
    const { error, loading, prices } = useSelector((state) => state.orderTotal);
    const { subtotal = 0, shipping = 0, tax = 0, total = 0 } = prices || {};
  
    if (loading) return <Loader />;
    if (error) return <Alert variant="danger">{error}</Alert>;
  
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
        <Payment amount={total}/>
      </>
    );
  }

  export default OrderSummary