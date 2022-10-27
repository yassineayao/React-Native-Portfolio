import { createSlice } from "@reduxjs/toolkit";

const initialState: homeScreenState = {
  value: 0,
};

const homeScreenSlice = createSlice({
  name: "homeScreen",
  initialState,
  reducers: {
    increment: (state, action) => {
      console.log(action)
      state.value += 1;
    },
  },
});

export interface homeScreenState {
  value: number;
}

export const { increment } = homeScreenSlice.actions;

export default homeScreenSlice.reducer;
