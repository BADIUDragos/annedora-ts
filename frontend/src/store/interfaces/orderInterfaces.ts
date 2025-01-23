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
  prices: Prices 
  option: DeliveryPickupInterface
}

export interface OrderCreationRequest {
  order: OrderState;
  orderItems: CartItem[];
  shippingAddress: ShippingAddress | null;
}

export interface CreatedOrderItem {
  id: number;
  product: {
    id: number;
    name: string;
    image: string;
    price: string;
  };
  qty: number;
}

export interface CreatedOrder {
  id: number;
  user: UserInfoState;
  subtotal: string;
  tax_price: string;
  shipping_price: string;
  total_price: string;
  is_paid: boolean;
  paid_at: string | null;
  is_shipped: boolean;
  shipped_date: string | null;
  is_delivered: boolean;
  delivered_at: string | null;
  order_items: CreatedOrderItem[];
  shipping_address: ShippingAddress | null;
}