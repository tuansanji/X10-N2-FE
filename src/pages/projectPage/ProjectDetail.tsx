import axios from "axios";
import MemberList from "../Members/MemberList";
import StagesPage from "../stagePages/StagesPage";
import { Breadcrumb, Space, Tabs, Skeleton } from "antd";
import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { setCurrentTab } from "../../redux/slice/paramsSlice";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import ProjectInfo from "./ProjectInfo";

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
  const dispatch = useDispatch();
  const params = useParams();
  const token = useSelector((state: any) => state.auth.userInfo.token);
  const queryParams = useSelector((state: any) => state.queryParams);
  const [searchParams, setSearchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<object>({});
  const [projectDetail, setProjectDetail] = useState<ProjectDetail>();
  const breadcrumbItem = [
    { title: <Link to="/">Home (Project List)</Link> },
    { title: projectDetail?.name },
  ];

  console.log("Query Params:", queryParams);
  useEffect(() => {
    let query = Object.fromEntries([...searchParams]);
    dispatch(setCurrentTab(query));
  }, [searchParams]);

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
    if (tabLabel === "Stages" || "Members") {
      setSearchParams({ currentTab: tabLabel, currentPage: "1" });
    } else if (tabLabel === "General Information") {
      setSearchParams({ currentTab: tabLabel });
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
            activeKey={queryParams.currentTab}
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
