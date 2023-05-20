import {
  Dispatch,
  SetStateAction,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  getAllProjectError,
  getAllProjectStart,
  getAllProjectSuccess,
} from "../../redux/slice/projectSlice";
import _ from "lodash";
import axios from "axios";
import { useDispatch } from "react-redux";
import { RootState } from "../../redux/store";
import { useAppSelector } from "../../redux/hook";
import { Link } from "react-router-dom";
import {
  Col,
  Divider,
  Row,
  Typography,
  Table,
  Button,
  Tooltip,
  Modal,
  Avatar,
  Input,
  Popconfirm,
  Skeleton,
} from "antd";
import { ColumnsType } from "antd/es/table";
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import ProjectForm from "../../components/projectForm/ProjectForm";
import useMessageApi, {
  UseMessageApiReturnType,
} from "../../components/support/Message";
import ProjectsList from "./ProjectsList";
import taskApi from "../../services/api/taskApi";
import moment from "moment";
import TasksList from "./TasksList";

const { Title } = Typography;

export interface UserInfo {
  avatar: string;
  fullName: string;
  username: string;
  email: string;
}

export interface TasksType {
  code: string;
  title: string;
  status: string;
  deadline: Date;
  priority: string;
  assignee: UserInfo;
  _id?: string;
}

const Dashboard: React.FC = () => {
  const [openCreateProject, setOpenCreateProject] = useState<boolean>(false);
  const dispatch = useDispatch();
  const token = useAppSelector((state: RootState) => state.auth.userInfo.token);
  const listProject = useAppSelector(
    (state: any) => state.project?.listProject
  );
  const { showMessage, contextHolder }: UseMessageApiReturnType =
    useMessageApi();
  const [openEditProject, setOpenEditProject] = useState<boolean>(false);
  const [fetchingTasks, setFetchingTasks] = useState<boolean>(false);
  const [projectDetail, setProjectDetail] = useState<any>();
  const [tasksList, setTasksList] = useState<TasksType[]>([]);

  useEffect(() => {
    (async () => {
      dispatch(getAllProjectStart());
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/project/all`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        dispatch(getAllProjectSuccess(res.data));
      } catch (error) {
        dispatch(getAllProjectError());
      }
    })();
  }, [token]);

  useEffect(() => {
    setFetchingTasks(true);
    taskApi
      .getTasksByUser()
      .then((res: any) => {
        setTasksList(res.tasks);
        setFetchingTasks(false);
      })
      .catch((err: any) => {
        showMessage("error", err.response.data.message, 2);
        setFetchingTasks(false);
      });
  }, []);

  return (
    <>
      <Modal
        open={openCreateProject}
        footer={null}
        onCancel={() => setOpenCreateProject(false)}
      >
        <ProjectForm
          title="Create New Project"
          useCase="create"
          closeModal={setOpenCreateProject}
        />
      </Modal>

      <Modal
        open={openEditProject}
        footer={null}
        onCancel={() => setOpenEditProject(false)}
      >
        <ProjectForm
          title="Edit Project Info"
          useCase="edit"
          closeModal={setOpenEditProject}
          projectDetail={{ ...projectDetail }}
          key={projectDetail?._id}
        />
      </Modal>
      {contextHolder}
      <Row className="dashboard" justify="space-between">
        <Col className="projects_list" span={10}>
          <div className="projects_list_header">
            <Title level={4}>Your Projects</Title>
            <Tooltip title="Create new project">
              <Button
                onClick={() => setOpenCreateProject(true)}
                size="small"
                type="primary"
                shape="circle"
                icon={<PlusOutlined />}
              />
            </Tooltip>
          </div>
          <ProjectsList
            listProject={listProject}
            setOpenEditProject={setOpenEditProject}
            setProjectDetail={setProjectDetail}
          />
        </Col>
        <Divider type="vertical" />
        <Col className="tasks_list" span={12}>
          <div className="tasks_list_header">
            <Title level={4}>Your Tasks</Title>
          </div>
          {fetchingTasks ? <Skeleton /> : <TasksList tasksList={tasksList} />}
        </Col>
      </Row>
    </>
  );
};

export default Dashboard;
