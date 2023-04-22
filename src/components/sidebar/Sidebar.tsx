import { getAllProject } from "../../redux/apiRequest";
import { useAppDispatch, useAppSelector } from "../../redux/hook";
import { changeMenu } from "../../redux/slice/menuSlice";
import { RootState } from "../../redux/store";
<<<<<<< HEAD
<<<<<<< HEAD
import { AccountBookOutlined, AppstoreOutlined } from "@ant-design/icons";
import { Menu } from "antd";
import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";
import { v4 as uuid } from "uuid";
=======
import Loading from "../support/Loading";
import { Button, Menu } from "antd";
=======
import { Menu } from "antd";
>>>>>>> ba34688 (format code)
import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { v4 as uuid } from "uuid";
<<<<<<< HEAD
import {
  AccountBookOutlined,
  AppstoreOutlined,
  MailOutlined,
  MenuOutlined,
  SettingOutlined,
} from "@ant-design/icons";
>>>>>>> b1ab2c1 (edit form stage)
=======
import { AccountBookOutlined, AppstoreOutlined } from "@ant-design/icons";
>>>>>>> ba34688 (format code)
import type { MenuProps } from "antd";
type MenuItem = Required<MenuProps>["items"][number];
function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: "group",
  className?: string
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    type,
    className,
  } as MenuItem;
}

interface IStage {
  name: string;
  _id: string;
}

export interface IProject {
  name: string;
  _id: string;
  stages?: IStage[];
  code: string;
  createdDate: Date;
  startDate: Date;
  estimatedEndDate: Date;
  status: string;
}
const Sidebar = () => {
<<<<<<< HEAD
  const dispatch = useAppDispatch();
=======
  const dispatch = useDispatch();
>>>>>>> b1ab2c1 (edit form stage)

  const [sidebarData, setSidebarData] = useState<{
    projects: any;
    total: number;
  }>({
    projects: [],
    total: 0,
  });
<<<<<<< HEAD
  const listProject = useAppSelector(
    (state: RootState) => state.project?.listProject
  );
  const statusMenu = useAppSelector((state: RootState) => state.menu?.status);
  const token = useAppSelector((state: RootState) => state.auth.userInfo.token);
  const reloadSidebar = useAppSelector((state: RootState) => state.menu.reload);
  // đóng mở sidebar
  const toggleCollapsed = () => {
    dispatch(changeMenu());
  };
<<<<<<< HEAD
=======
  const listProject = useSelector(
    (state: RootState) => state.project?.listProject
  );
  const statusMenu = useSelector((state: RootState) => state.menu?.status);
  const token = useSelector((state: RootState) => state.auth.userInfo.token);
  const reloadSidebar = useSelector((state: RootState) => state.menu.reload);
  // đóng mở sidebar
  const toggleCollapsed = () => {
    dispatch(changeMenu());
  };
>>>>>>> b1ab2c1 (edit form stage)

  //api chi dữ liệu cho sidebar
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/project/all/details`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setSidebarData(response.data);
      });
  }, [listProject, reloadSidebar]);
<<<<<<< HEAD
=======
  const fetchStagesData = (projectId: string): any => {
    try {
      axios
        .get(
          `${process.env.REACT_APP_BACKEND_URL}/project/stages/${projectId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
        .then((res) => [
          ...res.data?.stages.map((stage: IStage, index2: number) =>
            getItem("Submenu", `sub${index2 + 1}`, null, [
              getItem("Option 7", index2 + 1),
              getItem("Option 8", index2 + 1),
            ])
          ),
        ]);
    } catch (err) {
      console.log(err);
      return [];
    }
  };
>>>>>>> 6a063c4 (update stage form)
=======
>>>>>>> b1ab2c1 (edit form stage)
  const items: MenuProps["items"] = useMemo(() => {
    let newItems =
      sidebarData.projects && sidebarData.projects.length > 0
        ? [
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> b1ab2c1 (edit form stage)
            ...sidebarData.projects.map((project: IProject, index: number) => {
              return getItem(
                project.name,
                `sub1${index + 1}`,
                <AppstoreOutlined />,
                project.stages?.map((stage: IStage, index2: number) =>
                  getItem(
                    stage.name,
                    `sub2${uuid()}`,
                    <AccountBookOutlined />,
                    []
                  )
                )

                // [
                //   ...project?.stages.map((stage: IStage, index2: number) =>
                //     getItem("Submenu", `sub${index2 + 1}`, null, [
                //       getItem("Option 7", index2 + 1),
                //       getItem("Option 8", index2 + 1),
                //     ])
                //   ),
                // ]
              );
            }),
<<<<<<< HEAD
=======
            ...listProject?.projects?.map(
              (project: IProject, index: number) => {
                return getItem(
                  project?.name,
                  `sub${index + 1}`,
                  <AppstoreOutlined />,
                  fetchStagesData(project._id)
                  // [
                  //   ...project.stages.map((stage: IStage, index2: number) =>
                  //     getItem("Submenu", `sub${index2 + 1}`, null, [
                  //       getItem("Option 7", index2 + 1),
                  //       getItem("Option 8", index2 + 1),
                  //     ])
                  //   ),
                  // ]
                );
              }
            ),
>>>>>>> 6a063c4 (update stage form)
=======
>>>>>>> b1ab2c1 (edit form stage)

            { type: "divider" },
            getItem("Contact", "grp", null, [getItem("Mindx", "14")], "group"),
          ]
        : [
            { type: "divider" },
            getItem(
              "Contact",
              "grp",
              null,
              [getItem("No Project", "14")],
              "group"
            ),
          ];
    return newItems;
  }, [listProject, sidebarData]);
<<<<<<< HEAD
<<<<<<< HEAD
  // khi click vào item thanh sidebar
=======
  // khi click vào thanh sidebar
>>>>>>> b1ab2c1 (edit form stage)
=======
  // khi click vào item thanh sidebar
>>>>>>> ba34688 (format code)
  const onClick: MenuProps["onClick"] = (e) => {
    console.log("click ", e);
  };
  useEffect(() => {
    getAllProject(token, dispatch);
  }, [token]);
  return (
    <aside
      className={`container_sidebar`}
      style={{
        left: statusMenu ? "-324px" : "0px",
      }}
    >
      <div className="sidebar__title ">
        <h4>Your Project List</h4>
        <div
          className={
            !statusMenu ? "btn btn_sidebar" : " btn btn_sidebar active"
          }
          onClick={toggleCollapsed}
        >
          {!statusMenu ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5L8.25 12l7.5-7.5"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 "
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.25 4.5l7.5 7.5-7.5 7.5"
              />
            </svg>
          )}
        </div>
      </div>

      <div
        className="sidebar__menu"
        style={{
          boxShadow: statusMenu ? "rgba(0, 0, 0, 0.4) 0px 0px 10px" : "none",
        }}
      >
        <Menu
          onClick={onClick}
          style={{
            width: "100%",
            height: "100%",
          }}
          mode="inline"
          items={items}
        />
      </div>
    </aside>
  );
};

export default Sidebar;
