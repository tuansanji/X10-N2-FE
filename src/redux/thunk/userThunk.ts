import _ from "lodash";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const requestLogin = createAsyncThunk(
  "user/login",
  async (requestBody: any) => {
    const response = await axios.post(
      "https://x10-server.onrender.com/auth/login",
      requestBody
    );
    let info = _.omit(response.data.data, ["_id", "userType", "__v"]);
    info.token = response.data.token;

    return info;
  }
);
