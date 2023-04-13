import axios from "axios";
import { setToken } from "./authSlice";
import { AnyAction, Dispatch } from "@reduxjs/toolkit";
import { NotificationInstance } from "antd/es/notification/interface";
import { NavigateFunction } from "react-router-dom";

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
    navigate("/login-success");
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
