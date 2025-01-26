import { Row, Col, ListGroup, Image, Alert, Container } from "react-bootstrap";
import { Link, Navigate, useNavigate } from "react-router-dom";
import CheckoutSteps from "../../components/CheckoutSteps";

import OrderSummary from "../../components/OrderSummary";
import ToggleChoice from "../../components/ToggleChoice";
import { useCart } from "../../store/hooks/cartHooks";
import { useOrder } from "../../store/hooks/orderHooks";
import { useDispatch } from "react-redux";
import { useGetTotalMutation } from "../../store/apis/orderApi";
import { useEffect } from "react";
import { setPrices } from "../../store/slices/orderSlice";
import Loader from "../../components/Loader";
import Payment from "./components/Payment";
import { useTranslation } from "react-i18next";

const PlaceOrderScreen = () => {
  const { t } = useTranslation("order");

  const cart = useCart();
  const { prices, option } = useOrder();

  if (cart.cartItems.length === 0) {
    return <Navigate to={"/"} />;
  }

  const dispatch = useDispatch();
  const { cartItems } = cart;

  const [getTotal, { isLoading }] = useGetTotalMutation();

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

  return (
    <Container>
      <CheckoutSteps step1 step2 />
      <Row>
        <Col md={8}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>{t("details")}</h2>
              <p>
                <strong>{t("address")}:</strong> {cart.shippingAddress?.address}
                , {cart.shippingAddress?.city},{" "}
                {cart.shippingAddress?.postalCode}, {"Canada"}
              </p>
            </ListGroup.Item>
            <ListGroup.Item>
              <h2>{t("items")}</h2>
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
                          <Link to={`/products/${item.id}`}>{item.name}</Link>
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
          <ToggleChoice firstOption="Shipping" secondOption="Pick-up" />
          {option === "Shipping" && (
            <p>
              {t("shippingMessage")}
            </p>
          )}
          {option === "Pick-up" && (
            <p>
              {t("pickUpMessage")}
            </p>
          )}
          {isLoading ? <Loader /> : <OrderSummary {...prices} />}
          {typeof prices.total === "number" ? (
            <Payment amount={prices.total} />
          ) : (
            <Loader />
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default PlaceOrderScreen;
