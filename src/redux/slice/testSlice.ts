import { createSlice } from '@reduxjs/toolkit';

export const testSlice = createSlice({
  name: "test",
  initialState: {
    name: "",
  },
  reducers: {
    addTest: (state, action) => {
      state.name = action.payload;
    },
  },
});

export const { addTest } = testSlice.actions;
