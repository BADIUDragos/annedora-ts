import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  CartItem,
  CartState,
  ShippingAddress,
} from "../interfaces/cartInterfaces";

function loadFromLocalStorage<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error loading ${key} from local storage:`, error);
    return defaultValue;
  }
}

function saveToLocalStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving ${key} to local storage:`, error);
  }
}

const initialState: CartState = {
  cartItems: loadFromLocalStorage<CartItem[]>('cartItems', []),
  shippingAddress: loadFromLocalStorage<ShippingAddress>('shippingAddress', {address: "", city: "", postalCode: ""}),
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItemToCart(state, action: PayloadAction<CartItem>) {
      const existingIndex = state.cartItems.findIndex(item => item.id === action.payload.id);
      if (existingIndex !== -1) {
        state.cartItems[existingIndex].qty += action.payload.qty;
      } else {
        state.cartItems.push({ ...action.payload });
      }
      saveToLocalStorage('cartItems', state.cartItems);
    },
    removeItemFromCart(state, action: PayloadAction<number>) {
      state.cartItems = state.cartItems.filter(item => item.id !== action.payload);
      saveToLocalStorage('cartItems', state.cartItems);
    },
    updateItemQty(state, action: PayloadAction<{ productId: number; qty: number }>) {
      const index = state.cartItems.findIndex(item => item.id === action.payload.productId);
      if (index !== -1) {
        state.cartItems[index].qty = action.payload.qty;
      }
      saveToLocalStorage('cartItems', state.cartItems);
    },
    clearCart(state) {
      state.cartItems = [];
      saveToLocalStorage('cartItems', state.cartItems);
    },
    saveShippingAddress(state, action: PayloadAction<ShippingAddress>) {
      state.shippingAddress = action.payload;
      saveToLocalStorage('shippingAddress', state.shippingAddress);
    },
  },
});

export const { addItemToCart, removeItemFromCart, updateItemQty, clearCart, saveShippingAddress } = cartSlice.actions;

export default cartSlice.reducer;
