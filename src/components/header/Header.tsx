import { BellOutlined, DownOutlined } from '@ant-design/icons';
import { Button, Dropdown, Space } from 'antd';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  const items = [
    {
      key: "1",
      label: <Link to="/user/infor">Thông tin tài khoản</Link>,
    },

    {
      key: "4",
      danger: true,
      label: <Link to="">Đăng xuất</Link>,
    },
  ];
  return (
    <div className="app_header">
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
        <Link to="/auth/login">
          <Button type="primary" size="large">
            Login
          </Button>
        </Link>
        {/* <div className="header_auth-user">
          <Dropdown
            menu={{
              items,
            }}
          >
            <Link className="" to="/user/infor">
              <Space>
                Vinsmoke
                <DownOutlined />
              </Space>
            </Link>
          </Dropdown>
          <img
            srcSet="https://adoreyou.vn/wp-content/uploads/cute-hot-girl-700x961.jpg 2x"
            alt=""
          />
        </div> */}
      </div>
    </div>
  );
};

export default Header;
