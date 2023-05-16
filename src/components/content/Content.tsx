import {
  ListProject,
  NotFoundPage,
  ProjectDetail,
  TasksPage,
  UserDetails,
} from "../../pages";
import React from "react";
import { useSelector } from "react-redux";
import { Outlet, Route, Routes } from "react-router";
import Sidebar from "../sidebar/Sidebar";

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
        <Route path="/user/info" element={<UserDetails />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      {/* <Sidebar />
      <Outlet /> */}
    </main>
  );
};

export default Content;
