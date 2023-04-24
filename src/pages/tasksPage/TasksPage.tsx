import TaskForm, { ITask } from "./TaskForm";
import TaskInfo from "./TaskInfo";
import { descriptionTest } from "../../data/statges";
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
import React, { useEffect, useMemo, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { Link, useParams } from "react-router-dom";
import * as Scroll from "react-scroll";
import { v4 as uuidv4 } from "uuid";

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
}

const initialData = [
  {
    id: "open",
    name: "open",
    title: "Open",
    items: [],
  },
  {
    id: "in-progress",
    title: "In Progress",
    items: [],
    name: "in progress",
  },
  {
    id: "in-review",
    title: "In Review",
    items: [],
    name: "in review",
  },
  {
    id: "re-open",
    title: "Re-Open",
    items: [],
    name: "re-open",
  },
  {
    id: "done",
    title: "Done",
    items: [],
    name: "done",
  },
  {
    id: "cancel",
    title: "Cancel",
    items: [],
    name: "cancel",
  },
];

const list = [
  { id: uuidv4(), name: "Task A", status: "open" },
  { id: uuidv4(), name: "Task B", status: "open" },
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

const TaskItem: React.FC<TaskItemProp> = ({ task }) => {
  return (
    <>
      <div>
        <div> {task.name}</div>
        <div> {task.status}</div>
      </div>
    </>
  );
};
// function TabContent({ id, children }: any) {
//   return (
//     <Element name={id}>
//       <div style={{ height: "100vh" }}>{children}</div>
//     </Element>
//   );
// }
const TasksPage = () => {
  const params = useParams();
  const [tasksColumns, setTasksColumns] = useState<ColumnData[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statusForm, setStatusForm] = useState(false);
  const [openInfo, setOpenInfo] = useState(false);
  const [edit, setEdit] = useState(false);
  const [activeTab, setActiveTab] = useState<any>("1");
  const taskTypeOptions = [
    {
      label: `Task Type: All`,
      value: "all",
    },
    {
      label: `Task Type: Issue`,
      value: "issue",
    },
    {
      label: `Task Type: Mission`,
      value: "mission",
    },
  ];
  const breadcrumItems = [
    { title: <Link to="/">Home</Link> },
    { title: <Link to={`/${params.projectId}`}>Project Name</Link> },
    { title: "Stage Name" },
  ];

  useEffect(() => {
    initialData.map((data: any) => {
      data.items = list.filter((task) => {
        return task.status === data.name;
      });
    });
    setTasksColumns(initialData);
  }, []);

  const handleDragEnd = (result: any) => {
    const { destination, source } = result;

    // Check nếu kéo và không thả vào bảng
    if (!destination) return;

    // Check nếu kéo và thả lại vào vị trí cũ
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

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
          return newColumn;
        } else {
          return column;
        }
      });
      setTasksColumns(newState);
    }
    // Check nếu kéo và thả sang các cột khác
    else {
      const newSourceTasks = Array.from(sourceCol.items);
      const [removedItem] = newSourceTasks.splice(source.index, 1);
      const newSourceCol = { ...sourceCol, items: newSourceTasks };
      const newDesTasks = Array.from(desCol.items);
      newDesTasks.splice(destination.index, 0, removedItem);
      const newDesCol = { ...desCol, items: newDesTasks };
      const newState = tasksColumns.map((column) => {
        if (column.id === newSourceCol.id) {
          return newSourceCol;
        } else if (column.id === newDesCol.id) {
          return newDesCol;
        } else {
          return column;
        }
      });
      setTasksColumns(newState);
    }
  };
  const handleTabClick = (key: any) => {
    setActiveTab(key);
  };
  const handleCreateTask = () => {
    setIsModalOpen(true);
    setStatusForm(false);
    setEdit(false);
  };
  const handleEditTask = () => {
    setIsModalOpen(true);
    setStatusForm(true);
    setEdit(!edit);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
    setEdit(false);
    setOpenInfo(false);
  };
  const handleOpenInfoTask = () => {
    setIsModalOpen(true);
    setOpenInfo(true);
  };
  const handleTabLick = (tabLabel: string) => {
    if (tabLabel === "1") {
      const element = document.getElementById("form_task");
      if (element) {
        element.scrollIntoView({
          behavior: "smooth",
          block: "start",
          inline: "nearest",
        });
      }
    } else if (tabLabel === "2") {
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
  const fakeData = {
    title: "tạo trang comment",
    jobCode: "ABCD123",
    status: "open",
    typeOfWork: "mission",
    priority: "high",
    creator: "is' me ",
    executor: "it's you",
    dateCreated: new Date("2024-12-31T00:00:00.000Z"),
    startDate: new Date("2024-12-31T00:00:00.000Z"),
    deadline: new Date("2024-12-31T00:00:00.000Z"),
    endDateActual: new Date("2024-12-31T00:00:00.000Z"),
    description: descriptionTest,
  };
  const items: TabsProps["items"] = [
    {
      key: "1",
      label: `Info task`,
      children: "",
    },
    {
      key: "2",
      label: `Job exchange`,
      children: "",
    },
  ];
  return (
    <div className="tasks_page">
      <Button type="primary" onClick={handleCreateTask}>
        Create
      </Button>

      <Button type="primary" onClick={handleOpenInfoTask}>
        Info
      </Button>
      <Modal
        title=""
        width="70%"
        open={isModalOpen}
        onCancel={handleCancel}
        maskClosable={false}
        footer={[]}
      >
        {!statusForm && !openInfo && (
          <TaskForm
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
                key={statusForm ? "create" : "update"}
                title="Edit task"
                setIsModalOpen={setIsModalOpen}
                statusForm={statusForm}
                setStatusForm={setStatusForm}
                taskInfo={{
                  status: false,
                  data: fakeData,
                }}
                button="Update"
              />
            ) : (
              <TaskForm
                key={statusForm ? "create" : "update"}
                title=""
                setIsModalOpen={setIsModalOpen}
                statusForm={statusForm}
                setStatusForm={setStatusForm}
                taskInfo={{
                  status: true,
                  data: fakeData,
                }}
              />
            )}

            <TaskInfo />
          </div>
        )}
      </Modal>
      <Space direction="vertical" size="large">
        <Breadcrumb items={breadcrumItems} />
        <div className="tool_bar">
          <Button size="large" type="primary">
            Create Task
          </Button>
          <Select
            size="large"
            options={taskTypeOptions}
            defaultValue={taskTypeOptions[0].label}
          />
          <Select size="large" defaultValue="Sort Priority" />
          <Select size="large" defaultValue="Filter Member" />
          <Search size="large" placeholder="Task Name" />
        </div>
        <Divider />
        <div className="tasks_board">
          <DragDropContext onDragEnd={handleDragEnd}>
            {tasksColumns.map((column: any) => {
              return (
                <Droppable droppableId={column.id} key={column.id}>
                  {(provided, snapshot) => {
                    return (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className="column_container"
                      >
                        <Title level={3} className="column_containter_title">
                          {column.title}
                        </Title>
                        {column.items.map((task: any, index: number) => {
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
                                    <TaskItem task={task} />
                                  </div>
                                );
                              }}
                            </Draggable>
                          );
                        })}
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

{
  /*
const TasksPage = () => {
 

 
  return (
    <div className="tasks_page">
    
    </div>
  );
}; */
}
