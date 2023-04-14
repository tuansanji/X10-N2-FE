import { getAllProject } from "../../redux/apiRequest";
import { Menu } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
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
<<<<<<< HEAD
=======
let token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0MmQ0YjkxNTVhZWZhN2MzY2IyYWU4ZiIsImZ1bGxOYW1lIjoiQm9iIFNtaXRoIiwiaWF0IjoxNjgxNDQ0MzY4LCJleHAiOjE2ODE1MzA3Njh9.-td2IE9hCdVabjOYqhfN7qJn9Sa6HKRpImfq_hEVtvs`;
>>>>>>> 6dd64f830d23e5f358223ebfc9ac275fd6411391

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
    console.log(345);
    getAllProject(token, dispatch);
  }, []);
  useEffect(() => {
    console.log(123);
  }, []);

  console.log("🚀 ~ useEffect ~ token:", token);
  console.log(listProject);

  const items: MenuProps["items"] = [
<<<<<<< HEAD
    // ...listProject?.projects?.map((project: IProject, index: number) => {
    //   return getItem(project?.name, `sub${index + 1}`, <AppstoreOutlined />, [
    //     ...project.stages.map((stage: IStage, index2: number) =>
    //       getItem("Submenu", `sub${index2 + 1}`, null, [
    //         getItem("Option 7", index2 + 1),
    //         getItem("Option 8", index2 + 1),
    //       ])
    //     ),
    //   ]);
    // }),

    getItem("Navigation One", "sub1", <MailOutlined />, [
      getItem(
        "Item 1",
        "g1",
        null,
        [getItem("Option 1", "1"), getItem("Option 2", "2")],
        "group"
      ),
      getItem(
        "Item 2",
        "g2",
        null,
        [getItem("Option 3", "3"), getItem("Option 4", "4")],
        "group"
      ),
    ]),

    getItem("Navigation Two", "sub2", <AppstoreOutlined />, [
      getItem("Option 5", "5"),
      getItem("Option 6", "6"),
      getItem("Submenu", "sub3", null, [
        getItem("Option 7", "7"),
        getItem("Option 8", "8"),
      ]),
    ]),
=======
    ...listProject?.projects?.map((project: IProject, index: number) => {
      return getItem(project?.name, `sub${index + 1}`, <AppstoreOutlined />, [
        ...project.stages.map((stage: IStage, index2: number) =>
          getItem("Submenu", `sub${index2 + 1}`, null, [
            getItem("Option 7", index2 + 1),
            getItem("Option 8", index2 + 1),
          ])
        ),
      ]);
    }),
>>>>>>> 6dd64f830d23e5f358223ebfc9ac275fd6411391

    { type: "divider" },
    getItem("Contact", "grp", null, [getItem("mindx", "14")], "group"),
  ];

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
