import ListProject from "../../pages/projectPage/ListProject";
import Register from "../../pages/Register";
import React from "react";
import { Route, Routes } from "react-router";

const Content = () => {
  return (
    <div className="container_content">
      <Routes>
        <Route path="/" element={<ListProject />} />
        <Route path="/auth/login" element={<Register />} />
      </Routes>
    </div>
  );
};

export default Content;
