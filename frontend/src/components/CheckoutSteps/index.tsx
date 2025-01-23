import { Nav } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

interface CheckoutStepsProps {
  step1?: boolean;
  step2?: boolean;
  step3?: boolean;
}

const CheckoutSteps: React.FC<CheckoutStepsProps> = ({ step1, step2 }) => {

  return (
    <Nav className="justify-content-center mb-4">


      <Nav.Item>
        {step1 ? (
          <LinkContainer to="/cart/address">
            <Nav.Link>Shipping</Nav.Link>
          </LinkContainer>
        ) : (
          <Nav.Link disabled>Shipping</Nav.Link>
        )}
      </Nav.Item>

      <Nav.Item>
        {step2 ? (
          <LinkContainer to="/placeorder">
            <Nav.Link>Place Order</Nav.Link>
          </LinkContainer>
        ) : (
          <Nav.Link disabled>Place Order</Nav.Link>
        )}
      </Nav.Item>
    </Nav>
  );
};

export default CheckoutSteps;
