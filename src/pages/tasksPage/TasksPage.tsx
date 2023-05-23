import TaskForm, { ITask, IUser } from "./TaskForm";
import TaskHistory from "./TaskHistory";
import TaskInfo from "./TaskInfo";
import { useAppSelector } from "../../redux/hook";
import { setQuery, deleteQuery } from "../../redux/slice/paramsSlice";
import { RootState } from "../../redux/store";
import taskApi from "../../services/api/taskApi";
import axios from "axios";
import _ from "lodash";
import moment from "moment";
import React, { useEffect, useMemo, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams, useSearchParams } from "react-router-dom";
import * as Scroll from "react-scroll";
import {
  ClockCircleOutlined,
  DoubleRightOutlined,
  DownOutlined,
  UpOutlined,
  PauseOutlined,
  LoadingOutlined,
  SearchOutlined,
} from "@ant-design/icons";

import useMessageApi, {
  UseMessageApiReturnType,
} from "../../components/support/Message";
import {
  Breadcrumb,
  Button,
  Divider,
  Input,
  Modal,
  Select,
  Space,
  Tabs,
  Typography,
  Tooltip,
} from "antd";
import type { TabsProps } from "antd";
import { useAxios } from "../../hooks";
import { setPriority } from "../../utils/setPriority";
import { changeMsgLanguage } from "../../utils/changeMsgLanguage";

const { Title, Text } = Typography;
const { Search } = Input;

export interface ColumnData {
  id: string;
  title: string;
  items: any[];
  dropAllow: boolean;
}

interface TaskItemProp {
  task: any;
  handleOpenInfoTask?: (task: ITask) => void;
}

const initialData: ColumnData[] = [
  {
    id: "open",
    title: "Open",
    items: [],
    dropAllow: true,
  },
  {
    id: "inprogress",
    title: "In Progress",
    items: [],
    dropAllow: true,
  },
  {
    id: "review",
    title: "In Review",
    items: [],
    dropAllow: true,
  },
  {
    id: "reopen",
    title: "Re-Open",
    items: [],
    dropAllow: true,
  },
  {
    id: "done",
    title: "Done",
    items: [],
    dropAllow: true,
  },
  {
    id: "cancel",
    title: "Cancel",
    items: [],
    dropAllow: true,
  },
];

const prioList: any = {
  highest: 5,
  high: 4,
  medium: 3,
  low: 2,
  lowest: 1,
};

const TaskItem: React.FC<TaskItemProp> = ({ task, handleOpenInfoTask }) => {
  const highlightDeadline = useMemo(() => {
    let bgColor: string = "";
    const now = new Date();
    const deadline = new Date(task.deadline);
    const hourBetweenDates =
      (deadline.getTime() - now.getTime()) / (60 * 60 * 1000);
    if (task.status !== "done") {
      if (hourBetweenDates < 24) {
        bgColor = "#E6883f";
      }
      if (hourBetweenDates < 0) {
        bgColor = "#EC2B2B";
      }
    }
    return bgColor;
  }, [task]);

  let priority = setPriority(task.priority);
  return (
    <>
      <div
        className="task_info"
        onClick={() => {
          handleOpenInfoTask?.(task);
        }}
      >
        <Title className="task_title" level={5}>
          {task.title}
        </Title>
        <div className="task_description">
          <Tooltip title={`Type: ${_.capitalize(task.type)}`}>
            <div
              className="task_type"
              style={{
                backgroundColor: task.type === "issue" ? "#EC2B2B" : "#44CB39",
              }}
            ></div>
          </Tooltip>
          <Tooltip title={`Priority: ${_.capitalize(task.priority)}`}>
            <div>{priority}</div>
          </Tooltip>
          <Tooltip title={task.assignee.fullName}>
            <img src={task.assignee.avatar} alt="user-avatar" />
          </Tooltip>
        </div>
        <div className="task_deadline--container">
          <span
            className="task_deadline--content"
            style={{ backgroundColor: highlightDeadline }}
          >
            <ClockCircleOutlined />
            <Text>{moment(task.deadline).format("DD/MM/YYYY - HH:mm")}</Text>
          </span>
        </div>
      </div>
    </>
  );
};

const TasksPage = () => {
  const params = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParams = useSelector((state: any) => state.queryParams);
  const user = useAppSelector((state: RootState) => state.auth?.userInfo);
  const dispatch = useDispatch();
  const [sortSelectValue, setSortSelectValue] = useState<string>("");
  const { showMessage, contextHolder }: UseMessageApiReturnType =
    useMessageApi();
  const [taskCurrent, setTaskCurrent] = useState<any>(null);
  const [allTasks, setAllTasks] = useState<ITask[]>([]);
  const { t, i18n } = useTranslation(["content", "base"]);
  const [tasksColumns, setTasksColumns] = useState<ColumnData[]>([]);
  const [dragLoading, setDragLoading] = useState<boolean>(false);
  const [historyOrForm, setHistoryOrForm] = useState<boolean>(false);
  const [breadcrumb, setBreadcrumb] = useState({
    project: "",
    stages: "",
  });
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [statusForm, setStatusForm] = useState<boolean>(false);
  const [openInfo, setOpenInfo] = useState<boolean>(false);
  const [countReloadTasks, setCountReloadTasks] = useState<number>(1);
  const [edit, setEdit] = useState<boolean>(false);

  const { responseData, isLoading } = useAxios(
    "get",
    `/project/members/all/${params.projectId}`,
    []
  );

  //Gọi API Lấy danh sách tasks => set vào các column
  //Lấy thông tin từ url để hiển thị tasks theo bộ lọc
  useEffect(() => {
    let query = Object.fromEntries([...searchParams]);
    const queryMembers = searchParams.getAll("member");
    dispatch(setQuery({ ...query, member: queryMembers }));

    taskApi
      .getAllTask(params.stagesId as string)
      .then((res: any) => {
        setAllTasks(res.tasks);
        if (query.type) {
          if (query.type === "all") {
            res.tasks = res.tasks.filter((task: ITask) => {
              return task;
            });
          } else {
            res.tasks = res.tasks.filter(
              (task: ITask) => task.type === query.type
            );
          }
        }
        if (query.sort) {
          if (query.sort.includes("prio")) {
            res.tasks.sort((a: ITask, b: ITask) => {
              return query.sort.includes("Asc")
                ? prioList[a.priority] - prioList[b.priority]
                : prioList[b.priority] - prioList[a.priority];
            });
          }
          if (query.sort.includes("deadline")) {
            res.tasks.sort((a: ITask, b: ITask) => {
              let d1 = Number(new Date(a.deadline));
              let d2 = Number(new Date(b.deadline));
              return query.sort.includes("Asc") ? d1 - d2 : d2 - d1;
            });
          }
        } else {
          res.tasks.sort((a: ITask, b: ITask) => {
            let d1 = Number(new Date(a.deadline));
            let d2 = Number(new Date(b.deadline));
            return d1 - d2;
          });
        }

        if (queryMembers && queryMembers.length === 0) {
          res.tasks = res.tasks.filter((task: any) => {
            return task;
          });
        }

        if (queryMembers && queryMembers.length > 0) {
          res.tasks = res.tasks.filter((task: any) => {
            return queryMembers.some(
              (memberName: any) => memberName === task.assignee.username
            );
          });
        }

        if (query.search) {
          res.tasks = res.tasks.filter((task: any) => {
            return task.title.toLowerCase().includes(query.search);
          });
        }

        let newState = initialData.map((data: any) => {
          data.items = res.tasks.filter((task: any) => {
            return task.status === data.id;
          });
          return data;
        });
        setTasksColumns(newState);
      })
      .catch((err: any) => {
        showMessage("error", err.response.data?.message, 2);
      });
  }, []);

  const taskTypeOptions = [
    {
      label: `${t("content:task.type")}`,
      options: [
        { label: `${t("content:form.all")}`, value: `all` },
        { label: `${t("content:form.issue")}`, value: `issue` },
        { label: `${t("content:form.assignment")}`, value: `assignment` },
      ],
    },
  ];

  const priorityOptions = [
    {
      label: `${t("content:form.priority")}`,
      options: [
        { label: `${t("content:form.asc")}`, value: `prioAsc` },
        { label: `${t("content:form.desc")}`, value: `prioDesc` },
      ],
    },
    {
      label: `${t("content:form.deadline")}`,
      options: [
        { label: `${t("content:form.asc")}`, value: `deadlineAsc` },
        { label: `${t("content:form.desc")}`, value: `deadlineDesc` },
      ],
    },
  ];

  const breadcrumItems = useMemo(
    () => [
      { title: <Link to="/">Home</Link> },
      {
        title: (
          <Link to={`/project/${params.projectId}`}>{breadcrumb?.project}</Link>
        ),
      },
      {
        title: breadcrumb.stages,
      },
    ],
    [breadcrumb]
  );

  useEffect(() => {
    (async () => {
      try {
        const project = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/project/details/${params.projectId}`,
          { headers: { Authorization: `Bearer ${user.token}` } }
        );
        const stages = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/stage/details/${params.stagesId}`,
          { headers: { Authorization: `Bearer ${user.token}` } }
        );
        setBreadcrumb({
          ...breadcrumb,
          project: project.data.project.name,
          stages: stages.data.stage.name,
        });
      } catch (error) {}
    })();
  }, []);

  //Filter và sort các tasks theo thao tác người dùng
  useEffect(() => {
    const { type, sort, member, search } = queryParams;
    let filteredTasks = allTasks;

    if (search) {
      filteredTasks = filteredTasks.filter((task: any) => {
        return task.title.toLowerCase().includes(search);
      });
    }

    if (sort) {
      if (sort.includes("prio")) {
        filteredTasks.sort((a: ITask, b: ITask) => {
          return sort.includes("Asc")
            ? prioList[a.priority] - prioList[b.priority]
            : prioList[b.priority] - prioList[a.priority];
        });
      }
      if (sort.includes("deadline")) {
        filteredTasks.sort((a: ITask, b: ITask) => {
          let d1 = Number(new Date(a.deadline));
          let d2 = Number(new Date(b.deadline));
          return sort.includes("Asc") ? d1 - d2 : d2 - d1;
        });
      }
    }

    if (member && member.length === 0) {
      filteredTasks = filteredTasks.filter((task: any) => {
        return task;
      });
    }

    if (member && member.length > 0) {
      filteredTasks = filteredTasks.filter((task: any) => {
        return member.some(
          (memberName: any) => memberName === task.assignee.username
        );
      });
    }

    if (type === "all") {
      filteredTasks = filteredTasks.filter((task: any) => {
        return task;
      });
    }
    if (type !== "all") {
      filteredTasks = filteredTasks.filter((task: any) => {
        return task.type === type;
      });
    }
    let newState = initialData.map((data: any) => {
      data.items = filteredTasks.filter((task: any) => {
        return task.status === data.id;
      });
      return data;
    });
    setTasksColumns(newState);
  }, [queryParams]);

  //Xử lý Filter theo loại công việc
  const selectTaskTypes = (value: string) => {
    dispatch(setQuery({ ...queryParams, type: value }));
    setSearchParams({ ...queryParams, type: value });
  };

  //Xử lý sort theo thứ tự công việc và deadline
  const sortPriority = (value: string) => {
    setSortSelectValue(value);
    dispatch(setQuery({ ...queryParams, sort: value }));
    setSearchParams({ ...queryParams, sort: value });
  };

  //Filter công việc theo username của Member
  const handleFilterMember = (values: any) => {
    dispatch(setQuery({ ...queryParams, member: values }));
    setSearchParams({ ...queryParams, member: values });
  };

  //Click cancel toàn bộ member đã chọn thì hiển thị lại toàn bộ danh sách tasks
  const cancelSelect = () => {
    initialData.map((data: any) => {
      data.items = allTasks.filter((task: ITask) => {
        return task.status === data.id;
      });
      return data;
    });
    setTasksColumns(initialData);
  };

  //Xử lý filter theo tên công việc
  const handleInputChange = (event: any) => {
    let value = event.target.value;
    if (value === "" && searchParams.has("search")) {
      let query = searchParams.get("search");
      if (query) {
        searchParams.delete("search");
        const newParams: { [key: string]: string } = {};
        searchParams.forEach((value: string, key: string) => {
          newParams[key] = value;
        });
        setSearchParams(newParams);
        dispatch(deleteQuery("search"));
      }
    } else {
      dispatch(setQuery({ ...queryParams, search: value }));
      setSearchParams({ ...queryParams, search: value });
    }
  };

  //Thay đổi trạng thái các column khi bắt đầu drag

  const handleDragStart = (result: any) => {
    const startCol = tasksColumns.filter(
      (column: any, index: number) => column.id === result.source.droppableId
    )[0];
    if (startCol.id === "done") {
      const newState = tasksColumns.map((column: any) => {
        if (column.id === "done") {
          return { ...column, dropAllow: true };
        } else return { ...column, dropAllow: false };
      });
      setTasksColumns(newState);
      return;
    }

    if (startCol.id === "cancel") {
      const newState = tasksColumns.map((column: any) => {
        return { ...column, dropAllow: false };
      });
      setTasksColumns(newState);
      return;
    }

    if (startCol.id === "review") {
      const newState = tasksColumns.map((column: any) => {
        if (column.id !== "open" && column.id !== "inprogress") {
          return { ...column, dropAllow: true };
        } else return { ...column, dropAllow: false };
      });
      setTasksColumns(newState);
      return;
    }

    if (startCol.id === "reopen") {
      const newState = tasksColumns.map((column: any) => {
        if (
          column.id === "inprogress" ||
          column.id === "reopen" ||
          column.id === "cancel"
        ) {
          return { ...column, dropAllow: true };
        } else return { ...column, dropAllow: false };
      });
      setTasksColumns(newState);
      return;
    }

    let colIndex = tasksColumns.indexOf(startCol);
    let newState = tasksColumns.map((column: any, index: number) => {
      if (
        index !== colIndex &&
        index !== colIndex + 1 &&
        column.id !== "cancel"
      ) {
        return { ...column, dropAllow: false };
      } else return column;
    });
    setTasksColumns(newState);
  };

  //Cập nhật giao diện khi thả item
  const handleDragEnd = (result: any) => {
    const { destination, source } = result;

    // Check nếu kéo và không thả vào bảng
    if (!destination) {
      const newState = tasksColumns.map((column) => {
        return { ...column, dropAllow: true };
      });
      setTasksColumns(newState);
      return;
    }

    // Check nếu kéo và thả lại vào vị trí cũ
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      const newState = tasksColumns.map((column) => {
        return { ...column, dropAllow: true };
      });
      setTasksColumns(newState);
      return;
    }

    //Lấy thông tin 2 column mà item được kéo ra và thả đến để cập nhật lại
    const sourceCol = tasksColumns.filter(
      (column) => column.id === source.droppableId
    )[0];
    const desCol = tasksColumns.filter(
      (column) => column.id === destination.droppableId
    )[0];

    // Check nếu kéo và thả trong cùng 1 cột

    if (sourceCol.id === desCol.id) {
      const newTasks = Array.from(sourceCol.items);
      const [removedItem] = newTasks.splice(source.index, 1);
      newTasks.splice(destination.index, 0, removedItem);
      const newColumn = { ...sourceCol, items: newTasks };
      const newState = tasksColumns.map((column) => {
        if (column.id === newColumn.id) {
          return { ...newColumn, dropAllow: true };
        } else {
          return { ...column, dropAllow: true };
        }
      });
      setTasksColumns(newState);
    }
    // Check nếu kéo và thả sang các cột khác
    else {
      showMessage("loading", `${t("content:loading")}...`);
      const newSourceTasks = Array.from(sourceCol.items);
      const [removedItem] = newSourceTasks.splice(source.index, 1);
      removedItem.status = destination.droppableId;
      const newSourceCol = { ...sourceCol, items: newSourceTasks };
      const newDesTasks = Array.from(desCol.items);
      newDesTasks.splice(destination.index, 0, removedItem);
      const newDesCol = { ...desCol, items: newDesTasks };
      const newState = tasksColumns.map((column) => {
        if (column.id === newSourceCol.id) {
          return { ...newSourceCol, dropAllow: true };
        } else if (column.id === newDesCol.id) {
          return { ...newDesCol, dropAllow: true };
        } else {
          return { ...column, dropAllow: true };
        }
      });
      setTasksColumns(newState);
      taskApi
        .editTask(removedItem._id, { ...removedItem, stageId: params.stagesId })
        .then((res: any) => {
          showMessage(
            "success",
            changeMsgLanguage(res?.message, "Cập nhật công việc thành công"),
            2
          );
        })
        .catch((err: any) => {
          removedItem.status = source.droppableId;
          newDesTasks.splice(destination.index, 1);
          const newDesCol = { ...desCol, items: newDesTasks };
          newSourceTasks.splice(source.index, 0, removedItem);
          const newSourceCol = { ...sourceCol, items: newSourceTasks };
          const newState = tasksColumns.map((column) => {
            if (column.id === newSourceCol.id) {
              return { ...newSourceCol, dropAllow: true };
            } else if (column.id === newDesCol.id) {
              return { ...newDesCol, dropAllow: true };
            } else {
              return { ...column, dropAllow: true };
            }
          });
          setTasksColumns(newState);
          showMessage(
            "error",
            changeMsgLanguage(
              err.response.data?.message,
              "Cập nhật công việc thất bại"
            ),
            2
          );
        });
    }
  };
  // tạo task
  const handleCreateTask = () => {
    setIsModalOpen(true);
    setStatusForm(false);
    setEdit(false);
  };

  // chỉnh sửa task
  const handleEditTask = () => {
    setIsModalOpen(true);
    setStatusForm(!statusForm);
    setEdit(!edit);
  };
  // cancel modal
  const handleCancel = () => {
    setIsModalOpen(false);
    setStatusForm(false);
    setEdit(false);
    setOpenInfo(false);
    setTaskCurrent(null);
  };

  // mở tab thông tin task
  const handleOpenInfoTask = (task: ITask) => {
    setIsModalOpen(true);
    setOpenInfo(true);
    setTaskCurrent(task);
  };

  // cuộn xuống phần tử khi nháy vào( sẽ cố gắng để thay đổi khi cuộn trang luôn)
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
  // phần tùy chọn modal task
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
    <div className="tasks_page">
      {contextHolder}

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
        {!statusForm && !openInfo && (
          <TaskForm
            allTasks={allTasks}
            setAllTasks={setAllTasks}
            setTasksColumns={setTasksColumns}
            tasksColumns={tasksColumns}
            setCountReloadTasks={setCountReloadTasks}
            edit={edit}
            handleEditTask={handleEditTask}
            showMessage={showMessage}
            key={statusForm ? t("base:create") : t("base:update")}
            title={t("content:form.create task")}
            setIsModalOpen={setIsModalOpen}
            statusForm={false}
            setStatusForm={setStatusForm}
            taskInfo={{
              status: false,
            }}
            button={t("base:create")}
          />
        )}

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
                    allTasks={allTasks}
                    setAllTasks={setAllTasks}
                    setTasksColumns={setTasksColumns}
                    tasksColumns={tasksColumns}
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

                <TaskInfo taskCurrent={taskCurrent} showMessage={showMessage} />
              </>
            )}
          </div>
        )}
      </Modal>
      <Space direction="vertical" size="large">
        <Breadcrumb items={breadcrumItems} />
        <div className="tool_bar">
          <Button size="large" type="primary" onClick={handleCreateTask}>
            {t("content:form.create task")}
          </Button>

          <Select
            size="large"
            value={`${t("content:task.type")}: ${
              t<any>(`content:form.${queryParams.type}`) ||
              taskTypeOptions[0].options[0].label
            }`}
            options={taskTypeOptions}
            dropdownMatchSelectWidth={false}
            onChange={selectTaskTypes}
          />
          <Select
            size="large"
            value={
              sortSelectValue?.includes("prio") ||
              queryParams.sort?.includes("prio")
                ? `${t("content:form.priority")}: ${t<any>(
                    `content:form.${queryParams.sort
                      ?.replace("prio", "")
                      .toLowerCase()}`
                  )}`
                : sortSelectValue?.includes("deadline") ||
                  queryParams.sort?.includes("deadline")
                ? `${t("content:form.deadline")}: ${t<any>(
                    `content:form.${queryParams.sort
                      ?.replace("deadline", "")
                      .toLowerCase()}`
                  )}`
                : `${t("content:form.deadline")}: ${
                    priorityOptions[1].options[0].label
                  }`
            }
            dropdownMatchSelectWidth={false}
            options={priorityOptions}
            onChange={sortPriority}
          />
          <Select
            allowClear
            mode="multiple"
            style={{ width: "300px" }}
            maxTagCount="responsive"
            showSearch
            size="large"
            suffixIcon={<SearchOutlined />}
            value={queryParams.member}
            placeholder={`${t("content:member.member name")}`}
            optionFilterProp="children"
            filterOption={(input, option) =>
              typeof option?.label === "string" &&
              option.label.toLowerCase().includes(input.toLowerCase())
            }
            onChange={handleFilterMember}
            onClear={cancelSelect}
            dropdownRender={(menu) =>
              isLoading ? (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    padding: "10px 0",
                  }}
                >
                  <LoadingOutlined />
                </div>
              ) : (
                menu
              )
            }
            options={responseData?.members?.map((item: IUser) => ({
              label: `${item.data.fullName}`,
              value: item.data.username,
            }))}
          />
          <Search
            size="large"
            placeholder={`${t("content:task.task name")}`}
            value={queryParams.search}
            allowClear
            onChange={handleInputChange}
          />
        </div>
        <Divider />
        <div className="tasks_board">
          <DragDropContext
            onDragEnd={handleDragEnd}
            onDragStart={handleDragStart}
          >
            {tasksColumns?.map((column: any, index: number) => {
              return (
                <Droppable
                  droppableId={column.id}
                  key={column.id}
                  isDropDisabled={!column.dropAllow}
                >
                  {(provided, snapshot) => {
                    return (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className="column_container"
                        style={{
                          cursor: column.dropAllow ? "" : "not-allowed",
                        }}
                      >
                        <Title level={4} className="column_containter_title">
                          {column.title}
                        </Title>
                        <div className="task_container">
                          {column.items?.map((task: any, index: number) => {
                            return (
                              <Draggable
                                key={task._id}
                                draggableId={task._id}
                                index={index}
                              >
                                {(provided, snapshot) => {
                                  return (
                                    <div
                                      className="task_item"
                                      ref={provided.innerRef}
                                      {...provided.dragHandleProps}
                                      {...provided.draggableProps}
                                    >
                                      <TaskItem
                                        task={task}
                                        handleOpenInfoTask={handleOpenInfoTask}
                                      />
                                    </div>
                                  );
                                }}
                              </Draggable>
                            );
                          })}
                          {provided.placeholder}
                        </div>
                      </div>
                    );
                  }}
                </Droppable>
              );
            })}
          </DragDropContext>
        </div>
      </Space>
    </div>
  );
};
export default TasksPage;
