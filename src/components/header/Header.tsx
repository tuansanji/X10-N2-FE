import { Button } from 'antd';
import React, { useState } from 'react';
import type { SizeType } from "antd/es/config-provider/SizeContext";
const Header = () => {
  const [size, setSize] = useState<SizeType>("large");
  return (
    <div className="app_header">
      <div className="header_logo">
        <img
          src="https://4218478784-files.gitbook.io/~/files/v0/b/gitbook-legacy-files/o/spaces%2F-MWcLXaW6te9yNIG__kn%2Favatar-1616661413606.png?generation=1616661413852661&alt=media"
          alt=""
        />
        <span>Mindx</span>
      </div>
      <div className="header_auth">
        <Button type="primary" size={size}>
          Login
        </Button>
      </div>
    </div>
  );
};

export default Header;
