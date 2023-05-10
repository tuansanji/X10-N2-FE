import { useAxios } from "../../hooks";
import { useAppSelector } from "../../redux/hook";
import { RootState } from "../../redux/store";
import taskApi from "../../services/api/taskApi";
import { MemberDataType } from "../Members/MemberList";
import { LoadingOutlined, UserOutlined } from "@ant-design/icons";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import { NoticeType } from "antd/es/message/interface";
import axios from "axios";
import dayjs from "dayjs";
import parse from "html-react-parser";
import moment from "moment";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router";
import { v4 as uuidv4 } from "uuid";
import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useId,
  useMemo,
  useState,
} from "react";
import {
  Badge,
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
  button?: string;
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
  const params = useParams();
  const [form] = Form.useForm();
  const user = useAppSelector((state: RootState) => state.auth?.userInfo);
  const { t } = useTranslation(["content", "base"]);

  // search user trong project
  const { responseData, isLoading } = useAxios(
    "get",
    `/project/members/all/${params.projectId}`,
    []
  );

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
          form.setFieldsValue(initialValues);
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
        assignee: data.assignee,
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
          form.setFieldsValue(initialValues);
          taskInfo.status = true;
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

  const breadcrumbItem = useMemo(
    () =>
      statusForm
        ? [
            { title: breadcrumb.project },
            {
              title: breadcrumb.stages,
            },
            {
              title: taskInfo?.data?.title || "",
            },
          ]
        : [
            { title: breadcrumb.project },
            {
              title: breadcrumb.stages,
            },
          ],

    [breadcrumb]
  );
  const initialValues =
    statusForm && taskData
      ? {
          title: taskData?.title,
          type: taskData?.type,
          status: taskData?.status,
          priority: taskData?.priority,
          assignee: taskData?.assignee,
          startDate: dayjs(taskData?.startDate),
          deadline: dayjs(taskData?.deadline),
          ...(taskData?.endDateActual && {
            endDateActual: dayjs(taskData?.endDateActual),
          }),
          description: taskData?.description,
        }
      : {
          type: "assignment",
          priority: "medium",
        };
  return loadingAll ? (
    <Skeleton />
  ) : (
    <div className="form_task" id="form_task">
      {loading ? (
        // <Skeleton.Input active={false} size="default" />
        <div className="" style={{ height: "19px" }}></div>
      ) : (
        <Breadcrumb items={breadcrumbItem} style={{ fontSize: "12px" }} />
      )}
      {/* <Skeleton /> */}

      <Form
        initialValues={initialValues}
        size="large"
        layout="vertical"
        name={uuidv4()}
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
          <Descriptions.Item label="Title" span={2}>
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

          <Descriptions.Item label="Job Code">
            {/* {!taskInfo.status ? (
            <Form.Item name="jobCode">
              <Input placeholder="Job Code..." disabled />
            </Form.Item>
          ) : ( */}
            {taskData?.jobCode || (
              <span style={{ opacity: 0.4 }}>Auto generated</span>
            )}
            {/* )} */}
          </Descriptions.Item>
          <Descriptions.Item label="Status">
            {!taskInfo.status ? (
              <Form.Item name="status">
                <Select
                  disabled={!statusForm}
                  style={{ width: "100%" }}
                  options={[
                    { value: "open", label: "Open" },
                    { value: "inProgress", label: "In Progress" },
                    { value: "reOpen", label: "Re Open" },
                    { value: "inReview", label: "In Review" },
                    { value: "done", label: "Done" },
                    { value: "cancel", label: "Cancel" },
                  ]}
                />
              </Form.Item>
            ) : (
              taskData?.status
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Type">
            {!taskInfo.status ? (
              <Form.Item name="type">
                <Select
                  style={{ width: "100%" }}
                  options={[
                    { value: "assignment", label: "Assignment" },
                    { value: "issue", label: "Issue" },
                  ]}
                />
              </Form.Item>
            ) : (
              taskData?.type
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Priority">
            {!taskInfo.status ? (
              <Form.Item name="priority">
                <Select
                  style={{ width: "100%" }}
                  options={[
                    { value: "highest", label: "Highest" },
                    { value: "high", label: "High" },
                    { value: "medium", label: "Medium" },
                    { value: "low", label: "Low" },
                    { value: "lowest", label: "Lowest" },
                  ]}
                />
              </Form.Item>
            ) : (
              taskData?.priority
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Creator">
            {!taskInfo.status ? (
              <span style={{ opacity: 0.4 }}>
                {statusForm ? taskData?.createdBy : user.fullName}
              </span>
            ) : (
              taskData?.createdBy
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Assignee">
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
                    label: `${item.data.fullName}-${item.role}`,
                    value: item.data._id,
                  }))}
                />
              </Form.Item>
            ) : (
              taskData?.assignee
            )}
          </Descriptions.Item>

          <Descriptions.Item label="Date created">
            {!taskInfo.status ? (
              <span style={{ opacity: 0.4 }}>
                {statusForm
                  ? moment(taskData?.createdDate).format("DD/MM/YYYY hh:mm")
                  : moment(Date.now()).format("DD/MM/YYYY ")}
              </span>
            ) : (
              moment(taskData?.createdDate).format("DD/MM/YYYY hh:mm")
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Start date" span={1}>
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
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
            ) : (
              moment(taskData?.startDate).format("DD/MM/YYYY hh:mm ")
            )}
          </Descriptions.Item>

          <Descriptions.Item label="Deadline">
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
                  style={{ width: "100%" }}
                  showTime
                  showSecond={false}
                />
              </Form.Item>
            ) : (
              moment(taskData?.deadline).format("DD/MM/YYYY hh:mm")
            )}
          </Descriptions.Item>
          <Descriptions.Item label=" End date actual" span={1}>
            {!taskInfo.status ? (
              <Form.Item name="endDateActual">
                <DatePicker style={{ width: "100%" }} disabled={!statusForm} />
              </Form.Item>
            ) : taskData?.endDateActual ? (
              moment(taskData?.endDateActual).format("DD/MM/YYYY hh:mm")
            ) : (
              ""
            )}
          </Descriptions.Item>

          <Descriptions.Item
            span={2}
            style={{ textAlign: "start", verticalAlign: "top" }}
            label="Description"
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
              {/* <LoadingOutlined /> */}
              {button}
            </Button>
          </Form.Item>
        )}
      </Form>
    </div>
  );
};

export default TaskForm;
