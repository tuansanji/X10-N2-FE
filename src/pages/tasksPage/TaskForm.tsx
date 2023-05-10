import { useAxios } from "../../hooks";
import { useAppSelector } from "../../redux/hook";
import { RootState } from "../../redux/store";
import taskApi from "../../services/api/taskApi";
import { LoadingOutlined } from "@ant-design/icons";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import EN from "antd/es/date-picker/locale/en_US";
import VN from "antd/es/date-picker/locale/vi_VN";
import { NoticeType } from "antd/es/message/interface";
import axios from "axios";
import dayjs from "dayjs";
import parse from "html-react-parser";
import moment from "moment";
import "moment/locale/vi";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router";
import { v4 as uuidv4 } from "uuid";

import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  Breadcrumb,
  Button,
  DatePicker,
  Descriptions,
  Form,
  Input,
  Select,
  Skeleton,
} from "antd";

export interface ITask {
  title: string;
  jobCode?: string;
  status: string;
  type: string;
  priority: string;
  creator: string;
  assignee: string;
  createdDate?: Date;
  startDate: Date;
  deadline: Date;
  endDateActual: Date;
  description?: string;
}
interface ITaskForm {
  title: string;
  statusForm: boolean;
  taskInfo: {
    status: boolean;
    data?: ITask;
  };
  taskCurrent?: any;
  edit: boolean;
  button?: string;

  handleEditTask: () => void;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
  setEdit?: Dispatch<SetStateAction<boolean>>;
  setStatusForm: Dispatch<SetStateAction<boolean>>;
  showMessage: (type: NoticeType, content: string, duration?: number) => void;
}

interface IUser {
  data: {
    _id: string;
    fullName: string;
    avatar: string;
    email: string;
    username: string;
  };
  role: string;
  joiningDate: Date;
}

const TaskForm = (props: ITaskForm) => {
  const {
    title,
    statusForm,
    setIsModalOpen,
    setStatusForm,
    handleEditTask,
    edit,
    setEdit,
    taskInfo,
    button,
    taskCurrent,
    showMessage,
  } = props;
  const [description, setDescription] = useState<string>("");
  const [reloadData, setReloadData] = useState<number>(1);
  const [loading, setLoading] = useState(true);
  const [loadingAll, setLoadingAll] = useState(false);
  const [taskData, setTaskData] = useState<any>(null);
  const [breadcrumb, setBreadcrumb] = useState({
    project: "",
    stages: "",
    task: "",
  });
  const [currentUser, setCurrentUser] = useState<any>();
  const params = useParams();
  const [form] = Form.useForm();
  const user = useAppSelector((state: RootState) => state.auth?.userInfo);

  const { t, i18n } = useTranslation(["content", "base"]);

  moment.locale(i18n.language);

  // search user trong project
  const { responseData, isLoading } = useAxios(
    "get",
    `/project/members/all/${params.projectId}`,
    []
  );
  // lấy id của user hiện tại

  useEffect(() => {
    if (responseData && user) {
      const currentUserArr = responseData?.members?.filter((member: any) => {
        return member.data.username === user.username;
      });

      currentUserArr &&
        currentUserArr.length > 0 &&
        setCurrentUser(currentUserArr[0].data);
    }
  }, [responseData, user]);
  console.log(currentUser);
  //lấy thông tin công việc
  useEffect(() => {
    if (taskCurrent) {
      setLoadingAll(true);
      taskApi
        .getTask(taskCurrent._id)
        .then((res: any) => {
          setTaskData(res.task);
          setLoadingAll(false);
        })
        .catch((err) => {
          setLoadingAll(false);
        });
    }
  }, [taskCurrent, reloadData]);

  // hàm submit form
  //statusForm false là tạo mới ,true là chỉnh sửa
  const onFinish = (data: any) => {
    showMessage("loading", `${t("content:loading")}...`);
    if (!statusForm) {
      const task = {
        stageId: params.stagesId,
        title: data.title,
        type: data.type,
        priority: data.priority,
        assignee: data.assignee,
        startDate: data.startDate,
        deadline: data.deadline,
        description: description,
      };
      taskApi
        .addTask(task)
        .then((res: any) => {
          showMessage("success", res.message, 2);
          setIsModalOpen(false);
          setEdit?.(false);
        })
        .catch((err) => {
          showMessage("error", err.response.data?.message, 2);
        });
    } else {
      const task = {
        stageId: params.stagesId,
        title: data.title,
        type: data.type,
        startDate: data.startDate,
        deadline: data.deadline,
        status: data.status,
        priority: data.priority,
        description: description,
        assignee: data.assignee?.value || data.assignee,
        ...(data.endDateActual && {
          endDateActual: data.endDateActual,
        }),
      };
      taskApi
        .editTask(taskCurrent._id, task)
        .then((res: any) => {
          showMessage("success", res.message, 2);
          setReloadData((prev) => prev + 1);
          setEdit?.(false);
          setStatusForm(false);
        })
        .catch((err) => {
          showMessage("error", err.response.data?.message, 2);
        });
    }
  };

  // lấy dữ liệu cho breadcrumb
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const project = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/project/details/${params.projectId}`,
          { headers: { Authorization: `Bearer ${user.token}` } }
        );
        const stages = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/stage/details/${params.stagesId}`,
          { headers: { Authorization: `Bearer ${user.token}` } }
        );
        setBreadcrumb({
          ...breadcrumb,
          project: project.data.project.name,
          stages: stages.data.stage.name,
        });
        setLoading(false);
      } catch (error) {}
    })();
  }, []);

  const breadcrumbItem = useMemo(() => {
    if (statusForm || taskInfo.status) {
      return [
        { title: breadcrumb.project },
        {
          title: breadcrumb.stages,
        },
        {
          title: taskData?.title || "",
        },
      ];
    } else {
      return [
        { title: breadcrumb.project },
        {
          title: breadcrumb.stages,
        },
      ];
    }
  }, [breadcrumb, taskData]);
  const initialValues =
    statusForm && taskData
      ? {
          title: taskData?.title,
          type: taskData?.type,
          status: taskData?.status,
          priority: taskData?.priority,
          assignee: {
            label: taskData.assignee?.fullName,
            value: taskData.assignee?._id,
          },
          startDate: dayjs(taskData?.startDate),
          deadline: dayjs(taskData?.deadline),
          ...(taskData?.endDateActual && {
            endDateActual: dayjs(taskData?.endDateActual),
          }),
          description: taskData?.description,
        }
      : {
          assignee: {
            label: currentUser?.fullName,
            value: currentUser?._id,
          },
          type: "assignment",
          priority: "medium",
        };

  return loadingAll ? (
    <Skeleton />
  ) : (
    <div className="form_task" id="form_task">
      {taskData ? (
        <div className="action__wrapper">
          <div className="action__btn">
            {loading ? (
              <div className="" style={{ height: "19px" }}></div>
            ) : (
              <Breadcrumb items={breadcrumbItem} style={{ fontSize: "12px" }} />
            )}
            <Button type="primary" onClick={handleEditTask}>
              {edit ? t("base:cancel") : t("base:edit")}
            </Button>
          </div>
        </div>
      ) : loading ? (
        // <Skeleton.Input active={false} size="default" />
        <div className="" style={{ height: "19px" }}></div>
      ) : (
        <Breadcrumb
          items={breadcrumbItem}
          style={{ fontSize: "12px", height: "25px" }}
        />
      )}
      <Form
        initialValues={initialValues}
        size="large"
        layout="vertical"
        name={params.stagesId}
        form={form}
        onFinish={onFinish}
      >
        <Descriptions
          title={title}
          bordered
          column={2}
          labelStyle={{
            width: "15%",
            textAlign: "start",
            verticalAlign: "top",
          }}
          contentStyle={{
            textAlign: "start",
            verticalAlign: "top",
            width: "35%",
          }}
        >
          <Descriptions.Item label={t("content:form.title")} span={2}>
            {!taskInfo.status ? (
              <Form.Item
                name="title"
                rules={[
                  {
                    required: true,
                    message: "Please input your task name!",
                  },
                ]}
              >
                <Input placeholder="Title..." />
              </Form.Item>
            ) : (
              taskData?.title
            )}
          </Descriptions.Item>
          <Descriptions.Item label={t("content:form.job code")}>
            {taskData?.jobCode || (
              <span style={{ opacity: 0.4 }}>Auto generated</span>
            )}
          </Descriptions.Item>
          <Descriptions.Item label={t("content:form.status")}>
            {!taskInfo.status ? (
              <Form.Item name="status">
                <Select
                  disabled={!statusForm}
                  style={{ width: "100%" }}
                  options={[
                    { value: "open", label: t("content:form.open") },
                    {
                      value: "inprogress",
                      label: t("content:form.inprogress"),
                    },
                    { value: "reopen", label: t("content:form.reopen") },
                    { value: "inreview", label: t("content:form.inreview") },
                    { value: "done", label: t("base:done") },
                    { value: "cancel", label: t("base:cancel") },
                  ]}
                />
              </Form.Item>
            ) : (
              t(`content:form.${taskData?.status}` as keyof typeof t)
            )}
          </Descriptions.Item>
          <Descriptions.Item label={t("content:form.type")}>
            {!taskInfo.status ? (
              <Form.Item name="type">
                <Select
                  style={{ width: "100%" }}
                  options={[
                    {
                      value: "assignment",
                      label: t("content:form.assignment"),
                    },
                    { value: "issue", label: t("content:form.issue") },
                  ]}
                />
              </Form.Item>
            ) : (
              t(`content:form.${taskData?.type}` as keyof typeof t)
            )}
          </Descriptions.Item>
          <Descriptions.Item label={t("content:form.priority")}>
            {!taskInfo.status ? (
              <Form.Item name="priority">
                <Select
                  style={{ width: "100%" }}
                  options={[
                    { value: "highest", label: t("content:form.highest") },
                    { value: "high", label: t("content:form.high") },
                    { value: "medium", label: t("content:form.medium") },
                    { value: "low", label: t("content:form.low") },
                    { value: "lowest", label: t("content:form.lowest") },
                  ]}
                />
              </Form.Item>
            ) : (
              t(`content:form.${taskData?.priority}` as keyof typeof t)
            )}
          </Descriptions.Item>
          <Descriptions.Item label={t("content:form.creator")}>
            {!taskInfo.status ? (
              <span style={{ opacity: 0.4 }}>
                {statusForm && user
                  ? taskData?.createdBy.fullName
                  : user?.fullName}
              </span>
            ) : (
              taskData?.createdBy?.fullName
            )}
          </Descriptions.Item>
          <Descriptions.Item label={t("content:form.assignee")}>
            {!taskInfo.status ? (
              <Form.Item
                name="assignee"
                rules={[
                  {
                    required: true,
                    message: "please select assignee!",
                  },
                ]}
              >
                <Select
                  showSearch
                  placeholder="Select a person"
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    typeof option?.label === "string" &&
                    option.label.toLowerCase().includes(input.toLowerCase())
                  }
                  dropdownRender={(menu) =>
                    isLoading ? (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          padding: "10px 0",
                        }}
                      >
                        <LoadingOutlined />
                      </div>
                    ) : (
                      menu
                    )
                  }
                  options={responseData?.members?.map((item: IUser) => ({
                    label: `${item.data?.fullName}-${item?.role}`,
                    value: item.data?._id,
                  }))}
                />
              </Form.Item>
            ) : (
              taskData?.assignee?.fullName
            )}
          </Descriptions.Item>

          <Descriptions.Item label={t("content:form.date created")}>
            {!taskInfo.status ? (
              <span style={{ opacity: 0.4 }}>
                {statusForm
                  ? moment(taskData?.createdDate).format("DD/MM/YYYY hh:mm")
                  : moment(Date.now()).format("DD/MM/YYYY ")}
              </span>
            ) : (
              moment(taskData?.createdDate).format("DD MMMM, YYYY - hh:mm A")
            )}
          </Descriptions.Item>
          <Descriptions.Item label={t("content:startDate")} span={1}>
            {!taskInfo.status ? (
              <Form.Item
                name="startDate"
                rules={[
                  {
                    required: true,
                    message: " Please fill it out completely",
                  },
                ]}
              >
                <DatePicker
                  locale={i18n.language === "en" ? EN : VN}
                  style={{ width: "100%" }}
                  showTime
                  showSecond={false}
                />
              </Form.Item>
            ) : (
              moment(taskData?.startDate).format("DD MMMM, YYYY - hh:mm A")
            )}
          </Descriptions.Item>

          <Descriptions.Item label={t("content:form.deadline")}>
            {!taskInfo.status ? (
              <Form.Item
                name="deadline"
                rules={[
                  {
                    required: true,
                    message: " Please fill it out completely",
                  },
                ]}
              >
                <DatePicker
                  locale={i18n.language === "en" ? EN : VN}
                  style={{ width: "100%" }}
                  showTime
                  showSecond={false}
                />
              </Form.Item>
            ) : (
              moment(taskData?.deadline).format("DD MMMM, YYYY - hh:mm A")
            )}
          </Descriptions.Item>
          <Descriptions.Item label={t("content:endDateActual")} span={1}>
            {!taskInfo.status ? (
              <Form.Item name="endDateActual">
                <DatePicker
                  locale={i18n.language === "en" ? EN : VN}
                  style={{ width: "100%" }}
                  disabled={!statusForm}
                  showTime
                  showSecond={false}
                />
              </Form.Item>
            ) : taskData?.endDateActual ? (
              moment(taskData?.endDateActual).format("DD MMMM, YYYY - hh:mm A")
            ) : (
              ""
            )}
          </Descriptions.Item>

          <Descriptions.Item
            span={2}
            style={{ textAlign: "start", verticalAlign: "top" }}
            label={t("content:form.description")}
          >
            {!taskInfo.status ? (
              <CKEditor
                // config={{
                //   image: {
                //     toolbar: ["toggleImageCaption", "imageTextAlternative"],
                //   },
                // }}
                editor={ClassicEditor}
                data=""
                onReady={(editor) => {
                  editor.setData(taskData?.description || "");
                }}
                onChange={(event, editor) => {
                  const data = editor.getData();
                  setDescription(data);
                }}
                // onBlur={(event, editor) => {
                //   // console.log("es.", event);
                // }}
                // onFocus={(event, editor) => {
                //   // console.log("Focus.", editor);
                // }}
              />
            ) : (
              parse(taskData?.description || "")
            )}
          </Descriptions.Item>
        </Descriptions>

        {!taskInfo.status && (
          <Form.Item
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: 0,
            }}
          >
            <Button type="primary" htmlType="submit">
              {button}
            </Button>
          </Form.Item>
        )}
      </Form>
    </div>
  );
};

export default TaskForm;
