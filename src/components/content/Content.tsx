import ListProject from "../../pages/projectPage/ListProject";
import ProjectDetail from "../../pages/projectPage/ProjectDetail";
import TasksPage from "../../pages/tasksPage/TasksPage";
import React from "react";
import { Route, Routes } from "react-router";

const Content = () => {
  return (
    <div className="container_content">
      <Routes>
        <Route path="/" element={<ListProject />} />
        <Route path="/tasks" element={<TasksPage />} />
        <Route path="/:projectId" element={<ProjectDetail />} />
      </Routes>
    </div>
  );
};

export default Content;
