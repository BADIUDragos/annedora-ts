import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CartItem } from '../interfaces/cartInterfaces';

interface CartState {
  cartItems: Record<number, CartItem>;
}

const loadCartFromLocalStorage = (): Record<number, CartItem> => {
  const savedCart = localStorage.getItem('cart');
  return savedCart ? JSON.parse(savedCart) : {};
};

const saveCartToLocalStorage = (cartItems: Record<number, CartItem>) => {
  localStorage.setItem('cart', JSON.stringify(cartItems));
};

const initialState: CartState = {
  cartItems: loadCartFromLocalStorage(),
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItemToCart: (state, action: PayloadAction<CartItem>) => {
      const item = action.payload;
      if (state.cartItems[item.id]) {
        state.cartItems[item.id].qty += item.qty;
      } else {
        state.cartItems[item.id] = item;
      }
      saveCartToLocalStorage(state.cartItems);
    },
    removeItemFromCart: (state, action: PayloadAction<number>) => {
      const productId = action.payload;
      delete state.cartItems[productId];
      saveCartToLocalStorage(state.cartItems);
    },
    updateItemQty: (state, action: PayloadAction<{ productId: number; qty: number }>) => {
      const { productId, qty } = action.payload;
      if (state.cartItems[productId]) {
        state.cartItems[productId].qty = qty;
      }
      saveCartToLocalStorage(state.cartItems);
    },
    clearCart: (state) => {
      state.cartItems = {};
      saveCartToLocalStorage(state.cartItems);
    },
  },
});

export const { addItemToCart, removeItemFromCart, updateItemQty, clearCart } = cartSlice.actions;

export default cartSlice.reducer;