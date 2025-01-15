import { CartItem, ShippingAddress } from "./cartInterfaces";

export interface Prices {
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
}

export type DeliveryPickupInterface = "Shipping" | "Pick-up";

export interface OrderState {
  order: Prices
  option: DeliveryPickupInterface
}

export interface OrderCreationRequest {
  orderItems: CartItem[];
  itemsPrice: number;
  taxPrice: number;
  shippingPrice: number;
  totalPrice: number;
  orderOption: string;
  shippingAddress: ShippingAddress | null;
}