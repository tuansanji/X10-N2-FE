import ListProject from "../../pages/projectPage/ListProject";
import Register from "../../pages/Register";
import Tasks from "../../pages/tasksPage/TasksPage";
import React from "react";
import { Route, Routes } from "react-router";

const Content = () => {
  return (
    <div className="container_content">
      <Routes>
        <Route path="/" element={<ListProject />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/auth/login" element={<Register />} />
      </Routes>
    </div>
  );
};

export default Content;
