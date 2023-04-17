import { deslugify } from "../../ultils/decode";
import MemberList from "../Members/MemberList";
import StagesPage from "../stagePages/StagesPage";
import { Breadcrumb, Space, Tabs } from "antd";
import React from "react";
import { useParams, useSearchParams } from "react-router-dom";

const ProjectDetail: React.FC = () => {
  const params = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const breadcrumbItem = [
    { title: "Home (Project List)" },
    { title: deslugify(params.projectName as string) },
  ];

  const tabItems = [
    {
      label: "General Information",
      key: "General Information",
      children: "Information Content",
    },
    { label: "Stages", key: "Stages", children: <StagesPage /> },
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
