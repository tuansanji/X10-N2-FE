import React from "react";
import { useSelector } from "react-redux";

import LandingPage from "./routes/LandingPage";

const App: React.FC = () => {
  const token = useSelector((state: any) => state.auth.token);
  return <div className="App">{!token && <LandingPage />}</div>;
};

export default App;
