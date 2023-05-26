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
import { setQuery } from "../../redux/slice/paramsSlice";

const { Title } = Typography;

export interface UserInfo {
  avatar: string;
  fullName: string;
  username: string;
  email: string;
  _id: string;
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

export interface PageType {
  pageIndex: number;
  total: number;
  initialTotal?: number;
}

const Dashboard: React.FC = () => {
  const [openCreateProject, setOpenCreateProject] = useState<boolean>(false);
  const dispatch = useDispatch();
  const token = useAppSelector((state: RootState) => state.auth.userInfo.token);
  const projects = useAppSelector((state: any) => state.project);
  const { showMessage, contextHolder }: UseMessageApiReturnType =
    useMessageApi();
  const [openEditProject, setOpenEditProject] = useState<boolean>(false);
  const [fetchingTasks, setFetchingTasks] = useState<boolean>(false);
  const [projectDetail, setProjectDetail] = useState<any>();
  const [tasksList, setTasksList] = useState<TasksType[]>([]);
  const { t, i18n } = useTranslation(["content", "base"]);
  const [projectPagination, setProjectPagination] = useState<PageType>({
    pageIndex: 1,
    total: null as unknown as number,
  });
  const queryParams = useAppSelector((state: any) => state.queryParams);

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
        setProjectPagination({
          ...projectPagination,
          total: res.data.total,
          pageIndex: res.data.currentPage,
        });
      } catch (error) {
        dispatch(getAllProjectError());
      }
    })();
  }, [token]);

  useEffect(() => {
    setFetchingTasks(true);
    taskApi
      .getTasksByUser({ sort: "deadlineDesc" })
      .then((res: any) => {
        setTasksList(res.tasks);
        setFetchingTasks(false);
        dispatch(
          setQuery({
            ...queryParams,
            taskTableParams: {
              total: res.total,
              page: res.currentPage,
              sort: "deadlineDesc",
            },
          })
        );
      })
      .catch((err: any) => {
        setTasksList([]);
        setFetchingTasks(false);
      });
  }, []);

  return (
    <>
      {/* Modal Form Tạo Project */}
      <Modal
        open={openCreateProject}
        footer={null}
        onCancel={() => setOpenCreateProject(false)}
      >
        <ProjectForm
          title={`${t("content:form.create project")}`}
          useCase="create"
          closeModal={setOpenCreateProject}
          projectPagination={projectPagination}
          setProjectPagination={setProjectPagination}
        />
      </Modal>

      {/* Modal Form Edit Project */}
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

      {/* Main content */}
      <Row className="dashboard" justify="space-between">
        <Col className="projects_list" xl={10} sm={24}>
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
          {projects.isFetching ? (
            <Skeleton />
          ) : (
            <ProjectsList
              setOpenEditProject={setOpenEditProject}
              setProjectDetail={setProjectDetail}
              projectPagination={projectPagination}
              setProjectPagination={setProjectPagination}
            />
          )}
        </Col>

        <Divider type="horizontal" className="horizontal_divider" />
        <Col className="tasks_list" xl={12} sm={24}>
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
