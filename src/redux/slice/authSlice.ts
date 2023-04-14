import { createSlice } from "@reduxjs/toolkit";

interface UserInfo {
  token: null | string;
  fullName: string;
  username: string;
  gender: string;
  phone: string;
  email: string;
  avatar: string;
  dob: null | Date;
}

const initialState: object | UserInfo = {
  token: null,
  fullName: "",
  username: "",
  gender: "",
  phone: "",
  email: "",
  avatar: "",
  dob: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUserInfo: (state, action) => {
      return action.payload;
    },
  },
});

export const { setUserInfo } = authSlice.actions;

export default authSlice.reducer;
