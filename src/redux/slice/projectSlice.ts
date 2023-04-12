import { createSlice } from "@reduxjs/toolkit";
interface ProjectState {
  listProject: object[];
  isFetching: boolean;
  error: boolean;
}
export const projectSlice = createSlice({
  name: "project",
  initialState: {
    listProject: [],
    isFetching: false,
    error: false,
  } as ProjectState,
  reducers: {
    getAllProjectStart: (state) => {
      state.isFetching = true;
    },
    getAllProjectSuccess: (state, action) => {
      state.listProject = action.payload;

      state.isFetching = false;
      state.error = false;
    },
    getAllProjectError: (state) => {
      state.isFetching = false;
      state.error = true;
    },
  },
});

export const { getAllProjectStart, getAllProjectSuccess, getAllProjectError } =
  projectSlice.actions;
