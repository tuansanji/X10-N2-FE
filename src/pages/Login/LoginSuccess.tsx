import React from "react";
import { useSelector } from "react-redux";

const LoginSuccess: React.FC = () => {
  const token = useSelector((state: any) => state.auth.token);
  return <div>{token ? <h1>Login Success</h1> : <h1>Login Failed</h1>}</div>;
};

export default LoginSuccess;
