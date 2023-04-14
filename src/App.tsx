import "./app.css";
import LandingPage from "./routes/LandingPage";
import MainLayout from "./routes/MainLayout";
import React from "react";
import { useSelector } from "react-redux";

const App: React.FC = () => {
  const token = useSelector((state: any) => state.auth.token);
  return <div className="App">{token ? <MainLayout /> : <LandingPage />}</div>;
};

export default App;
