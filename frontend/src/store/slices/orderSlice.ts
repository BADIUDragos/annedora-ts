import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { DeliveryPickupInterface, Prices } from "../interfaces/orderInterfaces";

interface OrderState {
  orderOption: DeliveryPickupInterface;
  prices: Prices;
}

const loadStateFromLocalStorage = <T>(key: string, defaultValue: T): T => {
  const savedState = localStorage.getItem(key);
  return savedState ? JSON.parse(savedState) : defaultValue;
};

const saveStateToLocalStorage = (key: string, value: any) => {
  localStorage.setItem(key, JSON.stringify(value));
};

const initialState: OrderState = {
  orderOption: loadStateFromLocalStorage<DeliveryPickupInterface>("orderOption", "Pick-up"),
  prices: {
    subtotal: 0,
    tax: 0,
    shipping: 0,
    total: 0,
  },
};

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    setOrderOption: (state, action: PayloadAction<DeliveryPickupInterface>) => {
      state.orderOption = action.payload;
      saveStateToLocalStorage("orderOption", state.orderOption);
    },
    setPrices: (state, action: PayloadAction<Prices>) => {
      state.prices = action.payload;
    },
    resetOrder: (state) => {
      state.prices = initialState.prices;
    },
  },
});

export const { setOrderOption, setPrices, resetOrder } = orderSlice.actions;

export default orderSlice.reducer;
