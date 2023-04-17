import React from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { Breadcrumb, Tabs, Space } from "antd";
import MemberList from "../Members/MemberList";
import ProjectInfo from "../../components/projectForm/ProjectInfo";
import { Link } from "react-router-dom";

const ProjectDetail: React.FC = () => {
  const params = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const breadcrumbItem = [
    { title: <Link to="/">Home (Project List)</Link> },
    { title: "Project Name" },
  ];

  const tabItems = [
    {
      label: "General Information",
      key: "General Information",
      children: <ProjectInfo useCase="info" />,
    },
    { label: "Stages", key: "Stages", children: "Stages Content" },
    { label: "Members", key: "Members", children: <MemberList /> },
  ];

  const handleTabLick = (tabLabel: string) => {
    setSearchParams({ currentTab: tabLabel });
  };

  return (
    <div className="project-detail">
      <Space direction="vertical" size="large" style={{ display: "flex" }}>
        <Breadcrumb items={breadcrumbItem} />
        <Tabs
          onTabClick={handleTabLick}
          defaultActiveKey="Members"
          type="card"
          size="large"
          items={tabItems}
        />
      </Space>
    </div>
  );
};

export default ProjectDetail;
