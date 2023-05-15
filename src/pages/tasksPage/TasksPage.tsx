import TaskForm, { ITask, IUser } from "./TaskForm";
import TaskInfo from "./TaskInfo";
import { descriptionTest } from "../../data/statges";
import { useAppSelector } from "../../redux/hook";
import { setQuery, deleteQuery } from "../../redux/slice/paramsSlice";
import { RootState } from "../../redux/store";
import {
  EyeOutlined,
  ClockCircleOutlined,
  DoubleRightOutlined,
  DownOutlined,
  UpOutlined,
  PauseOutlined,
  LoadingOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import axios from "axios";
import taskApi from "../../services/api/taskApi";
import _ from "lodash";
import moment from "moment";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams, useSearchParams } from "react-router-dom";
import * as Scroll from "react-scroll";
import { useTranslation } from "react-i18next";
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
  message,
} from "antd";
import type { TabsProps } from "antd";
import { useAxios } from "../../hooks";

const { Text, Title } = Typography;
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

const TaskItem: React.FC<TaskItemProp> = ({ task, handleOpenInfoTask }) => {
  let priority = null;
  switch (task.priority) {
    case "lowest":
      priority = <DoubleRightOutlined style={{ transform: "rotate(90deg)" }} />;
      break;
    case "low":
      priority = <DownOutlined />;
      break;
    case "medium":
      priority = <PauseOutlined style={{ transform: "rotate(90deg)" }} />;
      break;
    case "high":
      priority = <UpOutlined />;
      break;
    case "highest":
      priority = (
        <DoubleRightOutlined style={{ transform: "rotate(270deg)" }} />
      );
      break;
  }
  return (
    <>
      <div
        className="task_info"
        // onClick={() => handleOpenInfoTask?.(task)}
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
        <div className="task_deadline">
          <ClockCircleOutlined />
          <span>{moment(task.deadline).format("DD/MM/YYYY")}</span>
        </div>
      </div>
    </>
  );
};

const TasksPage = () => {
  const params = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParams = useSelector((state: any) => state.queryParams);
  const dispatch = useDispatch();
  const [tasksColumns, setTasksColumns] = useState<ColumnData[]>([]);
  const { t, i18n } = useTranslation(["content", "base"]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statusForm, setStatusForm] = useState(false);
  const [sortSelectValue, setSortSelectValue] = useState<string>();
  const [openInfo, setOpenInfo] = useState(false);
  const [edit, setEdit] = useState(false);
  const { showMessage, contextHolder }: UseMessageApiReturnType =
    useMessageApi();
  const [taskCurrent, setTaskCurrent] = useState<ITask>();
  const [allTasks, setAllTasks] = useState<ITask[]>([]);
  const [breadcrumb, setBreadcrumb] = useState({
    project: "",
    stages: "",
  });
  const user = useAppSelector((state: RootState) => state.auth?.userInfo);

  const { responseData, isLoading } = useAxios(
    "get",
    `/project/members/all/${params.projectId}`,
    []
  );

  useEffect(() => {
    let query = Object.fromEntries([...searchParams]);
    dispatch(setQuery(query));
  }, []);

  const taskTypeOptions = [
    {
      label: `Type`,
      options: [
        { label: `All`, value: `all` },
        { label: `Issue`, value: `issue` },
        { label: `Assignment`, value: `assignment` },
      ],
    },
  ];

  const priorityOptions = [
    {
      label: `Priority`,
      options: [
        { label: `Asc`, value: `prioAsc` },
        { label: `Desc`, value: `prioDesc` },
      ],
    },
    {
      label: `Deadline`,
      options: [
        { label: `Asc`, value: `deadlineAsc` },
        { label: `Desc`, value: `deadlineDesc` },
      ],
    },
  ];

  const breadcrumItems = useMemo(
    () => [
      { title: <Link to="/">Home</Link> },
      { title: <Link to={`/${params.projectId}`}>{breadcrumb?.project}</Link> },
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

  //Gọi API Lấy danh sách tasks => set vào các column
  useEffect(() => {
    taskApi
      .getAllTask(params.stagesId as string)
      .then((res: any) => {
        initialData.map((data: any) => {
          data.items = res.tasks.filter((task: any) => {
            return task.status === data.id;
          });
        });
        setAllTasks(res.tasks);
        setTasksColumns(initialData);
      })
      .catch((err: any) => {
        console.error(err);
      });
  }, []);

  //Xử lý Filter theo loại công việc
  const selectTaskTypes = (value: string) => {
    const filtered = allTasks.filter((task: any) => task.type === value);
    if (value === "all") {
      initialData.map((data: any) => {
        data.items = allTasks.filter((task: any) => {
          return task.status === data.id;
        });
      });
      setTasksColumns(initialData);
    } else {
      initialData.map((data: any) => {
        data.items = filtered.filter((task: any) => {
          return task.status === data.id;
        });
      });
      setTasksColumns(initialData);
    }

    dispatch(setQuery({ ...queryParams, type: value }));
    setSearchParams({ ...queryParams, type: value });
  };

  //Xử lý sort theo thứ tự công việc và deadline
  const sortPriority = (value: string) => {
    setSortSelectValue(value);
    const prioList: any = {
      highest: 5,
      high: 4,
      medium: 3,
      low: 2,
      lowest: 1,
    };
    if (value.includes("prio")) {
      allTasks.sort((a: ITask, b: ITask) => {
        return value.includes("Asc")
          ? prioList[a.priority] - prioList[b.priority]
          : prioList[b.priority] - prioList[a.priority];
      });
      initialData.map((data: any) => {
        data.items = allTasks.filter((task: ITask) => {
          return task.status === data.id;
        });
      });
      setTasksColumns(initialData);
    }
    if (value.includes("deadline")) {
      allTasks.sort((a: ITask, b: ITask) => {
        let d1: any = new Date(a.deadline);
        let d2: any = new Date(b.deadline);
        return value.includes("Asc") ? d1 - d2 : d2 - d1;
      });
      initialData.map((data: any) => {
        data.items = allTasks.filter((task: ITask) => {
          return task.status === data.id;
        });
      });
      setTasksColumns(initialData);
    }
    dispatch(setQuery({ ...queryParams, sort: value }));
    setSearchParams({ ...queryParams, sort: value });
    // switch (value) {
    //   case "prioAsc":
    //     allTasks.sort((a: ITask, b: ITask) => {
    //       return prioList[a.priority] - prioList[b.priority];
    //     });
    //     initialData.map((data: any) => {
    //       data.items = allTasks.filter((task: ITask) => {
    //         return task.status === data.id;
    //       });
    //     });
    //     setTasksColumns(initialData);
    //     dispatch(setQuery({ ...queryParams, priority: "asc" }));
    //     setSearchParams({ ...queryParams, priority: "asc" });
    //     break;
    //   case "prioDesc":
    //     allTasks.sort((a: ITask, b: ITask) => {
    //       return prioList[b.priority] - prioList[a.priority];
    //     });
    //     initialData.map((data: any) => {
    //       data.items = allTasks.filter((task: ITask) => {
    //         return task.status === data.id;
    //       });
    //     });
    //     setTasksColumns(initialData);
    //     dispatch(setQuery({ ...queryParams, priority: "desc" }));
    //     setSearchParams({ ...queryParams, priority: "desc" });
    //     break;
    //   case "deadlineAsc":
    //     allTasks.sort((a: ITask, b: ITask) => {
    //       let d1: any = new Date(a.deadline);
    //       let d2: any = new Date(b.deadline);
    //       return d1 - d2;
    //     });
    //     initialData.map((data: any) => {
    //       data.items = allTasks.filter((task: ITask) => {
    //         return task.status === data.id;
    //       });
    //     });
    //     setTasksColumns(initialData);
    //     dispatch(setQuery({ ...queryParams, deadline: "asc" }));
    //     setSearchParams({ ...queryParams, deadline: "asc" });
    //     break;
    //   case "deadlineDesc":
    //     allTasks.sort((a: ITask, b: ITask) => {
    //       let d1: any = new Date(a.deadline);
    //       let d2: any = new Date(b.deadline);
    //       return d2 - d1;
    //     });
    //     initialData.map((data: any) => {
    //       data.items = allTasks.filter((task: ITask) => {
    //         return task.status === data.id;
    //       });
    //     });
    //     setTasksColumns(initialData);
    //     dispatch(setQuery({ ...queryParams, deadline: "desc" }));
    //     setSearchParams({ ...queryParams, deadline: "desc" });
    //     break;
    // }
  };

  //Filter công việc theo username của Member
  const handleFilterMember = (values: any) => {
    let filtered = allTasks.filter((task: any) => {
      return values.some((value: string) => value === task.assignee.username);
    });
    if (filtered && filtered.length > 0) {
      initialData.map((data: any) => {
        data.items = filtered.filter((task: ITask) => {
          return task.status === data.id;
        });
      });
      setTasksColumns(initialData);
    } else {
      initialData.map((data: any) => {
        data.items = allTasks.filter((task: ITask) => {
          return task.status === data.id;
        });
      });
      setTasksColumns(initialData);
    }

    dispatch(setQuery({ ...queryParams, member: values }));
    setSearchParams({ ...queryParams, member: values });
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
        initialData.map((data: any) => {
          data.items = allTasks.filter((task: any) => {
            return task.status === data.id;
          });
        });
        setTasksColumns(initialData);
        setSearchParams(newParams);
        dispatch(deleteQuery("search"));
      }
    } else {
      const filtered = allTasks.filter((task: any) =>
        task.title.toLowerCase().includes(value)
      );
      initialData.map((data: any) => {
        data.items = filtered.filter((task: any) => {
          return task.status === data.id;
        });
      });
      setTasksColumns(initialData);
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
          showMessage("success", res?.message, 2);
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
          showMessage("error", err.response.data?.message, 2);
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
    setStatusForm(true);
    setEdit(!edit);
  };
  // cancel modal
  const handleCancel = () => {
    setIsModalOpen(false);
    setEdit(false);
    setOpenInfo(false);
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
      const element = document.getElementById("form_task");
      if (element) {
        element.scrollIntoView({
          behavior: "smooth",
          block: "start",
          inline: "nearest",
        });
      }
    } else if (tabLabel === "exchange") {
      const element = document.getElementById("task_info");
      if (element) {
        element.scrollIntoView({
          behavior: "smooth",
          block: "start",
          inline: "nearest",
        });
      }
    }
  };

  const items: TabsProps["items"] = [
    {
      key: "info",
      label: `Info task`,
      children: "",
    },
    {
      key: "exchange",
      label: `Comments`,
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
            setTasksColumns={setTasksColumns}
            tasksColumns={tasksColumns}
            showMessage={showMessage}
            key={statusForm ? "create" : "update"}
            title="Create new task"
            setIsModalOpen={setIsModalOpen}
            statusForm={false}
            setStatusForm={setStatusForm}
            taskInfo={{
              status: false,
            }}
            button="Create"
          />
        )}

        {openInfo && (
          <div className="task__info--container">
            <Tabs
              defaultActiveKey="1"
              items={items}
              onTabClick={handleTabLick}
            />
            <div className="action__btn">
              <Button type="primary" onClick={handleEditTask}>
                {edit ? "Cancel" : "Edit"}
              </Button>
            </div>
            {statusForm && edit ? (
              <TaskForm
                showMessage={showMessage}
                key={statusForm ? "create" : "update"}
                title="Edit task"
                setIsModalOpen={setIsModalOpen}
                statusForm={statusForm}
                setEdit={setEdit}
                setStatusForm={setStatusForm}
                taskInfo={{
                  status: false,
                  data: taskCurrent,
                }}
                button="Update"
                taskCurrent={taskCurrent}
              />
            ) : (
              <TaskForm
                showMessage={showMessage}
                key={statusForm ? "create" : "update"}
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

            <TaskInfo />
          </div>
        )}
      </Modal>
      <Space direction="vertical" size="large">
        <Breadcrumb items={breadcrumItems} />
        <div className="tool_bar">
          <Button size="large" type="primary" onClick={handleCreateTask}>
            Create Task
          </Button>
          <Select
            size="large"
            value={`Type: ${
              _.capitalize(queryParams.type) ||
              taskTypeOptions[0].options[0].label
            }`}
            options={taskTypeOptions}
            dropdownMatchSelectWidth={false}
            onChange={selectTaskTypes}
          />
          <Select
            size="large"
            value={
              sortSelectValue?.includes("prio")
                ? `Priority: ${
                    queryParams.sort.replace("prio", "") ||
                    priorityOptions[0].options[0].label
                  }`
                : `Deadline: ${
                    queryParams.sort.replace("deadline", "") ||
                    priorityOptions[0].options[0].label
                  }`
            }
            dropdownMatchSelectWidth={false}
            options={priorityOptions}
            onChange={sortPriority}
          />
          <Select
            mode="multiple"
            style={{ width: "300px" }}
            maxTagCount="responsive"
            showSearch
            size="large"
            suffixIcon={<SearchOutlined />}
            placeholder="Search Member"
            optionFilterProp="children"
            filterOption={(input, option) =>
              typeof option?.label === "string" &&
              option.label.toLowerCase().includes(input.toLowerCase())
            }
            onChange={handleFilterMember}
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
            placeholder="Task Name"
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
