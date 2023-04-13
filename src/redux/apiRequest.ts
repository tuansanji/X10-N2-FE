import axios from "axios";
import {
  getAllProjectError,
  getAllProjectStart,
  getAllProjectSuccess,
} from "./slice/projectSlice";

export const getAllProject = async (accessToken: string, dispatch: any) => {
  dispatch(getAllProjectStart());
  console.log(process.env.REACT_APP_BACKEND_URL);
  try {
    const res = await axios.get(`https://X10-server.onrender.com/project/all`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    dispatch(getAllProjectSuccess(res.data));
  } catch (error) {
    dispatch(getAllProjectError());
  }
};
