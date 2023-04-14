import { IProject } from "../../components/sidebar/Sidebar";
import { DownloadOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Select, Space, Table, Tag } from "antd";
import moment from "moment";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import type { ColumnsType, TableProps } from "antd/es/table";
import type { SizeType } from "antd/es/config-provider/SizeContext";
// import { TablePaginationPosition } from 'antd/lib/table';
interface DataType {
  key: string;
  name: string;
  code: string;
  status: string;
  startDate: Date;
  endDate: Date;
}

const ListProject: React.FC = () => {
  const listProject = useSelector((state: any) => state.project?.listProject);
  const [size, setSize] = useState<SizeType>("large");

  // const columns: ColumnsType<DataType> = [
  //   {
  //     title: "Name",
  //     dataIndex: "name",
  //     key: "name",
  //     render: (text) => <a>{text}</a>,
  //   },
  //   {
  //     title: "Code",
  //     dataIndex: "code",
  //     key: "code",
  //   },

  //   {
  //     title: "Status",
  //     key: "status",
  //     dataIndex: "status",
  //     render: (_, { status }) => {
  //       let bgColor: string = "";
  //       switch (status) {
  //         case "open":
  //           bgColor = "#44CB39";
  //           break;
  //         case "ongoing":
  //           bgColor = "#F0E155";
  //           break;
  //         default:
  //           bgColor = "transparent";

  //           break;
  //       }
  //       return (
  //         <div className="project_status">
  //           <Button
  //             className="btn btn_status"
  //             type="primary"
  //             shape="round"
  //             // icon={<DownloadOutlined />}
  //             style={{ backgroundColor: bgColor }}
  //             size={"small"}
  //           >
  //             <span className=""> {status.toUpperCase()}</span>
  //           </Button>
  //         </div>
  //       );
  //     },
  //   },
  //   {
  //     title: "Start date",
  //     dataIndex: "startDate",
  //     key: "startDate",
  //   },
  //   {
  //     title: "End date",
  //     dataIndex: "endDate",
  //     key: "endDate",
  //   },
  //   {
  //     title: "Action",
  //     key: "action",
  //     render: (_, record) => (
  //       <Space size="middle">
  //         <a>Edit</a>
  //         <a>Delete</a>
  //       </Space>
  //     ),
  //   },
  // ];

  // const data: DataType[] = [
  //   ...listProject.projects.map((project: IProject, index: number) => {
  //     return {
  //       key: project._id,
  //       name: project.name,
  //       code: project.code,
  //       status: project.status,
  //       startDate: moment(project.startDate).format("DD/MM/YYYY "),
  //       endDate: moment(project.estimatedEndDate).format("DD/MM/YYYY "),
  //     };
  //   }),
  // ];
  // const pagination: TableProps<any>["pagination"] = {
  //   position: ["bottomCenter"],
  // };
  // const handleChange = (value: string) => {
  //   console.log(`selected ${value}`);
  // };
  return (
    <div className="content_project-page">
      {/* <div className="project_page-header">
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
                { value: "processing", label: "Processing" }, //đang thực hiện
                { value: "preparing", label: "Preparing" }, //chuẩn bị
              ]}
            />
          </Space>
        </div>
      </div>
      <div className="project_page-table">
        <Table columns={columns} dataSource={data} pagination={pagination} />
      </div> */}
    </div>
  );
};

export default ListProject;
