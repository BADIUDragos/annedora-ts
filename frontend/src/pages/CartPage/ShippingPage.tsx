import { useState, useEffect } from "react";
import { Form, Button, OverlayTrigger, Tooltip } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import FormContainer from "../../components/FormContainer";
import CheckoutSteps from "../../components/CheckoutSteps";
import { saveShippingAddress } from "../../store/slices/cartSlice";
import { RootState } from "../../store";

const ShippingPage = () => {
  const navigate = useNavigate();
  const shippingAddress = useSelector((state: RootState) => state.cart.shippingAddress);

  const dispatch = useDispatch();

  const [address, setAddress] = useState(shippingAddress?.address || "");
  const [city, setCity] = useState(shippingAddress?.city || "");
  const [postalCode, setPostalCode] = useState(shippingAddress?.postalCode || "");

  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(saveShippingAddress({ address, city, postalCode }));
    navigate("/placeorder");
  };

  return (
    <FormContainer xs={12} md={6} className="justify-content-md-center">
      <CheckoutSteps step1 step2 />
      <h1>Billing / Shipping Address</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group controlId="address">
          <Form.Label>Address:</Form.Label>
          <Form.Control
            required
            type="text"
            placeholder="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId="city" className="mt-3">
          <Form.Label>City:</Form.Label>
          <Form.Control
            required
            type="text"
            placeholder="City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId="postalCode" className="mt-3">
          <Form.Label>Postal Code:</Form.Label>
          <Form.Control
            required
            type="text"
            placeholder="Postal Code"
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId="country" className="mt-3">
          <Form.Label>Country:</Form.Label>
          <OverlayTrigger
            placement="right"
            overlay={
              <Tooltip id="shipping-tooltip">
                We're only shipping within Canada momentarily
              </Tooltip>
            }
          >
            <Form.Control disabled value={"Canada"} type="text" />
          </OverlayTrigger>
        </Form.Group>

        <Button type="submit" variant="primary" className="mt-3 w-100">
          Continue
        </Button>
      </Form>
    </FormContainer>
  );
};

export default ShippingPage;