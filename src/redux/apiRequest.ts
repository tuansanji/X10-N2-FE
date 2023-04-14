import { setUserInfo } from "./slice/authSlice";
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

export const requestLogin = async (
  reqBody: any,
  dispatch: Dispatch<AnyAction>,
  apiNoti: NotificationInstance,
  navigate: NavigateFunction
) => {
  try {
    const response = await axios.post(
      `${process.env.REACT_APP_BACKEND_URL}/auth/login`,
      reqBody
    );
    dispatch(setUserInfo(response.data));
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
      `${process.env.REACT_APP_BACKEND_URL}/auth/signup`,
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
