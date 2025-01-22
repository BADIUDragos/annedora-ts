import { useEffect, useState } from "react";
import Loader from "../../../components/Loader";
import CheckoutForm from "./CheckoutForm";


import { loadStripe, Stripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

import { StripePublicKeyInterface, useCreatePaymentIntentMutation, useLazyGetStripePublicKeyQuery } from "../../../store/apis/orderApi";
import { useDispatch } from "react-redux";

interface PaymentInterface {
  amount: number;
}

const Payment: React.FC<PaymentInterface> = ({ amount }) => {

  const dispatch = useDispatch()
  const [stripeFetched, setStripeFetched] = useState(false)
  const [publicKey, setPublicKey] = useState<StripePublicKeyInterface | null>(null);
  const [stripePromise, setStripePromise] = useState<Stripe | null>(null);


  const [clientSecret, setClientSecret] = useState("");
  const [fetchStripeKey] = useLazyGetStripePublicKeyQuery();
  const [createPaymentIntent] = useCreatePaymentIntentMutation();

  useEffect(() => {
    const fetchPublicKey = async () => {
        const publicKey = await fetchStripeKey().unwrap()
        setPublicKey(publicKey)
        setStripeFetched(true)
      }

    if (!stripeFetched) {
      fetchPublicKey()
    }
    
    if (stripeFetched && publicKey && !stripePromise) {
      const loadStripePromise = async () => {
        console.log(publicKey)
        const stripe = await loadStripe(publicKey.stripe_public)
        setStripePromise(stripe)
      }
      loadStripePromise()
    }

    const getClientSecret = async () => {
      if(stripePromise){
        const paymentIntentData = await createPaymentIntent({amount: amount}).unwrap();
        setClientSecret(paymentIntentData.client_secret)
      }
    }

    getClientSecret()

  },[dispatch, amount, stripePromise, publicKey])

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