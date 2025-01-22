import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { DeliveryPickupInterface, OrderState, Prices } from "../interfaces/orderInterfaces";

const loadStateFromLocalStorage = <T>(key: string, defaultValue: T): T => {
  const savedState = localStorage.getItem(key);
  return savedState ? JSON.parse(savedState) : defaultValue;
};

const saveStateToLocalStorage = (key: string, value: any) => {
  localStorage.setItem(key, JSON.stringify(value));
};

const initialState: OrderState = {
  option: loadStateFromLocalStorage<DeliveryPickupInterface>("option", "Pick-up"),
  prices: {
    subtotal: undefined,
    tax: undefined,
    shipping: undefined,
    total: undefined,
  },
};

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    setOrderOption: (state, action: PayloadAction<DeliveryPickupInterface>) => {
      state.option = action.payload;
      saveStateToLocalStorage("option", state.option);
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
