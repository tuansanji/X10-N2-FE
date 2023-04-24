import axios from "axios";
import MemberList from "../Members/MemberList";
import StagesPage from "../stagePages/StagesPage";
import { Breadcrumb, Space, Tabs, Skeleton } from "antd";
import React, { useEffect, useState } from "react";
import {
  useParams,
  useSearchParams,
  useNavigate,
  createSearchParams,
} from "react-router-dom";
import { setQuery } from "../../redux/slice/paramsSlice";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import ProjectInfo from "./ProjectInfo";

//
export interface ProjectType {
  name: string;
  description: string;
  startDate: Date;
  estimatedEndDate: Date;
  status: string;
  code: string;
}

const ProjectDetail: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const params = useParams();
  const token = useSelector((state: any) => state.auth.userInfo.token);
  const queryParams = useSelector((state: any) => state.queryParams);
  const [searchParams, setSearchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<object>({});
  const [projectDetail, setProjectDetail] = useState<ProjectType>();
  const breadcrumbItem = [
    { title: <Link to="/">Home</Link> },
    { title: projectDetail?.name },
  ];

  useEffect(() => {
    let query = Object.fromEntries([...searchParams]);
    console.log("Main Query:", query);
    dispatch(setQuery(query));
  }, [searchParams]);

  // useEffect(() => {
  //   // remove the t parameter if it is present in the URL. This happens when we are redirected back from an OAuth
  //   // flow.
  //   if (
  //     queryParams.currentTab === "General Information" &&
  //     searchParams.has("currentPage")
  //   ) {
  //     const pageQuery = searchParams.get("currentPage");
  //     if (pageQuery) {
  //       searchParams.delete("currentPage");
  //       const newParams: { [key: string]: string } = {};
  //       searchParams.forEach((value: string, key: string) => {
  //         newParams[key] = value;
  //       });

  //       setSearchParams(newParams);
  //       navigate(
  //         {
  //           search: createSearchParams(newParams).toString(),
  //         },
  //         { replace: true }
  //       );
  //     }
  //   }
  // }, [navigate, searchParams, setSearchParams]);

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

  const handleTabChange = (tabLabel: string) => {
    setSearchParams({ currentTab: tabLabel, currentPage: "1" });
  };

  return (
    <div className="project-detail">
      {isLoading ? (
        <Skeleton />
      ) : (
        <Space direction="vertical" size="large" style={{ display: "flex" }}>
          <Breadcrumb items={breadcrumbItem} />
          <Tabs
            onTabClick={handleTabChange}
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
