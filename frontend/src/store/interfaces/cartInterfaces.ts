import { ProductState } from './productInterfaces';

export interface CartItem extends Omit<ProductState, 'category' | 'description' | 'rating' | 'num_reviews' | 'reviews'> {
  qty: number;
}