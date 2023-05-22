import { Button, Modal, Table, Tabs, TabsProps, Typography } from "antd";
import { ColumnsType } from "antd/es/table";
import moment from "moment";
import _ from "lodash";
import React, { Dispatch, SetStateAction, useMemo, useState } from "react";
import { TasksType, UserInfo } from "./Dashboard";
import TaskInfo from "../tasksPage/TaskInfo";
import TaskForm from "../tasksPage/TaskForm";
import TaskHistory from "../tasksPage/TaskHistory";
import { useTranslation } from "react-i18next";
import { NoticeType } from "antd/es/message/interface";
import {
  DoubleRightOutlined,
  DownOutlined,
  PauseOutlined,
  UpOutlined,
} from "@ant-design/icons";
import { setPriority } from "../../utils/setPriority";

const { Title, Text } = Typography;

interface TasksListPropsType {
  tasksList: TasksType[];
  showMessage: (
    type: NoticeType,
    content: string,
    duration?: number | undefined
  ) => void;
  setTasksList: Dispatch<SetStateAction<TasksType[]>>;
}

interface TasksTableData {
  assignee: UserInfo;
  code: string;
  deadline: Date;
  key: string;
  priority: string;
  status: string;
  title: string;
}

const prioList: any = {
  highest: 5,
  high: 4,
  medium: 3,
  low: 2,
  lowest: 1,
};

const TasksList: React.FC<TasksListPropsType> = ({
  tasksList,
  showMessage,
  setTasksList,
}) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [statusForm, setStatusForm] = useState<boolean>(false);
  const [edit, setEdit] = useState<boolean>(false);
  const [openInfo, setOpenInfo] = useState<boolean>(false);
  const [taskCurrent, setTaskCurrent] = useState<any>(null);
  const [historyOrForm, setHistoryOrForm] = useState<boolean>(false);
  const [countReloadTasks, setCountReloadTasks] = useState<number>(1);
  const { t, i18n } = useTranslation(["content", "base"]);

  const showTaskDetail = (record: TasksTableData) => {
    let filteredTask = tasksList.filter((task: TasksType) => {
      return task._id === record.key;
    })[0];
    setIsModalOpen(true);
    setOpenInfo(true);
    setTaskCurrent(filteredTask);
  };

  const handleEditTask = () => {
    setIsModalOpen(true);
    setStatusForm(!statusForm);
    setEdit(!edit);
  };

  const handleTabLick = (tabLabel: string) => {
    if (tabLabel === "info") {
      setHistoryOrForm(false);
      const element = document.getElementById("form_task");
      if (element) {
        element.scrollIntoView({
          behavior: "smooth",
          block: "start",
          inline: "nearest",
        });
      }
    } else if (tabLabel === "comments") {
      setHistoryOrForm(false);
      const element = document.getElementById("task_info");
      if (element) {
        element.scrollIntoView({
          behavior: "smooth",
          block: "start",
          inline: "nearest",
        });
      }
    } else if (tabLabel === "activity") {
      setHistoryOrForm(true);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setStatusForm(false);
    setEdit(false);
    setOpenInfo(false);
    setTaskCurrent(null);
  };

  const columns: ColumnsType<TasksTableData> = [
    {
      title: `${t("content:form.job code")}`,
      dataIndex: "code",
      key: "code",
      render: (_, record: TasksTableData) => {
        return <Title level={5}>{record.code}</Title>;
      },
      width: "16%",
    },
    {
      title: `${t("content:name")}`,
      dataIndex: "name",
      key: "name",
      render: (_, record: TasksTableData) => {
        return (
          <Text
            className="task_name"
            onClick={() => {
              showTaskDetail(record);
            }}
          >
            {record.title}
          </Text>
        );
      },
      width: "16%",
    },
    {
      title: `${t("content:form.status")}`,
      dataIndex: "status",
      key: "status",
      render: (_, record: TasksTableData) => {
        let bgColor: string = "";
        let statusLabel: string = "";
        switch (record.status) {
          case "open":
            bgColor = "#2E55DE";
            statusLabel = "Open";
            break;
          case "inprogress":
            bgColor = "#F0E155";
            statusLabel = "In Progress";
            break;
          case "review":
            bgColor = "#E6883f";
            statusLabel = "Review";
            break;
          case "reopen":
            bgColor = "#8544d4";
            statusLabel = "Re-Open";
            break;
          case "done":
            bgColor = "#44CB39";
            statusLabel = "Done";
            break;
          case "cancel":
            bgColor = "#EC2B2B";
            statusLabel = "Cancel";
        }
        return (
          <Button
            type="primary"
            shape="round"
            style={{ backgroundColor: bgColor }}
          >
            <Text strong>{statusLabel}</Text>
          </Button>
        );
      },
      filters: [
        { text: "Open", value: "open" },
        { text: "In Progress", value: "inprogress" },
        { text: "Review", value: "review" },
        { text: "Re-Open", value: "reopen" },
        { text: "Done", value: "done" },
        { text: "Cancel", value: "cancel" },
      ],
      onFilter: (value: any, record) => record.status.indexOf(value) === 0,
      width: "16%",
    },
    {
      title: `${t("content:form.priority")}`,
      dataIndex: "priority",
      key: "priority",
      render: (text, record: TasksTableData) => {
        let priority = setPriority(record.priority);
        return (
          <div className="task_priority">
            <span>{priority}</span>
            <Title level={5}>{_.capitalize(record.priority)}</Title>
          </div>
        );
      },
      sorter: (a, b) => {
        return prioList[a.priority] - prioList[b.priority];
      },
      width: "16%",
    },
    {
      title: `${t("content:form.deadline")}`,
      dataIndex: "deadline",
      key: "deadline",
      render: (_, record: TasksTableData) => {
        return (
          <Title level={5}>
            {moment(record.deadline).format("DD/MM/YYYY")}
          </Title>
        );
      },
      defaultSortOrder: "descend",
      sorter: (a, b) => {
        let d1 = Number(new Date(a.deadline));
        let d2 = Number(new Date(b.deadline));
        return d2 - d1;
      },
      width: "16%",
    },
    {
      title: `${t("content:form.assignee")}`,
      dataIndex: "assignee",
      key: "assignee",
      render: (_, record: TasksTableData) => {
        return <Title level={5}>{record.assignee?.fullName}</Title>;
      },
      width: "16%",
    },
  ];
  const data: TasksTableData[] = useMemo(() => {
    let tasks =
      tasksList && TasksList.length > 0
        ? [
            ...tasksList.map((task: TasksType, index: number) => {
              return {
                key: task._id,
                code: task.code,
                title: task.title,
                status: task.status,
                priority: task.priority,
                deadline: task.deadline,
                assignee: task.assignee,
              };
            }),
          ]
        : [];
    return tasks;
  }, [tasksList]);

  const items: TabsProps["items"] = [
    {
      key: "info",
      label: t("content:form.information"),
      children: "",
    },
    {
      key: "comments",
      label: t("content:form.comments"),
      children: "",
    },
    {
      key: "activity",
      label: t("content:task.activity"),
      children: "",
    },
  ];

  return (
    <>
      <div className="tasks_container" style={{ height: "100%" }}>
        {/* modal create-info-edit */}
        <Modal
          title=""
          width="70%"
          open={isModalOpen}
          onCancel={handleCancel}
          maskClosable={false}
          style={{ top: "50px" }}
          footer={[]}
        >
          {/* phần modal thông tin task */}
          {openInfo && (
            <div className="task__info--container">
              <Tabs
                defaultActiveKey="1"
                items={items}
                onTabClick={handleTabLick}
              />
              {historyOrForm ? (
                <>
                  <TaskHistory taskCurrentId={taskCurrent?._id} />
                </>
              ) : (
                <>
                  {statusForm && edit ? (
                    <TaskForm
                      tasksList={tasksList}
                      setTasksList={setTasksList}
                      setCountReloadTasks={setCountReloadTasks}
                      edit={edit}
                      handleEditTask={handleEditTask}
                      showMessage={showMessage}
                      key={statusForm ? t("base:create") : t("base:update")}
                      title={t("content:form.edit task")}
                      setIsModalOpen={setIsModalOpen}
                      statusForm={statusForm}
                      setEdit={setEdit}
                      setStatusForm={setStatusForm}
                      taskInfo={{
                        status: false,
                        data: taskCurrent,
                      }}
                      button={t("base:update")}
                      taskCurrent={taskCurrent}
                    />
                  ) : (
                    <TaskForm
                      tasksList={tasksList}
                      setTasksList={setTasksList}
                      setCountReloadTasks={setCountReloadTasks}
                      handleEditTask={handleEditTask}
                      edit={edit}
                      showMessage={showMessage}
                      key={statusForm ? t("base:create") : t("base:update")}
                      title=""
                      setIsModalOpen={setIsModalOpen}
                      statusForm={statusForm}
                      setStatusForm={setStatusForm}
                      taskInfo={{
                        status: true,
                        data: taskCurrent,
                      }}
                      taskCurrent={taskCurrent}
                    />
                  )}

                  <TaskInfo
                    taskCurrent={taskCurrent}
                    showMessage={showMessage}
                  />
                </>
              )}
            </div>
          )}
        </Modal>
        <Table
          bordered
          dataSource={data}
          columns={columns}
          pagination={{
            position: tasksList.length >= 10 ? ["bottomCenter"] : [],
          }}
        />
      </div>
    </>
  );
};

export default TasksList;
