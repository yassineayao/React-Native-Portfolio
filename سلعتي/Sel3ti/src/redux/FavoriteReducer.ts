import { AnyAction } from "redux";
import { TOrderItem } from "../types";
import { ADD_FAVORITE, DELETE_FAVORITE } from "./actions";

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
  switch (action.type) {
    case ADD_FAVORITE:
      return {
        ...state,
        items: [...state.items, action.payload.favorite],
      };
    case DELETE_FAVORITE:
      return {
        ...state,
        items: [
          ...state.items.filter(
            (favorite) => favorite.id != action.payload.favorite.id
          ),
        ],
      };
    default:
      return state;
  }
};
