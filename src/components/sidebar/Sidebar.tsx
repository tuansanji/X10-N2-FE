import { getAllProject } from "../../redux/apiRequest";
import { Menu } from "antd";
import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  AppstoreOutlined,
  MailOutlined,
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
  const token = useSelector((state: any) => state.auth.token);

  useEffect(() => {
    getAllProject(token, dispatch);
  }, [token]);

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

  return (
    <div className="container_sidebar">
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
  );
};

export default Sidebar;
