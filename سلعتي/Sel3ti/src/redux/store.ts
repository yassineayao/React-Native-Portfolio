import { configureStore } from "@reduxjs/toolkit";
import { Favorite } from "./FavoriteReducer";
import { Order } from "./orderReducer";

export const Store = configureStore({
  reducer: {
    order: Order,
    favorite: Favorite,
  },
});
