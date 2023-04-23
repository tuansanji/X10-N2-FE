import { createSlice } from "@reduxjs/toolkit";

// interface queryParamsTypes {
//   currentTab: string;
//   currentPage: string;
// }

const initialState: any = {};

export const queryParamsSlice = createSlice({
  name: "queryParams",
  initialState,
  reducers: {
    setQuery: (state, action) => {
      return action.payload;
    },
  },
});

export const { setQuery } = queryParamsSlice.actions;

export default queryParamsSlice.reducer;
