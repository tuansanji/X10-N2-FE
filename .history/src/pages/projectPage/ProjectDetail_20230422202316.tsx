import ProjectInfo from "./ProjectInfo";
import MemberList from "../Members/MemberList";
import StagesPage from "../stagesPage/StagesPage";
import { Breadcrumb, Skeleton, Space, Tabs } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams, useSearchParams } from "react-router-dom";
import { Link } from "react-router-dom";

//
export interface ProjectDetail {
  name: string;
  description: string;
  startDate: Date;
  estimatedEndDate: Date;
  status: string;
  code: string;
}

const ProjectDetail: React.FC = () => {
  const params = useParams();
  const token = useSelector((state: any) => state.auth.userInfo.token);
  const [searchParams, setSearchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<object>({});
  const [projectDetail, setProjectDetail] = useState<ProjectDetail>();
  const breadcrumbItem = [
    { title: <Link to="/">Home (Project List)</Link> },
    { title: projectDetail?.name },
  ];

  useEffect(() => {
    const getProjectDetail = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/project/details/${params.projectId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setProjectDetail(response.data.project);
        setIsLoading(false);
      } catch (err: any) {
        console.log(err);
        setError(err);
        setIsLoading(false);
      }
    };
    getProjectDetail();
  }, []);

  const tabItems = [
    {
      label: "General Information",
      key: "General Information",
      children: <ProjectInfo projectDetail={projectDetail} />,
    },
    { label: "Stages", key: "Stages", children: <StagesPage /> },
    { label: "Members", key: "Members", children: <MemberList /> },
  ];

  const handleTabLick = (tabLabel: string) => {
    if (tabLabel === "General Information") {
      setSearchParams({ currentTab: tabLabel });
    } else {
      setSearchParams({ currentTab: tabLabel, pageIndex: "1", pageSize: "8" });
    }
  };

  return (
    <div className="project-detail">
      {isLoading ? (
        <Skeleton />
      ) : (
        <Space direction="vertical" size="large" style={{ display: "flex" }}>
          <Breadcrumb items={breadcrumbItem} />
          <Tabs
            onTabClick={handleTabLick}
            activeKey={searchParams.get("currentTab") || "General Information"}
            type="card"
            size="large"
            items={tabItems}
          />
        </Space>
      )}
    </div>
  );
};

export default ProjectDetail;
