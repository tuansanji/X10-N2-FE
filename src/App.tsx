import "./app.css";
import Content from "./components/content/Content";
import Header from "./components/header/Header";
import Sidebar from "./components/sidebar/Sidebar";
import React from "react";

const App: React.FC = () => {
  return (
    <div className="App">
      <Header />
      <div className="container">
        <Sidebar />
        <Content />
      </div>
    </div>
  );
};

export default App;
