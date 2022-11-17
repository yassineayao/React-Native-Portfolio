import { TOrderItem } from "../types";
import {
  ADD_ORDER,
  CLEAN_CART,
  RMEOVE_ORDER,
  UPDATE_ORDER,
} from "./actions";
import { AnyAction } from "@reduxjs/toolkit";

interface TState {
  items: TOrderItem[];
}

export const initOrderState: TState = {
  items: [],
};

export const Order = (state: TState = initOrderState, action: AnyAction) => {
  switch (action.type) {
    case ADD_ORDER:
      return {
        ...state,
        items: [
          ...state.items.filter((item) => item.id != action.payload.order.id),
          action.payload.order,
        ],
      };
    case UPDATE_ORDER:
      const items = state.items.filter(
        (order) => order.id !== action.payload.order.id
      );
      return {
        ...state,
        items: [...items, action.payload.order],
      };
    case RMEOVE_ORDER:
      return {
        ...state,
        items: [
          ...state.items.filter(
            (order) => order.id !== action.payload.order.id
          ),
        ],
      };
    case CLEAN_CART:
      return {
        ...state,
        items: [],
      };
    default:
      return state;
  }
};
