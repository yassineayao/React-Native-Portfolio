import { configureStore } from "@reduxjs/toolkit";
import homeScreenReducer from "./HomeScreenSlice";

const store = configureStore({
  reducer: homeScreenReducer,
});

export default store;
