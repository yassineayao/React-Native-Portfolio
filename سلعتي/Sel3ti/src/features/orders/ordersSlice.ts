import AsyncStorage from "@react-native-async-storage/async-storage";
import { createSlice } from "@reduxjs/toolkit";
import { TOrderItem } from "../../types";

interface TState {
  items: TOrderItem[];
}

export const initOrderState: TState = {
  items: [],
};

const ordersSlice = createSlice({
  name: "orders",
  initialState: initOrderState,
  reducers: {
    restoreOrders: (state, action) => {
      state.items = action.payload;
    },
    addOrder: (state, action) => {
      state.items.push(action.payload);
      AsyncStorage.setItem("Cart", JSON.stringify(state.items));
    },
    updateItemQuantity: (state, action) => {
      const order = state.items.find((item) => item.id === action.payload.id);
      if (order?.quantity) order.quantity = action.payload.quantity;
      AsyncStorage.setItem("Cart", JSON.stringify(state.items));
    },
    removeOrder: (state, action) => {
      state.items = state.items.filter((item) => item.id != action.payload.id);
      AsyncStorage.setItem("Cart", JSON.stringify(state.items));
    },
    clearOrders: (state) => {
      state.items = [];
      AsyncStorage.removeItem("Cart");
    },
  },
});

export const {
  restoreOrders,
  addOrder,
  updateItemQuantity,
  removeOrder,
  clearOrders,
} = ordersSlice.actions;

export default ordersSlice.reducer;
