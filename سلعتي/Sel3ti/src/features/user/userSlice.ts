import { createSlice } from "@reduxjs/toolkit";
import { TUser } from "../../types";

const initState = {
  info: {} as TUser,
};

const userSlice = createSlice({
  name: "user",
  initialState: initState,
  reducers: {
    setUser: (state, action) => {
      state.info = action.payload;
    },
  },
});

export const { setUser } = userSlice.actions;

export default userSlice.reducer;
