import { Button, Table, Typography } from "antd";
import { ColumnsType } from "antd/es/table";
import moment from "moment";
import _ from "lodash";
import React, { useMemo } from "react";
import { TasksType } from "./Dashboard";

const { Title, Text } = Typography;

interface TasksListPropsType {
  tasksList: TasksType[];
}

const prioList: any = {
  highest: 5,
  high: 4,
  medium: 3,
  low: 2,
  lowest: 1,
};

const TasksList: React.FC<TasksListPropsType> = ({ tasksList }) => {
  const columns: ColumnsType<TasksType> = [
    {
      title: "Code",
      dataIndex: "code",
      key: "code",
      render: (_, record: TasksType) => {
        return <Title level={5}>{record.code}</Title>;
      },
      width: "16%",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (_, record: TasksType) => {
        return <Title level={5}>{record.title}</Title>;
      },
      width: "16%",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (_, record: TasksType) => {
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
      title: "Priority",
      dataIndex: "priority",
      key: "priority",
      render: (text, record: TasksType) => {
        return <Title level={5}>{_.capitalize(record.priority)}</Title>;
      },
      sorter: (a, b) => {
        return prioList[a.priority] - prioList[b.priority];
      },
      width: "16%",
    },
    {
      title: "Deadline",
      dataIndex: "deadline",
      key: "deadline",
      render: (_, record: TasksType) => {
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
      title: "Assignee",
      dataIndex: "assignee",
      key: "assignee",
      render: (_, record: TasksType) => {
        return <Title level={5}>{record.assignee?.fullName}</Title>;
      },
      width: "16%",
    },
  ];
  const data: TasksType[] = useMemo(() => {
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
  return (
    <>
      <div className="tasks_container" style={{ height: "100%" }}>
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
