interface Review {
  id: number;
  user: number;
  name: string;
  rating: number;
  comment: string;
  created_at: string;
}

export interface ProductState {
  id: number; 
  name: string;
  image: string;
  category: string;
  description: string;
  rating: number;
  price: number;
  count_in_stock: number;
  num_reviews: number;
  reviews: Review[];
}
