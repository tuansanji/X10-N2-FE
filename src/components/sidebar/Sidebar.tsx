import { ITask } from "../../pages/tasksPage/TaskForm";
import { useAppDispatch, useAppSelector } from "../../redux/hook";
import { changeMenu } from "../../redux/slice/menuSlice";
import { RootState } from "../../redux/store";
import taskApi from "../../services/api/taskApi";
import { BookOutlined, CloseOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Input, InputRef, Menu, Select, Skeleton } from "antd";
import React, { useEffect, useMemo, useRef, useState } from "react";
import Highlighter from "react-highlight-words";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

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

interface ITaskData extends ITask {
  project: {
    id: string;
    name: string;
    code: string;
  };
  stage: {
    id: string;
    name: string;
  };
}

const Sidebar = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation(["sidebar", "base", "content"]);
  const inputRef = useRef<InputRef>(null);

  const statusMenu = useAppSelector((state: RootState) => state.menu?.status);
  const reloadSidebar = useAppSelector(
    (state: RootState) => state?.menu?.reload
  );
  const currentTaskId = useAppSelector((state: RootState) => state.menu.taskId);

  const [search, setSearch] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState<string>("");
  const [filterProject, setFilterProject] = useState<string>("all");
  const [filterType, setFilterType] = useState<string>("allType");
  const [loading, setLoading] = useState(true);
  const [tasksData, setTasksData] = useState<{
    tasks: ITaskData[];
    total: number;
  } | null>(null);

  // đóng mở sidebar
  const toggleCollapsed = () => {
    dispatch(changeMenu());
  };

  const IconIssues = (issue: string) => {
    return (
      <div
        style={{
          width: "16px",
          height: "5px",
          backgroundColor: issue === "issue" ? "#EC2B2B" : "#44CB39",
          borderRadius: "12px",
        }}
      ></div>
    );
  };

  // lấy all task
  useEffect(() => {
    setLoading(true);
    taskApi
      .getTasks()
      .then((res: any) => {
        setTasksData(res);
        setLoading(false);
      })
      .catch((err: any) => {
        setLoading(false);
        console.log(err);
      });
  }, [reloadSidebar]);

  const listProject = useMemo(() => {
    if (tasksData) {
      const arr = tasksData?.tasks.map((task) => task.project.name);
      const optionsProject = [...new Set(arr)].map((project) => {
        return { label: project, value: project };
      });
      return optionsProject;
    } else return [];
  }, [tasksData]);

  const listTask: MenuProps["items"] = tasksData
    ? tasksData?.tasks
        ?.filter((t) => {
          if (filterProject === "all") {
            return true;
          } else {
            return t?.project?.name.trim() === filterProject.trim();
          }
        })
        ?.filter((t) => {
          if (filterType === "allType") {
            return true;
          } else {
            return t?.type === filterType;
          }
        })
        ?.filter(
          (t) =>
            t.title.toLowerCase().includes(searchValue.toLowerCase()) ||
            (t.code &&
              t?.code.toLowerCase().includes(searchValue.toLowerCase()))
        )
        ?.map((task: ITaskData, index) =>
          getItem(
            <Link
              key={task._id}
              to={`/${task.project.id}/${task.stage.id}/${task._id}`}
            >
              {/* {task?.title} */}
              <Highlighter
                highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
                searchWords={[searchValue]}
                autoEscape
                textToHighlight={
                  task.title ? `${task.title} - ${task?.code}` : ""
                }
              />
            </Link>,
            task?._id,
            IconIssues(task?.type)
          )
        )
    : [];

  const items: MenuProps["items"] = [
    ...(listTask || []),
    { type: "divider" },
    getItem(t("contact"), "grp", null, [getItem("Mindx", "14")], "group"),
  ];

  const handleChangeStatus = (value: string) => {
    setFilterType(value);
  };
  const handleChangeProject = (value: string) => {
    setFilterProject(value);
  };

  return (
    <aside
      className={`container_sidebar`}
      style={{
        left: statusMenu ? "-324px" : "0px",
      }}
    >
      <div className="sidebar__title ">
        <h4>{t("title")}</h4>

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
      <div className="sidebar__action">
        <div className="sidebar__action--select">
          <Select
            defaultValue="all"
            style={{ width: 100 }}
            dropdownStyle={{
              minWidth: "200px",
            }}
            onChange={handleChangeProject}
            options={[
              {
                label: t("sidebar:projectList"),
                options: [
                  {
                    label: t("sidebar:projectAll"),
                    value: "all",
                  },
                  ...listProject,
                ],
              },
            ]}
          />{" "}
          <Select
            defaultValue="allType"
            style={{ width: 100 }}
            onChange={handleChangeStatus}
            dropdownStyle={{
              minWidth: "200px",
            }}
            options={[
              {
                label: t("sidebar:type"),
                options: [
                  {
                    label: t("sidebar:typeAll"),
                    value: "allType",
                  },
                  {
                    label: (
                      <div className="task__type--main">
                        {t("content:form.assignment")}
                        <div
                          className="task_type"
                          style={{
                            backgroundColor: "#44CB39",
                          }}
                        ></div>
                      </div>
                    ),
                    value: "assignment",
                  },
                  {
                    label: (
                      <div className="task__type--main">
                        {t("content:form.issue")}
                        <div
                          className="task_type"
                          style={{
                            backgroundColor: "#EC2B2B",
                          }}
                        ></div>
                      </div>
                    ),
                    value: "issue",
                  },
                ],
              },
            ]}
          />
        </div>
        <div className="sidebar__action--search">
          <Button
            onClick={() => {
              setSearch(!search);

              inputRef.current &&
                inputRef.current!.focus({
                  cursor: "start",
                });
            }}
          >
            {search ? <CloseOutlined /> : <SearchOutlined />}
          </Button>
        </div>
      </div>
      <div
        className="search__input"
        style={{
          height: !search ? 0 : "auto",
          padding: !search ? "0 16px" : "0 16px 5px",
        }}
      >
        <Input
          ref={inputRef}
          style={{ display: "flex", gap: "6px" }}
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder={t("sidebar:placeholder")}
          prefix={<BookOutlined />}
        />
      </div>

      <div
        className="sidebar__menu"
        style={{
          boxShadow: statusMenu ? "rgba(0, 0, 0, 0.4) 0px 0px 10px" : "none",
        }}
      >
        {loading ? (
          <div className="sidebar__skeleton">
            {Array(10)
              .fill(null)
              .map((item, index) => (
                <Skeleton.Input
                  key={index}
                  active={true}
                  size={"small"}
                  block={true}
                />
              ))}
          </div>
        ) : (
          <Menu
            style={{
              width: "100%",
              height: "100%",
            }}
            selectedKeys={[currentTaskId]}
            mode="inline"
            items={items}
          />
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
