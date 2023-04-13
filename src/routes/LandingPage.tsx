import React from "react";
import { Routes, Route } from "react-router-dom";
import Register from "../pages/Register/Register";
import RegisterVerify from "../pages/Register/RegisterVerify";
import Login from "../pages/Login/Login";
import ForgotPassword from "../pages/Login/ForgotPassword";
import LoginSuccess from "../pages/Login/LoginSuccess";

function LandingPage() {
  return (
    <div>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/register-verify" element={<RegisterVerify />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/login-success" element={<LoginSuccess />} />
      </Routes>
    </div>
  );
}

export default LandingPage;
