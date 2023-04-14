import { setToken } from "./slice/authSlice";
import { AnyAction, Dispatch } from "@reduxjs/toolkit";
import { NotificationInstance } from "antd/es/notification/interface";
import axios from "axios";
import { NavigateFunction } from "react-router-dom";
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
  console.log(process.env.BACKEND_URL);
  try {
    const res = await axios.get(`https://X10-server.onrender.com/project/all`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    dispatch(getAllProjectSuccess(res.data));
  } catch (error) {
    dispatch(getAllProjectError());
  }
};

export const requestLogin = async (
  reqBody: any,
  dispatch: Dispatch<AnyAction>,
  apiNoti: NotificationInstance,
  navigate: NavigateFunction
) => {
  try {
    const response = await axios.post(
      "https://x10-server.onrender.com/auth/login",
      reqBody
    );
    dispatch(setToken(response.data.token));
    navigate("/");
  } catch (error: any) {
    apiNoti["error"]({
      message: "Error",
      description: error.response.data.message,
    });
  }
};

export const requestRegister = async (
  reqBody: any,
  apiNoti: NotificationInstance,
  navigate: NavigateFunction
) => {
  try {
    const response = await axios.post(
      "https://x10-server.onrender.com/auth/signup",
      reqBody
    );
    if (response.status === 200) {
      navigate("/register-verify");
    }
  } catch (error: any) {
    apiNoti["error"]({
      message: "Error",
      description: error.response.data.message,
    });
  }
};
