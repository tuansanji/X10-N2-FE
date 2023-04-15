import "./app.css";
import React from "react";
import { useSelector } from "react-redux";

import LandingPage from "./routes/LandingPage";
import MainLayout from "./routes/MainLayout";

const App: React.FC = () => {
  const token = useSelector((state: any) => state.auth.userInfo.token);
  return <div className="App">{token ? <MainLayout /> : <LandingPage />}</div>;
};

export default App;
