import { configureStore } from "@reduxjs/toolkit";
import favoriteReducer from "../features/favorites/favoritesSlice";
import orderReducer from "../features/orders/ordersSlice";
import userReducer from "../features/user/userSlice";

export const Store = configureStore({
  reducer: {
    order: orderReducer,
    favorite: favoriteReducer,
    user: userReducer,
  },
});
