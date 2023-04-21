import FormStages from "./FormStages";
import { IProject } from "../../components/sidebar/Sidebar";
import Loading from "../../components/support/Loading";
import { listStages } from "../../data/statges";
import Search from "antd/es/input/Search";
import axios from "axios";
import moment from "moment";
import React, { useEffect, useMemo, useRef, useState } from "react";
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
  startDate: Date;
  endDateExpected: Date;
  reviews?: object[];
  endDateActual?: Date;
}
interface IStagesData {
  stages: IStages[];
  currentPage: number;
  total?: number;
  totalPages: number;
}
interface DataType {
  key?: string;
  name: string;
  startDate: string;
  endDateExpected: string;
  endDateActual: string;
}
type DataIndex = keyof DataType;
const StagesPage: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [messageApi, contextHolder] = message.useMessage();
  const [createStages, setCreateStages] = useState<boolean>(false);
  const [searchInput, setSearchInput] = useState<string>("");
  const [stagesData, setStagesData] = useState<IStagesData>();
  const [finishCount, setFinishCount] = useState<number>(0);
  const [editStages, setEditStages] = useState<{
    status: boolean;
    stages: IStages | {};
  }>({
    status: false,
    stages: {},
  });
  const params = useParams();
  const token: string = useSelector((state: any) => state.auth.userInfo.token);

  useEffect(() => {
    axios
      .get(
        `${process.env.REACT_APP_BACKEND_URL}/project/stages/${params.projectId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((res) => {
        setStagesData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        message.error(err.response.data.message);
      });
  }, [finishCount, token]);

  const confirm = (stages: DataType) => {
    messageApi.open({
      key: stages.key,
      type: "loading",
      content: "Loading...",
    });
    axios
      .post(
        `${process.env.REACT_APP_BACKEND_URL}/stage/delete/${stages.key}`,
        stages.key,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((res) => {
        messageApi.open({
          key: stages.key,
          type: "success",
          content: res.data.message,
          duration: 2,
        });
        setFinishCount((prev) => prev + 1);
      })
      .catch((err) => {
        messageApi.open({
          key: stages.key,
          type: "error",
          content: err.response.data.message,
          duration: 2,
        });
      });
  };

  const handleSearchMember = (value: string) => {
    setLoading(true);
    if (value) {
      axios
        .get(
          `${process.env.REACT_APP_BACKEND_URL}/stage/search?name=${value}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
        .then((res) => {
          setStagesData(res.data);

          setLoading(false);
          setSearchInput("");
        })
        .catch((err) => {
          setLoading(false);
          message.error(err.response.data.message);
        });
    } else {
      axios
        .get(
          `${process.env.REACT_APP_BACKEND_URL}/project/stages/${params.projectId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
        .then((res) => {
          setStagesData(res.data);
          setLoading(false);
        })
        .catch((err) => {
          setLoading(false);
          message.error(err.response.data.message);
        });
    }
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
        title: "end Date Expected",
        dataIndex: "endDateExpected",
        key: "endDateExpected",
        sorter: (a, b) => {
          const startDateA = moment(a.endDateExpected, "YYYY-MM-DD").toDate();
          const startDateB = moment(b.endDateExpected, "YYYY-MM-DD").toDate();
          return startDateA.getTime() - startDateB.getTime();
        },
      },
      {
        title: "Actual end date",
        dataIndex: "endDateActual",
        key: "endDateActual",
        sorter: (a, b) => {
          const startDateA = moment(a.endDateActual, "YYYY-MM-DD").toDate();
          const startDateB = moment(b.endDateActual, "YYYY-MM-DD").toDate();
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
    [stagesData]
  );

  const data: DataType[] = useMemo(() => {
    if (!stagesData?.stages) return [];

    return stagesData.stages.map((stage: IStages) => ({
      key: stage._id,
      name: stage.name,
      startDate: moment(stage.startDate).format("YYYY-MM-DD"),
      endDateExpected: moment(stage.endDateExpected).format("YYYY-MM-DD"),
      endDateActual: stage.endDateActual
        ? moment(stage.endDateActual).format("YYYY-MM-DD")
        : "",
    }));
  }, [stagesData?.stages]);

  const pagination: TableProps<any>["pagination"] = {
    position: ["bottomCenter"],
  };

  return (
    <div className="content_project-page stages_page">
      {loading && <Loading />}
      {contextHolder}
      <div className="project_page-header ">
        <div className="header_left">
          <Button
            type="primary"
            size={"large"}
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
              placeholder="Enter stages name..."
              size="large"
              style={{ width: "300px" }}
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
          endDateActual={false}
          setCreateStages={setCreateStages}
          setFinishCount={setFinishCount}
        />
      )}
      {editStages.status && (
        <FormStages
          setFinishCount={setFinishCount}
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
