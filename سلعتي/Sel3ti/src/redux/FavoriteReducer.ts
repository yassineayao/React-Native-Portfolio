import AsyncStorage from "@react-native-async-storage/async-storage";
import { AnyAction } from "redux";
import { TOrderItem } from "../types";
import { ADD_FAVORITE, DELETE_FAVORITE, RESTORE_FAVORITES } from "./actions";

interface TState {
  items: TOrderItem[];
}

export const initFavoriteState: TState = {
  items: [],
};

export const Favorite = (
  state: TState = initFavoriteState,
  action: AnyAction
) => {
  let res = state;
  switch (action.type) {
    case ADD_FAVORITE:
      res = {
        ...state,
        items: [...state.items, action.payload.favorite],
      };
      break;
    case DELETE_FAVORITE:
      res = {
        ...state,
        items: [
          ...state.items.filter(
            (favorite) => favorite.id != action.payload.favorite.id
          ),
        ],
      };
      break;
    case RESTORE_FAVORITES:
      return { ...action.payload.favorite };
    default:
      return state;
  }

  AsyncStorage.setItem("Favorites", JSON.stringify(res));
  return res;
};
