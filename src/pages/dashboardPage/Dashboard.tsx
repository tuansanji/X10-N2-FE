import { useEffect, useState } from "react";
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
import {
  Col,
  Divider,
  Row,
  Typography,
  Button,
  Tooltip,
  Modal,
  Skeleton,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import ProjectForm from "../../components/projectForm/ProjectForm";
import useMessageApi, {
  UseMessageApiReturnType,
} from "../../components/support/Message";
import ProjectsList from "./ProjectsList";
import taskApi from "../../services/api/taskApi";
import TasksList from "./TasksList";
import { useTranslation } from "react-i18next";

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
  createdBy: UserInfo;
  description?: string;
  startDate: Date;
  type: string;
  _id: string;
  createdDate: Date;
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
  const { t, i18n } = useTranslation(["content", "base"]);

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
        setFetchingTasks(false);
      });
  }, [projectDetail]);

  return (
    <>
      <Modal
        open={openCreateProject}
        footer={null}
        onCancel={() => setOpenCreateProject(false)}
      >
        <ProjectForm
          title={`${t("content:form.create project")}`}
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
          title={`${t("content:form.edit project")}`}
          useCase="edit"
          setProjectDetail={setProjectDetail}
          closeModal={setOpenEditProject}
          projectDetail={{ ...projectDetail }}
          key={projectDetail?._id}
        />
      </Modal>
      {contextHolder}
      <Row className="dashboard" justify="space-between">
        <Col className="projects_list" span={10}>
          <div className="projects_list_header">
            <Title level={4}>{t("content:dashboardProjectsListTitle")}</Title>
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
            <Title level={4}>{t("content:dashbaordTasksListTitle")}</Title>
          </div>
          {fetchingTasks ? (
            <Skeleton />
          ) : (
            <TasksList
              tasksList={tasksList}
              setTasksList={setTasksList}
              showMessage={showMessage}
            />
          )}
        </Col>
      </Row>
    </>
  );
};

export default Dashboard;
