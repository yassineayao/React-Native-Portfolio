import { configureStore } from "@reduxjs/toolkit";
import { Order } from "./reducers";

export const Store = configureStore({
  reducer: {
    order: Order,
  },
});
