import {
  Button,
  Checkbox,
  Input,
  Modal,
  Table,
  Tabs,
  TabsProps,
  Typography,
} from "antd";
import { ColumnsType } from "antd/es/table";
import moment from "moment";
import _ from "lodash";
import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
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
  SearchOutlined,
  SortAscendingOutlined,
  UpOutlined,
} from "@ant-design/icons";
import { setPriority } from "../../utils/setPriority";
import { CheckboxValueType } from "antd/es/checkbox/Group";
import { CheckboxChangeEvent } from "antd/es/checkbox";
import { useAppDispatch, useAppSelector } from "../../redux/hook";
import {
  deleteQuery,
  deleteSubQuery,
  setQuery,
} from "../../redux/slice/paramsSlice";
import axios from "axios";
import taskApi from "../../services/api/taskApi";

const { Title, Text } = Typography;
const { Search } = Input;

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
  const dispatch = useAppDispatch();
  const timeOutRef = useRef<any>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [statusForm, setStatusForm] = useState<boolean>(false);
  const [edit, setEdit] = useState<boolean>(false);
  const [openInfo, setOpenInfo] = useState<boolean>(false);
  const [taskCurrent, setTaskCurrent] = useState<any>(null);
  const [historyOrForm, setHistoryOrForm] = useState<boolean>(false);
  const [countReloadTasks, setCountReloadTasks] = useState<number>(1);
  const { t, i18n } = useTranslation(["content", "base"]);
  const [checkAll, setCheckAll] = useState<boolean>(false);
  const [indeterminate, setIndeterminate] = useState<boolean>(true);
  const [filterStatus, setFilterStatus] = useState<any[]>([]);
  const [prioSort, setPrioSort] = useState<boolean>(false);
  const [deadlineSort, setDeadlineSort] = useState<boolean>(false);
  const [sortValue, setSortValue] = useState<string>("");
  const queryParams = useAppSelector((state: any) => state.queryParams);
  const [tableLoading, setTableLoading] = useState<boolean>(false);

  const plainOptions = [
    { label: "Open", value: "open" },
    { label: "In Progress", value: "inprogress" },
    { label: "Review", value: "review" },
    { label: "Re-Open", value: "reopen" },
    { label: "Done", value: "done" },
    { label: "Cancel", value: "cancel" },
  ];

  //Xử lý event khi click filter status
  const onCheckAllChange = (e: CheckboxChangeEvent) => {
    let filter = e.target.checked
      ? plainOptions.map((option: any) => option.value)
      : [];
    setFilterStatus(filter);
    setIndeterminate(false);
    setCheckAll(e.target.checked);
    dispatch(
      setQuery({
        ...queryParams,
        pageParams: { ...queryParams.pageParams, status: filter },
      })
    );
  };

  const handleStatusFilter = (list: CheckboxValueType[]) => {
    console.log("Tasks Status:", list);
    setFilterStatus(list);
    setIndeterminate(!!list.length && list.length < plainOptions.length);
    setCheckAll(list.length === plainOptions.length);
    dispatch(
      setQuery({
        ...queryParams,
        pageParams: { ...queryParams.pageParams, status: list },
      })
    );
  };
  //Kết thúc xử lý

  //Xử lý event khi search tên tasks và assignee
  const handleSearchTasks = (event: any) => {
    let value = event.target.value;
    if (value === "") {
      dispatch(
        deleteSubQuery({ firstLevel: "pageParams", secondLevel: "title" })
      );
    } else {
      dispatch(
        setQuery({
          ...queryParams,
          pageParams: { ...queryParams.pageParams, title: value },
        })
      );
    }
  };

  const handleSearchAssignee = (event: any) => {
    let value = event.target.value;
    dispatch(
      setQuery({
        ...queryParams,
        pageParams: { ...queryParams.pageParams, assignee: value },
      })
    );
  };
  //kết thúc xử lý

  //Xử lý event khi sort dữ liệu
  const handleSortPrio = () => {
    let sortValue = queryParams.pageParams.sort;
    if (sortValue === "prioAsc") {
      dispatch(
        setQuery({
          ...queryParams,
          pageParams: { ...queryParams.pageParams, sort: "prioDesc" },
        })
      );
      return;
    } else if (sortValue === "prioDesc") {
      dispatch(
        setQuery({
          ...queryParams,
          pageParams: { ...queryParams.pageParams, sort: "prioAsc" },
        })
      );
      return;
    } else {
      dispatch(
        setQuery({
          ...queryParams,
          pageParams: { ...queryParams.pageParams, sort: "prioDesc" },
        })
      );
      return;
    }
  };

  const handleSortDeadline = () => {
    let sortValue = queryParams.pageParams.sort;
    if (sortValue === "deadlineAsc") {
      dispatch(
        setQuery({
          ...queryParams,
          pageParams: { ...queryParams.pageParams, sort: "deadlineDesc" },
        })
      );
    } else if (sortValue === "deadlineDesc") {
      dispatch(
        setQuery({
          ...queryParams,
          pageParams: { ...queryParams.pageParams, sort: "deadlineAsc" },
        })
      );
      return;
    } else {
      dispatch(
        setQuery({
          ...queryParams,
          pageParams: { ...queryParams.pageParams, sort: "deadlineDesc" },
        })
      );
      return;
    }
  };
  //kết thúc xử lý

  //Xử lý event khi chuyển trang
  const handlePageChange = async (page: number, pageSize: number) => {
    const { total, ...rest } = queryParams.pageParams;
    setTableLoading(true);
    taskApi
      .getTasksByUser({ ...rest, page })
      .then((res: any) => {
        setTasksList(res.tasks);
        dispatch(
          setQuery({
            ...queryParams,
            pageParams: { ...queryParams.pageParams, page, total: res.total },
          })
        );
        setTableLoading(false);
      })
      .catch((err: any) => {
        setTasksList([]);
        showMessage("error", err.response.data?.message, 2);
        setTableLoading(false);
      });
  };

  // Gọi API khi filter, sort
  useEffect(() => {
    if (queryParams.pageParams) {
      const { total, page, ...rest } = queryParams.pageParams;
      setTableLoading(true);
      taskApi
        .getTasksByUser(rest)
        .then((res: any) => {
          setTasksList(res.tasks);
          setTableLoading(false);
          dispatch(
            setQuery({
              ...queryParams,
              pageParams: {
                ...queryParams.pageParams,
                total: res.total,
                page: res.currentPage,
              },
            })
          );
        })
        .catch((err: any) => {
          setTasksList([]);
          showMessage("error", err.response.data?.message, 2);
          setTableLoading(false);
        });
    }
  }, [queryParams.pageParams?.status, queryParams.pageParams?.sort]);

  useEffect(() => {
    if (queryParams.pageParams) {
      console.log("Title:", queryParams.pageParams.title);
      console.log("Assignee:", queryParams.pageParams.assignee);
      const { total, ...rest } = queryParams.pageParams;
      timeOutRef.current = setTimeout(() => {
        if (queryParams.pageParams.title || queryParams.pageParams.assignee) {
          setTableLoading(true);
          taskApi
            .getTasksByUser(rest)
            .then((res: any) => {
              setTasksList(res.tasks);
              setTableLoading(false);
              dispatch(
                setQuery({
                  ...queryParams,
                  pageParams: {
                    ...queryParams.pageParams,
                    total: res.total,
                    page: res.currentPage,
                  },
                })
              );
            })
            .catch((err: any) => {
              setTasksList([]);
              showMessage("error", err.response.data?.message, 2);
              setTableLoading(false);
            });
        }
      }, 500);
    }
    return () => {
      clearTimeout(timeOutRef.current);
    };
  }, [queryParams.pageParams?.title, queryParams.pageParams?.assignee]);

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
      filterDropdown: () => (
        <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
          <Search
            value={queryParams.pageParams?.title}
            allowClear
            placeholder="Search Tasks"
            onChange={handleSearchTasks}
          />
        </div>
      ),
      filterIcon: <SearchOutlined />,
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
      filterDropdown: () => (
        <div
          className="table_filter_dropdown"
          onKeyDown={(e) => e.stopPropagation()}
        >
          <Checkbox
            checked={checkAll}
            onChange={onCheckAllChange}
            indeterminate={indeterminate}
          >
            All
          </Checkbox>
          <Checkbox.Group
            style={{ display: "flex", flexDirection: "column" }}
            options={plainOptions}
            onChange={handleStatusFilter}
            value={filterStatus}
          />
        </div>
      ),
      width: "16%",
    },
    {
      title: (
        <div className="table_header_container">
          {`${t("content:form.priority")}`}
          <div className="icon_container" onClick={handleSortPrio}>
            <SortAscendingOutlined />
          </div>
        </div>
      ),
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
      width: "16%",
    },
    {
      title: (
        <div className="table_header_container">
          {`${t("content:form.deadline")}`}
          <div className="icon_container" onClick={handleSortDeadline}>
            <SortAscendingOutlined />
          </div>
        </div>
      ),
      dataIndex: "deadline",
      key: "deadline",
      render: (_, record: TasksTableData) => {
        return (
          <Title level={5}>
            {moment(record.deadline).format("DD/MM/YYYY")}
          </Title>
        );
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
      filterDropdown: () => (
        <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
          <Search
            value={queryParams.pageParams?.assignee || ""}
            allowClear
            placeholder="Search Assignee"
            onChange={handleSearchAssignee}
          />
        </div>
      ),
      filterIcon: <SearchOutlined />,
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
          loading={tableLoading}
          bordered
          dataSource={data}
          columns={columns}
          pagination={{
            position: ["bottomCenter"],
            pageSize: 10,
            total: queryParams.pageParams?.total,
            current: queryParams.pageParams?.page,
            onChange: handlePageChange,
          }}
        />
      </div>
    </>
  );
};

export default TasksList;
