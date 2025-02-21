import { ProductState } from './productInterfaces';

export interface ShippingAddress {
  address: string;
  city: string;
  postalCode: string;
}

export interface CartState {
  cartItems: CartItem[];
  shippingAddress: ShippingAddress | null;
}

export interface CartItemMinimal {
  id: number;
  qty: number;
}

export interface CartItem extends Omit<ProductState, 'category' | 'description' | 'rating' | 'num_reviews' | 'reviews' | "french_name" | "french_description"> {
  qty: number;
}