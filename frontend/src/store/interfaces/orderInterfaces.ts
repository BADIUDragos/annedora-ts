import { CartItem, ShippingAddress } from "./cartInterfaces";

export interface Prices {
  subtotal: number | undefined;
  tax: number | undefined;
  shipping: number | undefined;
  total: number | undefined;
}

export type DeliveryPickupInterface = "Shipping" | "Pick-up";

export interface OrderState {
  prices: Prices 
  option: DeliveryPickupInterface
}

export interface OrderCreationRequest {
  order: OrderState;
  orderItems: CartItem[];
  shippingAddress: ShippingAddress | null;
}