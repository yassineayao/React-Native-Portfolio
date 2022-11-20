import AsyncStorage from "@react-native-async-storage/async-storage";
import { createSlice } from "@reduxjs/toolkit";
import { TOrderItem } from "../../types";

interface TState {
  items: TOrderItem[];
}

const initFavoriteState: TState = {
  items: [],
};

export const favoritesSlice = createSlice({
  name: "favorites",
  initialState: initFavoriteState,
  reducers: {
    restoreFavorites: (state, action) => {
      state.items = action.payload;
      console.log(action.payload);
    },
    AddFavorite: (state, action) => {
      state.items.push(action.payload);
      AsyncStorage.setItem("Favorites", JSON.stringify(state.items));
    },
    removeFavorite: (state, action) => {
      state.items = state.items.filter(
        (favorite) => favorite.id !== action.payload.id
      );
      AsyncStorage.setItem("Favorites", JSON.stringify(state.items));
    },
  },
});

export const { restoreFavorites, AddFavorite, removeFavorite } =
  favoritesSlice.actions;

export default favoritesSlice.reducer;
