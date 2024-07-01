import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CartItem } from '../interfaces/cartInterfaces';

interface CartState {
  cartItems: Record<number, CartItem>;
}

const initialState: CartState = {
  cartItems: {},
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
    },
    removeItemFromCart: (state, action: PayloadAction<number>) => {
      const productId = action.payload;
      delete state.cartItems[productId];
    },
    updateItemQty: (state, action: PayloadAction<{ productId: number; qty: number }>) => {
      const { productId, qty } = action.payload;
      if (state.cartItems[productId]) {
        state.cartItems[productId].qty = qty;
      }
    },
    clearCart: (state) => {
      state.cartItems = {};
    },
  },
});

export const { addItemToCart, removeItemFromCart, updateItemQty, clearCart } = cartSlice.actions;

export default cartSlice.reducer;