import { getAllProject } from "../../redux/apiRequest";
import { changeMenu } from "../../redux/slice/menuSlice";
import Loading from "../support/Loading";
import { Button, Menu } from "antd";
import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  AppstoreOutlined,
  MailOutlined,
  MenuOutlined,
  SettingOutlined,
} from "@ant-design/icons";

import type { MenuProps } from "antd";
type MenuItem = Required<MenuProps>["items"][number];
function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: "group"
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    type,
  } as MenuItem;
}

interface IStage {
  name: string;
  _id: string;
}

export interface IProject {
  name: string;
  _id: string;
  stages: IStage[];
  code: string;
  createdDate: Date;
  startDate: Date;
  estimatedEndDate: Date;
  status: string;
}
const Sidebar = () => {
  const dispatch = useDispatch();
  const listProject = useSelector((state: any) => state.project?.listProject);
  const statusMenu = useSelector((state: any) => state.menu?.status);
  const token = useSelector((state: any) => state.auth.userInfo.token);

  const toggleCollapsed = () => {
    dispatch(changeMenu());
  };

  const items: MenuProps["items"] = useMemo(() => {
    let newItems =
      listProject.projects && listProject?.projects.length > 0
        ? [
            ...listProject?.projects?.map(
              (project: IProject, index: number) => {
                return getItem(
                  project?.name,
                  `sub${index + 1}`,
                  <AppstoreOutlined />,
                  [
                    ...project.stages.map((stage: IStage, index2: number) =>
                      getItem("Submenu", `sub${index2 + 1}`, null, [
                        getItem("Option 7", index2 + 1),
                        getItem("Option 8", index2 + 1),
                      ])
                    ),
                  ]
                );
              }
            ),

            { type: "divider" },
            getItem("Contact", "grp", null, [getItem("mindx", "14")], "group"),
          ]
        : [
            { type: "divider" },
            getItem(
              "Contact",
              "grp",
              null,
              [getItem("no project", "14")],
              "group"
            ),
          ];
    return newItems;
  }, [listProject]);

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
          defaultSelectedKeys={["1"]}
          defaultOpenKeys={["sub1"]}
          mode="inline"
          items={items}
        />
      </div>
    </aside>
  );
};

export default Sidebar;
