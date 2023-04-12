import axios from "axios";
import {
  getAllProjectError,
  getAllProjectStart,
  getAllProjectSuccess,
} from "./slice/projectSlice";

export const getAllProject = async (accessToken: string, dispatch: any) => {
  dispatch(getAllProjectStart());
  try {
    const res = await axios.get(`https://X10-server.onrender.com/project/all`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    dispatch(getAllProjectSuccess(res.data));
  } catch (error) {
    dispatch(getAllProjectError());
  }
};
