import FormStages from "./FormStages";
import StageReview from "./StageReview";
import { useAxios } from "../../components/hook/useAxios";
import Loading from "../../components/support/Loading";
import { listStages } from "../../data/statges";
import { useAppDispatch, useAppSelector } from "../../redux/hook";
import { reloadSidebar } from "../../redux/slice/menuSlice";
import { ProjectType } from "../projectPage/ProjectDetail";
import Search from "antd/es/input/Search";
import axios from "axios";
import moment from "moment";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import {
  Button,
  message,
  Modal,
  Pagination,
  Popconfirm,
  Space,
  Table,
} from "antd";
import {
  DeleteFilled,
  EditFilled,
  EyeFilled,
  EyeOutlined,
} from "@ant-design/icons";
import useMessageApi, {
  UseMessageApiReturnType,
} from "../../components/support/Message";

import type { ColumnsType } from "antd/es/table";

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
  total: number;
  totalPages: number;
}
interface DataType {
  key?: string;
  name: string;
  startDate: string;
  endDateExpected: string;
  endDateActual: string;
}

interface PropTypes {
  projectDetail?: ProjectType;
}
const StagesPage: React.FC<PropTypes> = (props: PropTypes) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [createStages, setCreateStages] = useState<boolean>(false);
  const [searchInput, setSearchInput] = useState<string>();
  const [finishCount, setFinishCount] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [stageCurrentReview, setStageCurrentReview] = useState<string>("");
  const [stagesData, setStagesData] = useState<IStagesData>({
    stages: [],
    currentPage: 1,
    total: 1,
    totalPages: 1,
  });
  const [editStages, setEditStages] = useState<{
    status: boolean;
    stages: IStages | {};
  }>({
    status: false,
    stages: {},
  });
  const [searchParams, setSearchParams] = useSearchParams();
  const searchRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const params = useParams();
  const dispatch = useAppDispatch();
  const { showMessage, contextHolder }: UseMessageApiReturnType =
    useMessageApi();
  const token: string = useAppSelector(
    (state: any) => state.auth.userInfo.token
  );

  // const { responseData, isLoading } = useAxios(
  //   "get",
  //   `/project/stages/${params.projectId}?page=${searchParams.get("page")}`,
  //   [finishCount, token, pageNumber]
  // );
  // lấy dữ liệu stages theo page
  useEffect(() => {
    setLoading(true);
    axios
      .get(
        `${process.env.REACT_APP_BACKEND_URL}/project/stages/${
          params.projectId
        }?page=${searchParams.get("page")}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((res) => {
        setStagesData(res.data);
        setLoading(false);
        dispatch(reloadSidebar());
      })
      .catch((err) => {
        setLoading(false);
        message.error(err.response.data.message);
      });
  }, [finishCount, token, pageNumber]);
  // hám xóa
  const confirm = (stages: DataType) => {
    showMessage("loading", "Loading...");

    axios
      .post(
        `${process.env.REACT_APP_BACKEND_URL}/stage/delete/${stages.key}`,
        stages.key,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((res) => {
        showMessage("success", res.data?.message, 2);

        setFinishCount((prev) => prev + 1);
      })
      .catch((err) => {
        showMessage("error", err.response.data?.message, 2);
      });
  };
  //hàm gọi api khi search
  const handleChangeSearch = (event: any) => {
    let value = event?.target.value;
    setSearchInput(value);

    setSearchParams({
      currentTab: "Stages",
      name: value || "",
      page: (searchParams.get("page") as string) || "1",
    });
  };
  //hàm modal
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    setPageNumber(Number(searchParams.get("page")) || 1);
  }, []);
  // api search kết hợp url searchParams
  useEffect(() => {
    if (searchRef.current) {
      clearTimeout(searchRef.current);
    }
    searchRef.current = setTimeout(() => {
      if (searchParams.get("name")) {
        axios
          .get(
            `${process.env.REACT_APP_BACKEND_URL}/project/stages/search/${
              params.projectId
            }?page=1&name=${searchParams.get("name")?.split("+").join(" ")}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          )
          .then((res) => {
            setStagesData(res.data);

            setSearchParams({
              currentTab: "Stages",
              name: (searchParams.get("name") as string) || "",
              page: "1",
            });
          })
          .catch((err) => {});
      }
    }, 1000);
  }, [searchInput]);

  //hám search
  const handleSearchStage = (value: string) => {
    setLoading(true);
    if (value) {
      axios
        .get(
          `${process.env.REACT_APP_BACKEND_URL}/project/stages/search/${params.projectId}?page=1&name=${value}`,
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
  //dữ liệu table
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
            <span
              onClick={() => {
                setIsModalOpen(true);
                setStageCurrentReview(record.key || "");
              }}
            >
              <EyeFilled style={{ fontSize: "16px", cursor: "pointer" }} />
            </span>
          </Space>
        ),
      },
    ],
    [stagesData]
  );
  // dữ liệu stages trong table
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

  //DATA ĐỂ TEST THỬ VÀO TRANG DANH SÁCH TASK
  // const data: any[] = listStages.map((data) => {
  //   return {
  //     key: data._id,
  //     name: data.name,
  //     startDate: data.startDate,
  //     endDateExpected: data.estimatedEndDate,
  //     endDateActual: data.actualEndDate,
  //   };
  // });

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
            Create Stage
          </Button>
        </div>
        <div className="header_right">
          <Space wrap>
            <Search
              value={(searchParams.get("name") as string) || ""}
              allowClear
              onChange={(event: any) => {
                handleChangeSearch(event);
              }}
              onSearch={handleSearchStage}
              placeholder="Enter stages name..."
              size="large"
              style={{ width: "300px" }}
            />
          </Space>
        </div>
      </div>
      <div className="project_page-table">
        <Table
          columns={columns}
          dataSource={data}
          pagination={{
            hideOnSinglePage: true,
          }}
        />
        <div className="pagination">
          <Pagination
            current={Number(searchParams.get("page") || 1)}
            defaultCurrent={stagesData.totalPages}
            total={stagesData.total}
            onChange={(page: number) => {
              setPageNumber(page);

              setSearchParams({
                currentTab: "Stages",
                name: searchParams.get("name") as string,
                page: `${page}`,
              });
            }}
          />
        </div>
      </div>
      {createStages && (
        <FormStages
          title="Create Stages"
          button="Create"
          status={false}
          endDateActual={false}
          setCreateStages={setCreateStages}
          setFinishCount={setFinishCount}
          showMessage={showMessage}
        />
      )}
      {editStages.status && (
        <FormStages
          showMessage={showMessage}
          setFinishCount={setFinishCount}
          editStages={editStages}
          title="Edit Stages"
          button="Update"
          projectDetail={props.projectDetail}
          setEditStages={setEditStages}
        />
      )}

      <Modal
        title=""
        width="70%"
        open={isModalOpen}
        onCancel={handleCancel}
        maskClosable={false}
        style={{ top: "50px" }}
        footer={[]}
      >
        <StageReview stageId={stageCurrentReview} />
      </Modal>
    </div>
  );
};

export default StagesPage;
