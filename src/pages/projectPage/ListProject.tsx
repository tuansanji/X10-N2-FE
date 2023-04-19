import { IProject } from "../../components/sidebar/Sidebar";
import { Link, useSearchParams } from "react-router-dom";
import Loading from "../../components/support/Loading";
import { DeleteFilled, EditFilled, SearchOutlined } from "@ant-design/icons";
import {
  Button,
  Input,
  Select,
  Space,
  Table,
  Tag,
  Modal,
  message,
  Popconfirm,
} from "antd";
import moment from "moment";
import React, { useMemo, useRef, useState } from "react";
import Highlighter from "react-highlight-words";
import { useSelector } from "react-redux";
import slugify from "slugify";
import type { InputRef } from "antd";
import type { ColumnsType, TableProps, ColumnType } from "antd/es/table";
import type { SizeType } from "antd/es/config-provider/SizeContext";
import type { FilterConfirmProps } from "antd/es/table/interface";
import ProjectForm from "../../components/projectForm/ProjectForm";

// import { TablePaginationPosition } from 'antd/lib/table';
export interface DataType {
  key: string;
  name: string;
  code: string;
  status: string;
  startDate: Date;
  endDate: Date;
}
type DataIndex = keyof DataType;
const { Search } = Input;

const ListProject: React.FC = () => {
  const listProject = useSelector((state: any) => state.project?.listProject);
  const loading = useSelector((state: any) => state.project?.isFetching);
  const [size, setSize] = useState<SizeType>("large");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [openCreateProject, setOpenCreateProject] = useState<boolean>(false);
  const [projectDetail, setProjectDetail] = useState<any>();
  const [openEditProject, setOpenEditProject] = useState<boolean>(false);
  const [searchInput, setSearchInput] = useState<string>("");

  const confirm = (stages: DataType) => {
    console.log(stages);
    message.success("Click on Yes");
    message.error("Click on No");
  };

  const handleEditProject = (indexValue: number) => {
    let projectDetail = listProject.projects.filter(
      (project: DataType, index: number) => {
        return indexValue === index;
      }
    );

    setProjectDetail(projectDetail[0]);
    setOpenEditProject(true);
  };

  const handleDeleteProject = (project: DataType) => {
    console.log(project);
  };

  const handleSearchMember = (value: string) => {
    setSearchInput("");
    console.log(value);
  };

  const columns: ColumnsType<DataType> = useMemo(
    () => [
      {
        title: "Name",
        dataIndex: "name",
        key: "name",

        sorter: (a, b) => a.name.localeCompare(b.name),
        render: (_, record: DataType) => {
          return (
            <>
              <Link to={`/${record.key}`}>{record.name}</Link>
            </>
          );
        },
      },
      {
        title: "Code",
        dataIndex: "code",
        key: "code",
        sorter: (a, b) => a.code.localeCompare(b.code),
      },
      {
        title: "Status",
        key: "status",
        dataIndex: "status",
        sorter: (a, b) => a.status.localeCompare(b.status),

        render: (_, { status }) => {
          let bgColor: string = "";
          switch (status) {
            //   case "open":
            //     bgColor = "#44CB39";
            //     break;
            case "ongoing":
              bgColor = "#F0E155";
              break;
            case "complete":
              bgColor = "#44CB39";
              break;
            case "suspension":
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
            <div className="project_status">
              <Button
                className="btn btn_status"
                type="primary"
                shape="round"
                // icon={<DownloadOutlined />}
                style={{ backgroundColor: bgColor }}
                size={"small"}
              >
                <span className=""> {status.toUpperCase()}</span>
              </Button>
            </div>
          );
        },
      },
      {
        title: "Start date",
        dataIndex: "startDate",
        key: "startDate",
        sorter: (a, b) => {
          const startDateA = moment(a.startDate, "DD/MM/YYYY").toDate();
          const startDateB = moment(b.startDate, "DD/MM/YYYY").toDate();
          return startDateA.getTime() - startDateB.getTime();
        },
      },
      {
        title: "End date",
        dataIndex: "endDate",
        key: "endDate",
        sorter: (a, b) => {
          const startDateA = moment(a.endDate, "DD/MM/YYYY").toDate();
          const startDateB = moment(b.endDate, "DD/MM/YYYY").toDate();
          return startDateA.getTime() - startDateB.getTime();
        },
      },
      {
        title: "Action",
        key: "action",
        render: (_, record: DataType, index: number) => (
          <Space size="middle">
            <span onClick={() => handleEditProject(index)}>
              <EditFilled style={{ fontSize: "16px", cursor: "pointer" }} />
            </span>
            <Popconfirm
              placement="topRight"
              title="Delete the project"
              description="Are you sure to delete this project?"
              onConfirm={() => confirm(record)}
              okText="Yes"
              cancelText="No"
            >
              <DeleteFilled style={{ fontSize: "16px", cursor: "pointer" }} />
            </Popconfirm>
          </Space>
        ),
      },
    ],
    [searchText, listProject]
  );

  const data: DataType[] = useMemo(() => {
    let newProject =
      listProject.projects && listProject.projects.length > 0
        ? [
            ...listProject.projects
              .filter((project: IProject) => {
                if (statusFilter === "all") {
                  return true;
                } else {
                  return project.status === statusFilter;
                }
              })
              .map((project: IProject, index: number) => {
                return {
                  key: project._id,
                  name: project.name,
                  code: project.code,
                  status: project.status,
                  startDate: moment(project.startDate).format("DD/MM/YYYY "),
                  endDate: moment(project.estimatedEndDate).format(
                    "DD/MM/YYYY "
                  ),
                };
              }),
          ]
        : [];
    return newProject;
  }, [listProject, statusFilter]);
  const pagination: TableProps<any>["pagination"] = {
    position: ["bottomCenter"],
  };
  const handleChange = (value: string) => {
    setStatusFilter(value);
  };
  return (
    <div className="content_project-page">
      {loading && <Loading />}
      <div className="project_page-header">
        {/* Create New Project Modal */}
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

        {/* Edit Project Info Modal */}
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

        {/* Project List Main Content */}
        <div className="header_left">
          <Button
            onClick={() => setOpenCreateProject(true)}
            type="primary"
            size={size}
          >
            Create Project
          </Button>
        </div>
        <div className="header_right">
          <Space wrap>
            <Search
              value={searchInput}
              allowClear
              onChange={(event: any) => setSearchInput(event?.target.value)}
              onSearch={handleSearchMember}
              placeholder="Enter name or code..."
              size="large"
              style={{ width: "300px" }}
            />
            <Select
              defaultValue="all"
              size={size}
              style={{ width: 120 }}
              onChange={handleChange}
              options={[
                { value: "all", label: "All" },
                { value: "complete", label: "Complete" },
                { value: "suspension", label: "Suspension" }, //tạm đình chỉ
                { value: "open", label: "Open" }, //Chuẩn bị
                { value: "ongoing", label: "Ongoing" }, //đang thực hiện
                // { value: "processing", label: "Processing" }, //đang thực hiện
                // { value: "preparing", label: "Preparing" }, //chuẩn bị
              ]}
            />
          </Space>
        </div>
      </div>
      <div className="project_page-table">
        <Table columns={columns} dataSource={data} pagination={pagination} />
      </div>
    </div>
  );
};

export default ListProject;
