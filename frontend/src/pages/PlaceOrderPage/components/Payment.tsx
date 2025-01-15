import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../../components/Loader";
import CheckoutForm from "../../../components/CheckoutForm";


import { loadStripe, Stripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

import { useCreatePaymentIntentMutation, useGetStripePublicKeyQuery } from "../../../store/apis/orderApi";

interface PaymentInterface {
  amount: number;
}

const Payment: React.FC<PaymentInterface> = ({ amount }) => {
  const [stripePromise, setStripePromise] = useState<Stripe | null>(null);
  const [clientSecret, setClientSecret] = useState("");
  const { data: stripeData, isSuccess } = useGetStripePublicKeyQuery();
  const [createPaymentIntent, { data: paymentIntentData }] = useCreatePaymentIntentMutation();

  useEffect(() => {
    // Load Stripe as soon as the public key is successfully fetched
    if (stripeData?.stripePublicKey && isSuccess && !stripePromise) {
      const initializeStripe = async () => {
        const stripe = await loadStripe(stripeData.stripePublicKey);
        setStripePromise(stripe);
      };

      initializeStripe();
    }
  }, [stripeData, isSuccess, stripePromise]);

  useEffect(() => {
    // Create payment intent once Stripe is initialized
    const initializePaymentIntent = async () => {
      if (stripePromise) {
        try {
          const paymentIntentData = await createPaymentIntent({ amount }).unwrap();
          setClientSecret(paymentIntentData.client_secret);
        } catch (error) {
          console.error('Failed to create payment intent:', error);
        }
      }
    };

    initializePaymentIntent();
  }, [createPaymentIntent, stripePromise, amount]);

  return (
    <>
      <h2>Payment</h2>
      {!clientSecret && <Loader />}
      {stripePromise && clientSecret && (
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <CheckoutForm />
        </Elements>
      )}
    </>
  );
};

export default Payment;