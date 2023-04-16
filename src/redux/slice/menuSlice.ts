import { createSlice } from "@reduxjs/toolkit";

export const menuSlice = createSlice({
  name: "auth",
  initialState: {
    status: false,
  },
  reducers: {
    changeMenu(state) {
      state.status = !state.status;
    },
  },
});

export const { changeMenu } = menuSlice.actions;
