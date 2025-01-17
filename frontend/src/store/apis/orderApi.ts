import { CartItemMinimal } from "../interfaces/cartInterfaces";
import { OrderCreationRequest, Prices } from "../interfaces/orderInterfaces";
import { orderTag } from "./apiTagTypes";
import { baseApi } from "./baseApi";

interface TotalPricesRequest {
  items: CartItemMinimal[];
  option: string;
}

const orderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTotal: builder.mutation<Prices, TotalPricesRequest>({
      query: (data) => ({
        url: "base/orders/total/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [orderTag],
    }),
    getStripePublicKey: builder.query<{ stripePublicKey: string }, void>({
      query: () => ({
        url: "base/orders/stripe/",
        method: "GET",
      }),
    }),
    createPaymentIntent: builder.mutation<{ client_secret: string }, { amount: number }>({
      query: (data) => ({
        url: "base/orders/payment-intent/",
        method: "POST",
        body: data,
      }),
    }),
    createOrder: builder.mutation<any, OrderCreationRequest>({
      query: (orderData) => ({
        url: "base/orders/",
        method: "POST",
        body: orderData,
      }),
    }),
  }),
});

export const { useGetTotalMutation, useGetStripePublicKeyQuery, useCreatePaymentIntentMutation, useCreateOrderMutation } = orderApi;
