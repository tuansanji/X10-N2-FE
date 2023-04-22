import Content from "../components/content/Content";
import Header from "../components/header/Header";
import Sidebar from "../components/sidebar/Sidebar";
import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const MainLayout: React.FC = () => {
  return (
    <div className="main-layout">
      <Header />
      <div className="container">
        <Sidebar />
        <Content />
      </div>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
};

export default MainLayout;
