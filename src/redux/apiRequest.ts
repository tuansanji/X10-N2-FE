import { AnyAction, Dispatch } from "@reduxjs/toolkit";
import axios from "axios";
import _ from "lodash";
import {
  getAllProjectError,
  getAllProjectStart,
  getAllProjectSuccess,
} from "./slice/projectSlice";

export const getAllProject = async (
  accessToken: string,
  dispatch: Dispatch<AnyAction>
) => {
  dispatch(getAllProjectStart());

  try {
    const res = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}/project/all`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
    dispatch(getAllProjectSuccess(res.data));
  } catch (error) {
    dispatch(getAllProjectError());
  }
};
