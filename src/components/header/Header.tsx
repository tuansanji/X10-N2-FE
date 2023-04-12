import { BellOutlined } from "@ant-design/icons";
import { Button } from "antd";
import React, { useState } from "react";
import { Link } from "react-router-dom";
const Header = () => {
  return (
    <div className="app_header">
      <div className="header_logo">
        <Link to="/">
          <img
            src="https://4218478784-files.gitbook.io/~/files/v0/b/gitbook-legacy-files/o/spaces%2F-MWcLXaW6te9yNIG__kn%2Favatar-1616661413606.png?generation=1616661413852661&alt=media"
            alt=""
          />
        </Link>
        <span>Mindx</span>
      </div>
      <div className="header_auth">
        <span className="bell">
          <BellOutlined />
        </span>
        <Link to="/auth/login">
          <Button type="primary" size="large">
            Login
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Header;
