import { Route, Routes } from "react-router";
import Content from "../components/content/Content";
import Header from "../components/header/Header";
import Sidebar from "../components/sidebar/Sidebar";
import React from "react";
import Dashboard from "../pages/dashboardPage/Dashboard";
import {
  ListProject,
  NotFoundPage,
  ProjectDetail,
  TasksPage,
  UserDetails,
} from "../pages";

const MainLayout: React.FC = () => {
  return (
    <div className="main-layout">
      <Header />
      <div className="container">
        {/* <Routes>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="/" element={<Content />}>
            <Route path=":projectId" element={<ProjectDetail />} />
            <Route path=":projectId/:stagesId" element={<TasksPage />} />
            <Route path="user/info" element={<UserDetails />} />
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Routes> */}
        <Sidebar />
        <Content />
      </div>
    </div>
  );
};

export default MainLayout;
