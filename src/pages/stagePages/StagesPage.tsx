import FormStages from "./FormStages";
import { IProject } from "../../components/sidebar/Sidebar";
import Loading from "../../components/support/Loading";
import { listStages } from "../../data/statges";
import Search from "antd/es/input/Search";
import moment from "moment";
import React, { useMemo, useRef, useState } from "react";
import Highlighter from "react-highlight-words";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import slugify from "slugify";
import {
  Button,
  Input,
  message,
  Modal,
  Popconfirm,
  Select,
  Space,
  Table,
  Tag,
} from "antd";
import {
  DeleteFilled,
  EditFilled,
  ExclamationCircleOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import type { InputRef } from "antd";
import type { ColumnsType, TableProps, ColumnType } from "antd/es/table";
import type { SizeType } from "antd/es/config-provider/SizeContext";
import type { FilterConfirmProps } from "antd/es/table/interface";

// import { TablePaginationPosition } from 'antd/lib/table';

export interface IStages {
  _id?: string;
  name: string;
  startDate: string;
  estimatedEndDate: string;
  status: string;
  actualEndDate?: string;
  createdDate?: string;
  startEndDate?: Date[];
}
interface DataType {
  key?: string;
  name: string;
  status: string;
  startDate: string;
  estimatedEndDate: string;
  actualEndDate: string;
  createdDate?: string;
}
type DataIndex = keyof DataType;
const StagesPage: React.FC = () => {
  const listProject = useSelector((state: any) => state.project?.listProject);
  const loading = useSelector((state: any) => state.project?.isFetching);
  const [size, setSize] = useState<SizeType>("large");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [createStages, setCreateStages] = useState<boolean>(false);
  const [searchInput, setSearchInput] = useState<string>("");

  const [editStages, setEditStages] = useState<{
    status: boolean;
    stages: IStages | {};
  }>({
    status: false,
    stages: {},
  });
  const params = useParams();

  const confirm = (stages: DataType) => {
    console.log(stages);

    message.success("Click on Yes");
    message.error("Click on No");
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
        render: (_, record: DataType) => (
          <Link to={`/${params.projectId}/${record.key}`}>{record.name}</Link>
        ),
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
          const startDateA = moment(a.startDate, "YYYY-MM-DD").toDate();
          const startDateB = moment(b.startDate, "YYYY-MM-DD").toDate();
          return startDateA.getTime() - startDateB.getTime();
        },
      },
      {
        title: "Estimated end date",
        dataIndex: "estimatedEndDate",
        key: "estimatedEndDate",
        sorter: (a, b) => {
          const startDateA = moment(a.estimatedEndDate, "YYYY-MM-DD").toDate();
          const startDateB = moment(b.estimatedEndDate, "YYYY-MM-DD").toDate();
          return startDateA.getTime() - startDateB.getTime();
        },
      },
      {
        title: "Actual end date",
        dataIndex: "actualEndDate",
        key: "actualEndDate",
        sorter: (a, b) => {
          const startDateA = moment(a.actualEndDate, "YYYY-MM-DD").toDate();
          const startDateB = moment(b.actualEndDate, "YYYY-MM-DD").toDate();
          return startDateA.getTime() - startDateB.getTime();
        },
      },
      {
        title: "Action",
        key: "action",
        render: (_, record: DataType) => (
          <Space size="middle">
            <span
              onClick={() => {
                setEditStages({
                  status: true,
                  stages: record,
                });
              }}
            >
              <EditFilled style={{ fontSize: "16px", cursor: "pointer" }} />
            </span>
            <Popconfirm
              placement="topRight"
              title="Delete the stages"
              description="Are you sure to delete this stages?"
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
    [listStages]
  );

  const data: DataType[] = useMemo(() => {
    let newStages =
      listStages && listStages.length > 0
        ? [
            ...listStages
              .filter((stage: IStages) => {
                if (statusFilter === "all") {
                  return true;
                } else {
                  return stage.status === statusFilter;
                }
              })
              .map((stage: IStages, index: number) => {
                return {
                  key: stage._id,
                  name: stage.name,

                  status: stage.status,
                  startDate: moment(stage.startDate).format("YYYY-MM-DD"),
                  actualEndDate: moment(stage.actualEndDate).format(
                    "YYYY-MM-DD"
                  ),
                  estimatedEndDate: moment(stage.estimatedEndDate).format(
                    "YYYY-MM-DD"
                  ),
                };
              }),
          ]
        : [];
    return newStages;
  }, [statusFilter]);
  const pagination: TableProps<any>["pagination"] = {
    position: ["bottomCenter"],
  };
  const handleChange = (value: string) => {
    setStatusFilter(value);
  };
  return (
    <div className="content_project-page stages_page">
      {/* {loading && <Loading />} */}
      <div className="project_page-header ">
        <div className="header_left">
          <Button
            type="primary"
            size={size}
            onClick={() => setCreateStages(true)}
          >
            Create Stages
          </Button>
        </div>
        <div className="header_right">
          <Space wrap>
            <Search
              value={searchInput}
              allowClear
              onChange={(event: any) => setSearchInput(event?.target.value)}
              onSearch={handleSearchMember}
              placeholder="Enter stage name..."
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
      {createStages && (
        <FormStages
          title="Create Stages"
          button="Create"
          status={false}
          actualEndDate={false}
          setCreateStages={setCreateStages}
        />
      )}
      {editStages.status && (
        <FormStages
          editStages={editStages}
          title="Edit Stages"
          button="Update"
          setEditStages={setEditStages}
        />
      )}
    </div>
  );
};

export default StagesPage;
