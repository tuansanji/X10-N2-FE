import { IProject } from "../../components/sidebar/Sidebar";
import { Link } from "react-router-dom";
import Loading from "../../components/support/Loading";
import { DeleteFilled, EditFilled, SearchOutlined } from "@ant-design/icons";
import { Button, Input, Select, Space, Table, Tag } from "antd";
import moment from "moment";
import React, { useMemo, useRef, useState } from "react";
import Highlighter from "react-highlight-words";
import { useSelector } from "react-redux";
import type { InputRef } from "antd";
import type { ColumnsType, TableProps, ColumnType } from "antd/es/table";
import type { SizeType } from "antd/es/config-provider/SizeContext";
import type { FilterConfirmProps } from "antd/es/table/interface";

// import { TablePaginationPosition } from 'antd/lib/table';
interface DataType {
  key: string;
  name: string;
  code: string;
  status: string;
  startDate: Date;
  endDate: Date;
}
type DataIndex = keyof DataType;
const ListProject: React.FC = () => {
  const listProject = useSelector((state: any) => state.project?.listProject);
  const loading = useSelector((state: any) => state.project?.isFetching);
  const [size, setSize] = useState<SizeType>("large");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef<InputRef>(null);

  const handleSearch = (
    selectedKeys: string[],
    confirm: (param?: FilterConfirmProps) => void,
    dataIndex: DataIndex
  ) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText("");
  };
  const handleDeleteProject = (project: DataType) => {
    console.log(project);
  };
  const handleEditProject = (project: DataType) => {};
  const getColumnSearchProps = (dataIndex: DataIndex): ColumnType<DataType> => {
    return {
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
        close,
      }) => (
        <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
          <Input
            ref={searchInput}
            placeholder={`Search ${dataIndex}`}
            value={selectedKeys[0]}
            onChange={(e) =>
              setSelectedKeys(e.target.value ? [e.target.value] : [])
            }
            onPressEnter={() =>
              handleSearch(selectedKeys as string[], confirm, dataIndex)
            }
            style={{ marginBottom: 8, display: "block" }}
          />
          <Space>
            <Button
              type="primary"
              onClick={() =>
                handleSearch(selectedKeys as string[], confirm, dataIndex)
              }
              icon={<SearchOutlined />}
              size="small"
              style={{ width: 90 }}
            >
              Search
            </Button>
            <Button
              onClick={() => clearFilters && handleReset(clearFilters)}
              size="small"
              style={{ width: 90 }}
            >
              Reset
            </Button>
            <Button
              type="link"
              size="small"
              onClick={() => {
                confirm({ closeDropdown: false });
                setSearchText((selectedKeys as string[])[0]);
                setSearchedColumn(dataIndex);
              }}
            >
              Filter
            </Button>
            <Button
              type="link"
              size="small"
              onClick={() => {
                close();
              }}
            >
              close
            </Button>
          </Space>
        </div>
      ),
      filterIcon: (filtered: boolean) => (
        <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
      ),
      onFilter: (value, record) =>
        record[dataIndex]
          .toString()
          .toLowerCase()
          .includes((value as string).toLowerCase()),
      onFilterDropdownOpenChange: (visible) => {
        if (visible) {
          setTimeout(() => searchInput.current?.select(), 100);
        }
      },
      render: (_, record) =>
        searchedColumn === dataIndex ? (
          <span
            style={{
              color: dataIndex === "name" ? "blue" : "inherit",
              cursor: dataIndex === "name" ? "pointer" : "inherit",
            }}
          >
            {" "}
            <Highlighter
              highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
              searchWords={[searchText]}
              autoEscape
              textToHighlight={
                record[dataIndex] ? record[dataIndex].toString() : ""
              }
            />
          </span>
        ) : (
          <span
            style={{
              color: dataIndex === "name" ? "blue" : "inherit",
              cursor: dataIndex === "name" ? "pointer" : "inherit",
            }}
          >
            {record[dataIndex] as string}
          </span>
        ),
    };
  };

  const columns: ColumnsType<DataType> = useMemo(
    () => [
      {
        title: "Name",
        dataIndex: "name",
        key: "name",

        sorter: (a, b) => a.name.localeCompare(b.name),
        // render: (text: string) => <p>{text}</p>,
        ...getColumnSearchProps("name"),
      },
      {
        title: "Code",
        dataIndex: "code",
        key: "code",
        sorter: (a, b) => a.code.localeCompare(b.code),
        ...getColumnSearchProps("code"),
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
        render: (_, record: DataType) => (
          <Space size="middle">
            <span
              onClick={() => {
                handleEditProject(record);
              }}
            >
              <EditFilled style={{ fontSize: "16px", cursor: "pointer" }} />
            </span>
            <span
              onClick={() => {
                handleDeleteProject(record);
                console.log(_);
              }}
            >
              <DeleteFilled style={{ fontSize: "16px", cursor: "pointer" }} />
            </span>
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
                  name: <Link to={`/${project._id}`}>{project.name}</Link>,
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
        <div className="header_left">
          <Button type="primary" size={size}>
            Add Member
          </Button>
        </div>
        <div className="header_right">
          <Space wrap>
            <Button type="default" size={size} icon={<SearchOutlined />}>
              Search
            </Button>
            <Select
              defaultValue="all"
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
