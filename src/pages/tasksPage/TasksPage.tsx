import TaskForm, { ITask } from "./TaskForm";
import TaskInfo from "./TaskInfo";
import { descriptionTest } from "../../data/statges";
import { useAppSelector } from "../../redux/hook";
import { setQuery } from "../../redux/slice/paramsSlice";
import { RootState } from "../../redux/store";
import { EyeOutlined } from "@ant-design/icons";
import axios from "axios";
import _ from "lodash";
import React, { useEffect, useMemo, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams, useSearchParams } from "react-router-dom";
import * as Scroll from "react-scroll";
import { v4 as uuidv4 } from "uuid";
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
} from "antd";
import type { TabsProps } from "antd";

const { Text, Title } = Typography;
const { Search } = Input;

interface ColumnData {
  id: string;
  name: string;
  title: string;
  items: any[];
}

interface TaskItemProp {
  task: any;
  handleOpenInfoTask?: (task: ITask) => void;
}

const initialData = [
  {
    id: "open",
    name: "open",
    title: "Open",
    items: [],
    dropAllow: true,
  },
  {
    id: "in-progress",
    title: "In Progress",
    items: [],
    name: "in progress",
    dropAllow: true,
  },
  {
    id: "in-review",
    title: "In Review",
    items: [],
    name: "in review",
    dropAllow: true,
  },
  {
    id: "re-open",
    title: "Re-Open",
    items: [],
    name: "re-open",
    dropAllow: true,
  },
  {
    id: "done",
    title: "Done",
    items: [],
    name: "done",
    dropAllow: true,
  },
  {
    id: "cancel",
    title: "Cancel",
    items: [],
    name: "cancel",
    dropAllow: true,
  },
];

const list = [
  {
    id: uuidv4(),
    // đúng dữ liệu là title, anh thay name là title đi
    name: "The first task",
    type: "assignment",
    startDate: "2023-06-05T00:00:00.000Z",
    deadline: "2023-07-05T00:00:00.000Z",
    status: "open",
    comments: [],
    _id: "64568285419671e526f45651",
    createdDate: "2023-05-06T16:38:29.215Z",
    priority: "high",
    description: "description",
    assignee: "644152efd5b452e40abb14d7",
    createdBy: "644152efd5b452e40abb14d7",
  },
  {
    id: uuidv4(),
    // đúng dữ liệu là title, anh thay name là title đi
    name: "The last task",
    type: "assignment",
    status: "open",
    comments: [],
    _id: "6457f7a6e943f611da933ebf",
  },
  { id: uuidv4(), name: "Task B", status: "open" },
  { id: uuidv4(), name: "Purnima Kevyn", status: "open" },
  { id: uuidv4(), name: "Guido Kisha", status: "open" },
  { id: uuidv4(), name: "Varinius Hartmann", status: "open" },
  { id: uuidv4(), name: "Emmet Leonardo", status: "open" },
  { id: uuidv4(), name: "Thaddaios Vasanti", status: "open" },
  { id: uuidv4(), name: "Jaiden Re", status: "open" },
  { id: uuidv4(), name: "Johnie Erastos", status: "open" },
  { id: uuidv4(), name: "Eliseo Florian", status: "open" },
  { id: uuidv4(), name: "Ahmad Giselmund", status: "open" },
  { id: uuidv4(), name: "Marianna Pravina", status: "open" },
  { id: uuidv4(), name: "Task C", status: "in progress" },
  { id: uuidv4(), name: "Task D", status: "in progress" },
  { id: uuidv4(), name: "Task E", status: "in review" },
  { id: uuidv4(), name: "Task F", status: "in review" },
  { id: uuidv4(), name: "Task G", status: "in review" },
  { id: uuidv4(), name: "Task H", status: "re-open" },
  { id: uuidv4(), name: "Task W", status: "re-open" },
  { id: uuidv4(), name: "Task Q", status: "done" },
  { id: uuidv4(), name: "Task S", status: "cancel" },
  { id: uuidv4(), name: "Task R", status: "cancel" },
];

const TaskItem: React.FC<TaskItemProp> = ({ task, handleOpenInfoTask }) => {
  return (
    <>
      <div>
        <div> {task.name}</div>
        <div> {task.status}</div>
        <div
          onClick={() => handleOpenInfoTask?.(task)}
          style={{ color: "red" }}
        >
          <EyeOutlined />
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
  const breadcrumItems = [
    { title: <Link to="/">Home</Link> },
    { title: <Link to={`/${params.projectId}`}>Project Name</Link> },
    { title: "Stage Name" },
  ];
  useEffect(() => {
    let query = Object.fromEntries([...searchParams]);
    dispatch(setQuery(query));
  }, []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statusForm, setStatusForm] = useState(false);
  const [openInfo, setOpenInfo] = useState(false);
  const [edit, setEdit] = useState(false);
  const { showMessage, contextHolder }: UseMessageApiReturnType =
    useMessageApi();
  // đúng là ITask mà để any để test
  const [taskCurrent, setTaskCurrent] = useState<any>();
  const [breadcrumb, setBreadcrumb] = useState({
    project: "",
    stages: "",
  });
  const user = useAppSelector((state: RootState) => state.auth?.userInfo);

  const taskTypeOptions = [
    {
      label: `Type`,
      options: [
        { label: `All`, value: `all` },
        { label: `Issue`, value: `issue` },
        { label: `Task`, value: `task` },
      ],
    },
  ];

  const priorityOptions = [
    {
      label: `Priority`,
      options: [
        { label: `Asc`, value: `asc` },
        { label: `Desc`, value: `desc` },
      ],
    },
  ];
  // const breadcrumItems = [
  //   { title: <Link to="/">Home</Link> },
  //   { title: <Link to={`/${params.projectId}`}>Project Name</Link> },
  //   { title: "Stage Name" },
  // ];

  // const breadcrumItems = useMemo(
  //   () => [
  //     { title: <Link to="/">Home</Link> },
  //     { title: <Link to={`/${params.projectId}`}>{breadcrumb?.project}</Link> },
  //     {
  //       title: breadcrumb.stages,
  //     },
  //   ],
  //   [breadcrumb]
  // );
  // const breadcrumItems = useMemo(
  //   () => [
  //     { title: <Link to="/">Home</Link> },
  //     { title: <Link to={`/${params.projectId}`}>{breadcrumb?.project}</Link> },
  //     {
  //       title: breadcrumb.stages,
  //     },
  //   ],
  //   [breadcrumb]
  // );

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

  const selectTaskTypes = (value: string) => {
    dispatch(setQuery({ ...queryParams, type: value }));
    setSearchParams({ ...queryParams, type: value });
  };

  const sortPriority = (value: string) => {
    dispatch(setQuery({ ...queryParams, priority: value }));
    setSearchParams({ ...queryParams, priority: value });
  };

  useEffect(() => {
    initialData.map((data: any) => {
      data.items = list.filter((task) => {
        return task.status === data.name;
      });
    });
    setTasksColumns(initialData);
  }, []);

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

    if (startCol.id === "in-review") {
      const newState = tasksColumns.map((column: any) => {
        if (column.id !== "open" && column.id !== "in-progress") {
          return { ...column, dropAllow: true };
        } else return { ...column, dropAllow: false };
      });
      setTasksColumns(newState);
      return;
    }

    if (startCol.id === "re-open") {
      const newState = tasksColumns.map((column: any) => {
        if (
          column.id === "in-progress" ||
          column.id === "re-open" ||
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

  const handleDragEnd = (result: any) => {
    const { destination, source } = result;
    console.log(result);

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
      const newSourceTasks = Array.from(sourceCol.items); //Lấy task array từ object source column
      const [removedItem] = newSourceTasks.splice(source.index, 1); // Lấy ra khỏi task array item được drag
      const newSourceCol = { ...sourceCol, items: newSourceTasks }; // Cập nhật lại source column (đã bị lấy 1 task ra)
      removedItem.status = destination.droppableId;
      const newDesTasks = Array.from(desCol.items); // Lấy task array từ object đích đến
      newDesTasks.splice(destination.index, 0, removedItem); //Thêm vào array đó item được remove từ array nguồn
      const newDesCol = { ...desCol, items: newDesTasks }; //Cập nhật lại column đích
      //tạo State mới gồm 2 column đã được cập nhật thông tin
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
            value={`Priority: ${
              _.capitalize(queryParams.priority) ||
              priorityOptions[0].options[0].label
            }`}
            dropdownMatchSelectWidth={false}
            options={priorityOptions}
            onChange={sortPriority}
          />
          <Select size="large" defaultValue="Filter Member" />
          <Search size="large" placeholder="Task Name" />
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
                                key={task.id}
                                draggableId={task.id}
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
