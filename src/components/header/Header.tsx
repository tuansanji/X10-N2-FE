import { BellOutlined, DownOutlined } from "@ant-design/icons";
import { Button, Dropdown, Space } from "antd";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const Header = () => {
  const user = useSelector((state: any) => state.auth);

  const items = [
    {
      key: "1",
      label: <Link to="/user/infor">Thông tin tài khoản </Link>,
    },

    {
      key: "4",
      danger: true,
      label: <Link to="">Đăng xuất</Link>,
    },
  ];
  return (
    <header className="app_header">
      <div className="header_logo">
        <Link to="/">
          <img
            src="https://4218478784-files.gitbook.io/~/files/v0/b/gitbook-legacy-files/o/spaces%2F-MWcLXaW6te9yNIG__kn%2Favatar-1616661413606.png?generation=1616661413852661&alt=media"
            alt="mindx"
          />
        </Link>
        <span>Mindx</span>
      </div>
      <div className="header_auth">
        <span className="bell">
          <BellOutlined />
        </span>
        {user ? (
          <div className="header_auth-user">
            <Dropdown
              menu={{
                items,
              }}
            >
              <Link className="" to="/user/infor">
                <Space>
                  {user.fullName}
                  <DownOutlined />
                </Space>
              </Link>
            </Dropdown>
            <img srcSet={`${user.avatar} 2x`} alt="" />
          </div>
        ) : (
          <Link to="/auth/login">
            <Button type="primary" size="large">
              Login
            </Button>
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;
