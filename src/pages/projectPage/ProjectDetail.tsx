import ProjectInfo from "./ProjectInfo";
import { setQuery } from "../../redux/slice/paramsSlice";
import MemberList from "../Members/MemberList";
import StagesPage from "../stagesPage/StagesPage";
import { Breadcrumb, Skeleton, Space, Tabs } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import {
  useParams,
  useSearchParams,
  useNavigate,
  createSearchParams,
  Link,
} from "react-router-dom";

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
  const { t } = useTranslation(["content", "base"]);
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
      label: t("base:generalInformation"),
      key: "General Information",
      children: <ProjectInfo projectDetail={projectDetail} />,
    },
    {
      label: t("base:stages"),
      key: "Stages",
      children: <StagesPage projectDetail={projectDetail} />,
    },
    { label: t("base:members"), key: "Members", children: <MemberList /> },
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
