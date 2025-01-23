import { CartItemMinimal } from "../interfaces/cartInterfaces";
import { CreatedOrder, OrderCreationRequest, Prices } from "../interfaces/orderInterfaces";
import { orderTag } from "./apiTagTypes";
import { baseApi } from "./baseApi";

interface TotalPricesRequest {
  items: CartItemMinimal[];
  option: string;
}

export interface PaymentIntentAmountInterface {
  amount : number
}

export interface StripePublicKeyInterface {
  stripe_public: string
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
    getStripePublicKey: builder.query<StripePublicKeyInterface, void>({
      query: () => ({
        url: "base/orders/stripe/",
        method: "GET",
      }),
    }),
    createPaymentIntent: builder.mutation<{ client_secret: string }, PaymentIntentAmountInterface>({
      query: (data) => ({
        url: "base/orders/payment-intent/",
        method: "POST",
        body: data,
      }),
    }),
    createOrder: builder.mutation<any, OrderCreationRequest>({
      query: (orderData) => ({
        url: "base/orders/add/",
        method: "POST",
        body: orderData,
      }),
    }),
    getMyOrders: builder.query<CreatedOrder[], void >({
      query: () => ({
        url: "base/orders/myorders/",
        method: "GET",
      }),
    }),
    getOrderById: builder.query<CreatedOrder, number>({
      query: (id) => `base/orders/${id}/`,
      providesTags: (result, error, id) => [{ type: orderTag, id }],
    }),
    markOrderAsShipped: builder.mutation<void, number>({
      query: (id) => ({
        url: `base/orders/${id}/shipped/`,
        method: "PUT",
      }),
      invalidatesTags: (result, error, id) => [{ type: orderTag, id }],
    }),
    markOrderAsDelivered: builder.mutation<void, number>({
      query: (id) => ({
        url: `base/orders/${id}/delivered/`,
        method: "PUT",
      }),
      invalidatesTags: (result, error, id) => [{ type: orderTag, id }],
    }),
  }),
});

export const { useGetTotalMutation, useLazyGetStripePublicKeyQuery, useCreatePaymentIntentMutation, useCreateOrderMutation, useGetMyOrdersQuery, useGetOrderByIdQuery, useMarkOrderAsShippedMutation, useMarkOrderAsDeliveredMutation } = orderApi;
