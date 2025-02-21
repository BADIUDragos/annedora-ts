import { useState } from "react";
import { Form, Button, OverlayTrigger, Tooltip } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import FormContainer from "../../components/FormContainer";
import CheckoutSteps from "../../components/CheckoutSteps";
import { saveShippingAddress } from "../../store/slices/cartSlice";
import { RootState } from "../../store";
import { useTranslation } from "react-i18next";

const ShippingPage = () => {
  const { t } = useTranslation("shipping");

  const navigate = useNavigate();
  const shippingAddress = useSelector(
    (state: RootState) => state.cart.shippingAddress
  );

  const dispatch = useDispatch();

  const [address, setAddress] = useState(shippingAddress?.address || "");
  const [city, setCity] = useState(shippingAddress?.city || "");
  const [postalCode, setPostalCode] = useState(
    shippingAddress?.postalCode || ""
  );

  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(saveShippingAddress({ address, city, postalCode }));
    navigate("/placeorder");
  };

  return (
    <FormContainer xs={12} md={6} className="justify-content-md-center">
      <CheckoutSteps step1 />
      <h1>{t("title")}</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group controlId="address">
          <Form.Label>{t("address")}:</Form.Label>
          <Form.Control
            required
            type="text"
            placeholder={t("address")}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId="city" className="mt-3">
          <Form.Label>{t("city")}:</Form.Label>
          <Form.Control
            required
            type="text"
            placeholder={t("city")}
            value={city}
            onChange={(e) => setCity(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId="postalCode" className="mt-3">
          <Form.Label>{t("postalCode")}:</Form.Label>
          <Form.Control
            required
            type="text"
            placeholder={t("postalCode")}
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId="country" className="mt-3">
          <Form.Label>{t("country")}</Form.Label>
          <OverlayTrigger
            placement="right"
            overlay={<Tooltip id="shipping-tooltip">{t("onlyCanada")}</Tooltip>}
          >
            <Form.Control disabled value={"Canada"} type="text" />
          </OverlayTrigger>
        </Form.Group>

        <Button type="submit" variant="primary" className="mt-3 w-100">
          {t("continue")}
        </Button>
      </Form>
    </FormContainer>
  );
};

export default ShippingPage;
