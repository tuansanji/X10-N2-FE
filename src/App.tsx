import React from "react";
import { Route, Routes } from "react-router";
import Register from "./pages/Register/Register";
import RegisterVerify from "./pages/Register/RegisterVerify";
import Login from "./pages/Login/Login";

const App: React.FC = () => {
  return (
    <div className="App">
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/register-verify" element={<RegisterVerify />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  );
};

export default App;
