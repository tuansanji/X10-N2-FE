import { useEffect, useState } from "react";
import {
  getAllProjectError,
  getAllProjectStart,
  getAllProjectSuccess,
} from "../../redux/slice/projectSlice";

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
} from "antd";
import { ColumnsType } from "antd/es/table";
import { PlusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import ProjectForm from "../../components/projectForm/ProjectForm";

const { Title, Text } = Typography;

interface ProjectsListType {
  listProject: any;
}

interface ProjectsDataType {
  key: string;
  name: string;
  status: string;
  members: any;
}

const ProjectsList: React.FC<ProjectsListType> = ({ listProject }) => {
  const columns: ColumnsType<ProjectsDataType> = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (_, record: ProjectsDataType) => {
        return (
          <>
            <Link to={`project/${record.key}`}>{record.name}</Link>
          </>
        );
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (_, { status }) => {
        let bgColor: string = "";
        switch (status) {
          case "ongoing":
            bgColor = "#F0E155";
            break;
          case "completed":
            bgColor = "#44CB39";
            break;
          case "suspended":
            bgColor = "#EC2B2B";
            break;
          case "preparing":
            bgColor = "#2E55DE";
            break;
          default:
            bgColor = "transparent";
            break;
        }
        return (
          <>
            <Button
              type="primary"
              shape="round"
              style={{ backgroundColor: bgColor }}
            >
              <Text className="btn_status" strong>
                {status.toUpperCase()}
              </Text>
            </Button>
          </>
        );
      },
    },
    {
      title: "Members",
      dataIndex: "members",
      key: "members",
      render: (_, record: ProjectsDataType) => {
        return (
          <>
            <div>Test</div>
          </>
        );
      },
    },
  ];

  const data: ProjectsDataType[] = listProject.projects.map((project: any) => {
    return {
      key: project._id,
      name: project.name,
      status: project.status,
      members: project.code,
    };
  });

  return (
    <>
      <div className="projects_list_item">
        <Table
          columns={columns}
          dataSource={data}
          bordered
          pagination={false}
        />
      </div>
    </>
  );
};

// const ItemsList: React.FC<ProjectsListType> = ({ project }) => {
//   return (
//     <div key={project._id} className="tasks_list_item">
//       <Link
//         to={`/${project._id}`}
//         style={{ display: "flex", flexDirection: "column" }}
//       >
//         {project.name}
//       </Link>
//     </div>
//   );
// };

const Dashboard: React.FC = () => {
  const [openCreateProject, setOpenCreateProject] = useState<boolean>(false);
  const dispatch = useDispatch();
  const token = useAppSelector((state: RootState) => state.auth.userInfo.token);
  const listProject = useAppSelector(
    (state: any) => state.project?.listProject
  );
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
      <Row className="dashboard" justify="space-between">
        <Col className="projects_list" span={11}>
          <div className="projects_list_header">
            <Title level={4}>Your Projects</Title>
            <Tooltip title="Create new project">
              <Button
                onClick={() => setOpenCreateProject(true)}
                type="primary"
                shape="circle"
                icon={<PlusOutlined />}
              />
            </Tooltip>
          </div>
          <ProjectsList listProject={listProject} />
        </Col>
        <Divider type="vertical" />
        <Col className="tasks_list" span={11}>
          <Title level={4}>Your Tasks</Title>
          {/* {listProject.projects?.map((project: any) => {
          return <ItemsList project={project} />;
        })} */}
        </Col>
      </Row>
    </>
  );
};

export default Dashboard;
