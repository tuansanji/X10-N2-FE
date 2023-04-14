import ListProject from "../../pages/projectPage/ListProject";
import React from "react";
import { Route, Routes } from "react-router";

const Content = () => {
  return (
    <div className="container_content">
      <Routes>
        <Route path="/" element={<ListProject />} />
      </Routes>
    </div>
  );
};

export default Content;
