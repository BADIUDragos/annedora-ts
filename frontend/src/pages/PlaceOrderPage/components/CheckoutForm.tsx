import React, { useState } from "react";
import { PaymentElement } from "@stripe/react-stripe-js";
import { Form, Button, Alert } from "react-bootstrap";
import { useStripe, useElements } from "@stripe/react-stripe-js";
import { useNavigate } from "react-router-dom";
import { useCreateOrderMutation } from "../../../store/apis/orderApi";
import { useCart } from "../../../store/hooks/cartHooks";
import { useOrder } from "../../../store/hooks/orderHooks";
import { OrderCreationRequest } from "../../../store/interfaces/orderInterfaces";
import { useDispatch } from "react-redux";
import { resetOrder } from "../../../store/slices/orderSlice";
import { clearCart } from "../../../store/slices/cartSlice";

const CheckoutForm = () => {
  const { cartItems, shippingAddress } = useCart();
  const order = useOrder();
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [createOrder] = useCreateOrderMutation();

  const [message, setMessage] = useState<string | null | undefined>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const dispatch = useDispatch()

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {},
      redirect: 'if_required'
    });

    if (error) {
      setMessage(error.message);
      setIsProcessing(false);
      return;
    }

    const orderData: OrderCreationRequest = {
      order: order,
      orderItems: cartItems,
      shippingAddress: shippingAddress,
    };

    try {
      const result = await createOrder(orderData).unwrap();
      dispatch(clearCart())
      dispatch(resetOrder())
      navigate(`/order/${result._id}`);
    } catch (error: any) {
      setMessage(error.data ? error.data.message : error.message);
      setIsProcessing(false);
    }
  };

  return (
    <Form id="payment-form" onSubmit={handleSubmit}>
      <PaymentElement id="payment-element" />
      <Button disabled={isProcessing || !stripe || !elements} id="submit" className="mt-3 w-100" type="submit">
        {isProcessing ? "Processing ..." : "Pay now"}
      </Button>
      {message && <Alert className="mt-3" variant="info">{message}</Alert>}
    </Form>
  );
}

export default CheckoutForm;