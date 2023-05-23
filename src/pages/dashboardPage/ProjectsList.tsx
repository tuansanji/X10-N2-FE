import {
  DeleteOutlined,
  EditOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Button,
  Popconfirm,
  Table,
  Tooltip,
  Typography,
  Input,
  Modal,
} from "antd";
import { ColumnsType } from "antd/es/table";
import axios from "axios";
import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Link } from "react-router-dom";
import useMessageApi, {
  UseMessageApiReturnType,
} from "../../components/support/Message";
import { useAppDispatch, useAppSelector } from "../../redux/hook";
import { RootState } from "../../redux/store";
import projectApi from "../../services/api/projectApi";
import { deleteProject } from "../../redux/slice/projectSlice";
import { NoticeType } from "antd/es/message/interface";
import { useTranslation } from "react-i18next";
import { changeMsgLanguage } from "../../utils/changeMsgLanguage";
import useIsBoss from "../../hooks/useIsBoss";
import { UserInfo } from "./Dashboard";

const { Text } = Typography;
const { Search } = Input;

interface ProjectsListType {
  listProject: any;
  setProjectDetail: Dispatch<any>;
  setOpenEditProject: Dispatch<SetStateAction<boolean>>;
}

interface ProjectsDataType {
  key: string;
  name: string;
  status: string;
  members: any[];
}

interface DeleteConfirmPropsType {
  record: ProjectsDataType;
  showMessage: (type: NoticeType, content: string, duration?: number) => void;
  handleEditProject: (record: ProjectsDataType) => void;
}

const Action: React.FC<DeleteConfirmPropsType> = ({
  record,
  showMessage,
  handleEditProject,
}) => {
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [isDelete, setIsDelete] = useState<boolean>(false);
  const user = useAppSelector((state: RootState) => state.auth.userInfo);
  const { t, i18n } = useTranslation(["content", "base"]);
  const dispatch = useAppDispatch();
  console.log("user:", user);
  console.log("Record:", record);
  console.log("Is Edit:", isEdit);
  console.log("Is Delete:", isDelete);
  //Chỉ Leader và manager mới thực hiện được edit/delete
  useEffect(() => {
    record.members.forEach((member: any) => {
      if (
        member.data.email === user.email &&
        member.role !== "member" &&
        member.role !== "supervisor"
      ) {
        setIsEdit(true);
      }
      if (member.data.email === user.email && member.role === "manager") {
        setIsDelete(true);
      }
    });
  }, [record, user]);

  const handleDeleteProject = (project: ProjectsDataType) => {
    projectApi
      .deleteProject(project.key)
      .then((res: any) => {
        showMessage(
          "success",
          changeMsgLanguage(res?.message, "Xóa thành công"),
          2
        );
        dispatch(deleteProject(project));
        setConfirmLoading(false);
      })
      .catch((err: any) => {
        showMessage(
          "error",
          changeMsgLanguage(err.response.data?.message, "Xóa thất bại"),
          2
        );
      });
  };

  return (
    <>
      <div className="project_name_column">
        <Link to={`project/${record.key}`}>{record.name}</Link>
        <div className="project_name_action">
          <Button
            disabled={!isEdit}
            onClick={() => handleEditProject(record)}
            icon={<EditOutlined />}
          />
          <Popconfirm
            placement="topRight"
            title={`${t("content:titleDeleteProject")}`}
            description={`${t("content:desDeleteProject")}`}
            onConfirm={() => handleDeleteProject(record)}
            okText={t("base:ok")}
            cancelText={t("base:cancel")}
          >
            <Button icon={<DeleteOutlined />} disabled={!isDelete} />
          </Popconfirm>
        </div>
      </div>
    </>
  );
};

const ProjectsList: React.FC<ProjectsListType> = ({
  listProject,
  setProjectDetail,
  setOpenEditProject,
}) => {
  const [loadingSearch, setLoadingSearch] = useState<boolean>(false);
  const [searchText, setSearchText] = useState("");
  const timeOutRef = useRef<any>(null);
  const token = useAppSelector((state: RootState) => state.auth.userInfo.token);
  const [searchResult, setSearchResult] = useState<any[]>([]);
  const { showMessage, contextHolder }: UseMessageApiReturnType =
    useMessageApi();
  const { t, i18n } = useTranslation(["content", "base"]);
  const [validateAction, setValidateAction] = useState<boolean>(false);

  //Gọi api search project name
  useEffect(() => {
    const searchProject = async () => {
      if (searchText) {
        setLoadingSearch(true);
        try {
          const response = await axios({
            method: "get",
            url: `${process.env.REACT_APP_BACKEND_URL}/project/search`,
            params: {
              name: searchText,
            },
            headers: { Authorization: `Bearer ${token}` },
          });
          setSearchResult(response.data.projects);
          setLoadingSearch(false);
        } catch (err: any) {
          showMessage("error", err.response.data?.message, 2);
          setLoadingSearch(false);
        }
      }
    };
    timeOutRef.current = setTimeout(searchProject, 500);
    return () => {
      clearTimeout(timeOutRef.current);
    };
  }, [searchText]);

  //handle search input
  const handleSearchProject = (event: any) => {
    if (event.target.value === "") {
      setSearchResult([]);
    }
    setSearchText(event.target.value);
  };

  const handleEditProject = (record: ProjectsDataType) => {
    let projectDetail = listProject.projects.filter((project: any) => {
      return project._id === record.key;
    });
    setProjectDetail(projectDetail[0]);
    setOpenEditProject(true);
  };

  const columns: ColumnsType<ProjectsDataType> = [
    {
      title: `${t("content:name")}`,
      dataIndex: "name",
      key: "name",
      render: (_, record: ProjectsDataType, index: number) => {
        return (
          <Action
            record={record}
            showMessage={showMessage}
            handleEditProject={handleEditProject}
          />
        );
      },
      width: "60%",
      filterIcon: <SearchOutlined />,
      filterDropdown: () => (
        <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
          <Search
            loading={loadingSearch}
            allowClear
            value={searchText}
            placeholder="Search Project"
            onChange={handleSearchProject}
          />
        </div>
      ),
    },
    {
      title: `${t("content:form.status")}`,
      dataIndex: "status",
      key: "status",
      filters: [
        { text: "Preparing", value: "preparing" },
        { text: "On Going", value: "ongoing" },
        { text: "Completed", value: "completed" },
        { text: "Suspended", value: "suspended" },
      ],
      onFilter: (value: any, record) => record.status.indexOf(value) === 0,
      render: (_, { status }) => {
        let bgColor: string = "";
        switch (status) {
          case "ongoing":
            bgColor = "#F0E155";
            break;
          case "completed":
            bgColor = "#44CB39";
            break;
          case "suspended":
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
          <>
            <Button
              type="primary"
              shape="round"
              style={{ backgroundColor: bgColor }}
            >
              <Text className="btn_status" strong>
                {status.toUpperCase()}
              </Text>
            </Button>
          </>
        );
      },
      width: "20%",
    },
    {
      title: `${t("content:form.members")}`,
      dataIndex: "members",
      key: "members",
      render: (_, record: ProjectsDataType) => {
        return (
          <>
            <Avatar.Group
              maxCount={5}
              maxStyle={{ cursor: "pointer", backgroundColor: "#4e5658" }}
            >
              {record.members?.map((member: any) => {
                return (
                  <Tooltip title={member.data.fullName} key={member.data._id}>
                    <Avatar
                      style={{ cursor: "pointer" }}
                      src={member.data.avatar}
                    />
                  </Tooltip>
                );
              })}
            </Avatar.Group>
          </>
        );
      },
      width: "20%",
    },
  ];

  const data: ProjectsDataType[] = useMemo(() => {
    let newProject =
      searchResult && searchResult.length > 0
        ? [
            ...searchResult.map((project: any, index: number) => {
              return {
                key: project._id,
                name: project.name,
                status: project.status,
                members: project.members,
              };
            }),
          ]
        : listProject.projects && listProject.projects.length > 0
        ? [
            ...listProject.projects.map((project: any) => {
              return {
                key: project._id,
                name: project.name,
                status: project.status,
                members: project.members,
              };
            }),
          ]
        : [];
    return newProject;
  }, [listProject, searchResult]);

  return (
    <>
      {contextHolder}
      <div className="projects_list_item">
        <Table
          columns={columns}
          dataSource={data}
          bordered
          pagination={{
            position: listProject.projects.length >= 10 ? ["bottomCenter"] : [],
          }}
        />
      </div>
    </>
  );
};

export default ProjectsList;
