import ReactQuillFC from "../../components/comment/ReactQuill";
import { useAppSelector } from "../../redux/hook";
import { RootState } from "../../redux/store";
import { LoadingOutlined, UserOutlined } from "@ant-design/icons";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import axios from "axios";
import dayjs from "dayjs";
import parse from "html-react-parser";
import moment from "moment";
import { useParams } from "react-router";
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
  message,
  Select,
  Skeleton,
  Upload,
} from "antd";

export interface ITask {
  title: string;
  jobCode: string;
  status: string;
  typeOfWork: string;
  priority: string;
  creator: string;
  executor: string;
  dateCreated: Date;
  startDate: Date;
  deadline: Date;
  endDateActual: Date;
  description: string;
}
interface ITaskForm {
  title: string;
  statusForm: boolean;
  taskInfo: {
    status: boolean;
    data?: ITask;
  };
  taskDemo?: any;
  button?: string;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
  setStatusForm: Dispatch<SetStateAction<boolean>>;
}

const TaskForm = (props: ITaskForm) => {
  const {
    title,
    statusForm,
    setIsModalOpen,
    setStatusForm,
    taskInfo,
    button,
    taskDemo,
  } = props;
  const [description, setDescription] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [breadcrumb, setBreadcrumb] = useState({
    project: "",
    stages: "",
    task: "",
  });
  const params = useParams();
  const [form] = Form.useForm();
  const user = useAppSelector((state: RootState) => state.auth?.userInfo);

  const onFinish = (data: any) => {
    const allData: ITask = Object.assign(data, {
      creator: statusForm ? user.fullName : taskInfo?.data?.creator,
      dateCreated: Date.now(),
      description,
    });
    console.log(allData);
    // setIsModalOpen(false);
  };
  console.log(taskDemo);
  const initialValues = useMemo(() => {
    if (taskInfo?.data && statusForm) {
      return {
        title: taskInfo?.data?.title,
        jobCode: taskInfo?.data?.jobCode,
        status: taskInfo?.data?.status,
        typeOfWork: taskInfo?.data?.typeOfWork,
        priority: taskInfo?.data?.priority,
        creator: taskInfo?.data?.creator,
        executor: taskInfo?.data?.executor,
        dateCreated: dayjs(taskInfo?.data?.dateCreated, "YYYY-MM-DD"),
        startDate: dayjs(taskInfo?.data?.startDate, "YYYY-MM-DD"),
        deadline: dayjs(taskInfo?.data?.deadline, "YYYY-MM-DD"),
        endDateActual: dayjs(taskInfo?.data?.endDateActual, "YYYY-MM-DD"),
        description: taskInfo?.data?.description,
      };
    } else {
      return {
        status: "open",
        typeOfWork: "mission",
        priority: "medium",
        dateCreated: dayjs(Date.now(), "YYYY-MM-DD"),
      };
    }
  }, [taskInfo]);
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
  }, [taskInfo]);

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

  return (
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
        name={useId()}
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
              <Form.Item name="title">
                <Input placeholder="Title..." />
              </Form.Item>
            ) : (
              taskInfo?.data?.title
            )}
          </Descriptions.Item>

          <Descriptions.Item label="Job Code">
            {!taskInfo.status ? (
              <Form.Item name="jobCode">
                <Input placeholder="Job Code..." />
              </Form.Item>
            ) : (
              taskInfo?.data?.jobCode
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Status">
            {!taskInfo.status ? (
              <Form.Item name="status">
                <Select
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
              taskInfo?.data?.status
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Type of work">
            {!taskInfo.status ? (
              <Form.Item name="typeOfWork">
                <Select
                  style={{ width: "100%" }}
                  options={[
                    { value: "mission", label: "Mission" },
                    { value: "Problem", label: "Problem" },
                  ]}
                />
              </Form.Item>
            ) : (
              taskInfo?.data?.typeOfWork
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
                    { value: "shortest", label: "Shortest" },
                  ]}
                />
              </Form.Item>
            ) : (
              taskInfo?.data?.priority
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Creator">
            {!taskInfo.status ? (
              <span style={{ opacity: 0.4 }}>
                {statusForm ? taskInfo?.data?.creator : user.fullName}
              </span>
            ) : (
              taskInfo?.data?.creator
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Executor">
            {!taskInfo.status ? (
              <Form.Item name="executor">
                <Input placeholder="large size" prefix={<UserOutlined />} />
              </Form.Item>
            ) : (
              taskInfo?.data?.executor
            )}
          </Descriptions.Item>

          <Descriptions.Item label="Date created">
            {!taskInfo.status ? (
              <span style={{ opacity: 0.4 }}>
                {statusForm
                  ? moment(taskInfo.data?.dateCreated).format("DD/MM/YYYY ")
                  : moment(Date.now()).format("DD/MM/YYYY ")}
              </span>
            ) : (
              moment(taskInfo?.data?.dateCreated).format("DD/MM/YYYY ")
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Start date" span={1}>
            {!taskInfo.status ? (
              <Form.Item name="startDate">
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
            ) : (
              moment(taskInfo?.data?.startDate).format("DD/MM/YYYY ")
            )}
          </Descriptions.Item>

          <Descriptions.Item label="Deadline">
            {!taskInfo.status ? (
              <Form.Item name="deadline">
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
            ) : (
              moment(taskInfo?.data?.deadline).format("DD/MM/YYYY ")
            )}
          </Descriptions.Item>
          <Descriptions.Item label=" End date actual" span={1}>
            {!taskInfo.status ? (
              <Form.Item name="endDateActual">
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
            ) : (
              moment(taskInfo?.data?.endDateActual).format("DD/MM/YYYY ")
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
                  editor.setData(taskInfo?.data?.description || "");
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
              parse(taskInfo?.data?.description || "")
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
              <LoadingOutlined />
              {button}
            </Button>
          </Form.Item>
        )}
      </Form>
    </div>
  );
};

export default TaskForm;
