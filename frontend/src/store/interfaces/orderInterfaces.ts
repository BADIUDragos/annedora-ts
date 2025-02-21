import { UserInfoState } from "./authInterfaces";
import { CartItem, ShippingAddress } from "./cartInterfaces";

export interface Prices {
  subtotal: number | undefined;
  tax: number | undefined;
  shipping: number | undefined;
  total: number | undefined;
}

export type DeliveryPickupInterface = "Shipping" | "Pick-up";

export interface OrderState {
  prices: Prices;
  option: DeliveryPickupInterface;
}

export interface OrderCreationRequest {
  order: OrderState;
  orderItems: CartItem[];
  shippingAddress: ShippingAddress | null;
}

export interface CreatedOrderItem {
  id: number;
  image: string;
  name: string;
  french_name: string;
  order: number;
  price: number;
  product: number;
  qty: number;
}

export interface CreatedOrder {
  id: number;
  user: UserInfoState;
  subtotal: number;
  tax_price: number;
  shipping_price: number;
  total_price: number;
  is_paid: boolean;
  paid_at: string;
  is_shipped: boolean;
  shipped_date: string | null;
  is_delivered: boolean;
  delivered_at: string | null;
  order_items: CreatedOrderItem[];
  shipping_address: ShippingAddress;
  order_option: DeliveryPickupInterface;
}
