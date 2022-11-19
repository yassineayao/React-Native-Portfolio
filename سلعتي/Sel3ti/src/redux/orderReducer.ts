import { TOrderItem } from "../types";
import {
  ADD_ORDER,
  CLEAN_CART,
  RESTORE_ORDERS,
  RMEOVE_ORDER,
  UPDATE_ORDER,
} from "./actions";
import { AnyAction } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface TState {
  items: TOrderItem[];
}

export const initOrderState: TState = {
  items: [],
};

export const Order = (state: TState = initOrderState, action: AnyAction) => {
  let res = state;
  switch (action.type) {
    case ADD_ORDER:
      res = {
        ...state,
        items: [
          ...state.items.filter((item) => item.id != action.payload.order.id),
          action.payload.order,
        ],
      };
      break;
    case UPDATE_ORDER:
      res = {
        ...state,
        items: state.items.map((item) =>
          item.id === action.payload.order.id ? action.payload.order : item
        ),
      };
      break;
    case RMEOVE_ORDER:
      res = {
        ...state,
        items: [
          ...state.items.filter(
            (order) => order.id !== action.payload.order.id
          ),
        ],
      };
      break;
    case CLEAN_CART:
      res = {
        ...state,
        items: [],
      };
      break;
    case RESTORE_ORDERS:
      return {
        ...action.payload.order,
      };
    default:
      return state;
  }

  AsyncStorage.setItem("Cart", JSON.stringify(res));
  return res;
};
