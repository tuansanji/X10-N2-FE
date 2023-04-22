import ListProject from "../../pages/ProjectPage/ListProject";
import ProjectDetail from "../../pages/ProjectPage/ProjectDetail";
import TasksPage from "../../pages/TasksPage/TasksPage";
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
        <Route path="/:projectId" element={<ProjectDetail />} />
        <Route path="/:projectId/:stagesId" element={<TasksPage />} />
      </Routes>
    </main>
  );
};

export default Content;
