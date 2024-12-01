import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CartItem } from '../interfaces/cartInterfaces';

interface ShippingAddress {
  address: string;
  city: string;
  postalCode: string;
}

interface CartState {
  cartItems: Record<number, CartItem>;
  shippingAddress: ShippingAddress | null;
}

const loadStateFromLocalStorage = <T>(key: string): T | null => {
  const savedState = localStorage.getItem(key);
  return savedState ? JSON.parse(savedState) : null;
};

const saveCartToLocalStorage = (cartItems: Record<number, CartItem>) => {
  localStorage.setItem('cart', JSON.stringify(cartItems));
};

const initialState: CartState = {
  cartItems: loadStateFromLocalStorage<Record<number, CartItem>>('cartItems') || {},
  shippingAddress: loadStateFromLocalStorage<ShippingAddress>('shippingAddress'),
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
    saveShippingAddress: (state, action: PayloadAction<ShippingAddress>) => {
      state.shippingAddress = action.payload;
      localStorage.setItem('shippingAddress', JSON.stringify(action.payload));
    },
  },
});

export const { addItemToCart, removeItemFromCart, updateItemQty, clearCart, saveShippingAddress } = cartSlice.actions;

export default cartSlice.reducer;