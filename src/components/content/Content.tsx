import ListProject from "../../pages/projectPage/ListProject";
import ProjectDetail from "../../pages/projectPage/ProjectDetail";
import TasksPage from "../../pages/tasksPage/TasksPage";
import React from "react";
import { useSelector } from "react-redux";
import { Route, Routes } from "react-router";

const Content = () => {
  const statusMenu = useSelector((state: any) => state.menu?.status);

  return (
    <main
      className="container_content"
      style={{ left: statusMenu ? "30px" : "340px" }}
    >
      <Routes>
        <Route path="/" element={<ListProject />} />
        <Route path="/tasks" element={<TasksPage />} />
        <Route path="/:projectId" element={<ProjectDetail />} />
      </Routes>
    </main>
  );
};

export default Content;
