import { BellOutlined, DownOutlined } from "@ant-design/icons";
import { Button, Dropdown, Select, Space } from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const Header = () => {
  const [language, setLanguage] = useState(1);
  const user = useSelector((state: any) => state.auth);
  const { i18n } = useTranslation();

  // const currentLanguage = locales[i18n.language as keyof typeof locales];

  const handleChange = (lng: string) => {
    // i18n.changeLanguage(lng);
    localStorage.setItem("language", JSON.stringify(lng));
    setLanguage((prev) => prev + 1);
  };
  useEffect(() => {
    if (localStorage.getItem("language")) {
      i18n.changeLanguage(
        JSON.parse((localStorage.getItem("language") as string) ?? "en")
      );
    }
  }, [language]);
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
        <Select
          value={i18n.language}
          style={{ width: 200 }}
          onChange={handleChange}
          options={[
            {
              label: "Languages",
              options: [
                { label: "Tiếng việt", value: "vi" },
                { label: "English", value: "en" },
              ],
            },
          ]}
        />

        <span className="bell">
          <BellOutlined />
        </span>
        <div className="header_auth-user">
          <Dropdown
            menu={{
              items,
            }}
          >
            <Link className="" to="/user/infor">
              <Space>
                {user.userInfo.fullName}
                <DownOutlined />
              </Space>
            </Link>
          </Dropdown>
          <img
            srcSet={`${
              user.userInfo.avatar ||
              "https://st.quantrimang.com/photos/image/072015/22/avatar.jpg"
            } 2x`}
            alt=""
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
