import { IStages } from "./StagesPage";
<<<<<<< HEAD
import { useAppDispatch, useAppSelector } from "../../redux/hook";
import { toastErr, toastSuccess } from "../../redux/slice/toastSlice";
import { CloseOutlined, LoadingOutlined } from "@ant-design/icons";
import axios from "axios";
import dayjs from "dayjs";
import "dayjs/locale/zh-cn";
import { Dispatch, SetStateAction, useMemo, useState } from "react";
import { useParams } from "react-router";

=======
import { toastSuccess } from "../../redux/slice/toastSlice";
import { Rule } from "antd/lib/form";
import locale from "antd/locale/zh_CN";
import axios from "axios";
import dayjs from "dayjs";
import "dayjs/locale/zh-cn";
import moment from "moment";
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { toast } from "react-toastify";
>>>>>>> 6a063c4 (update stage form)
import {
  Breadcrumb,
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  Row,
  Typography,
} from "antd";

const { TextArea } = Input;
const { Title } = Typography;

interface IStagesCreate {
  name: string;
  status: string;
  endDateActual: Date;
  startDate: Date;
  endDateExpected: Date;
}

interface IForm {
  title: string;
  status?: boolean;
  endDateActual?: boolean;
  button: string;
  editStages?: { status: boolean; stages: IStages | {} };
  setCreateStages?: Dispatch<SetStateAction<boolean>>;
  setFinishCount: Dispatch<SetStateAction<number>>;
<<<<<<< HEAD
=======

>>>>>>> 6a063c4 (update stage form)
  setEditStages?: Dispatch<
    SetStateAction<{ status: boolean; stages: IStages | {} }>
  >;
}

const FormStages: React.FC<IForm> = ({
  title,
  status = true,
  endDateActual = true,
  button,
  editStages,
  setFinishCount,
  setCreateStages,
  setEditStages,
}: IForm) => {
  const [form] = Form.useForm();
<<<<<<< HEAD
  const dispatch = useAppDispatch();
  const params = useParams();
  const token: string = useAppSelector(
    (state: any) => state.auth.userInfo.token
  );
=======
  const dispatch = useDispatch();
  const params = useParams();
  const token: string = useSelector((state: any) => state.auth.userInfo.token);
>>>>>>> 6a063c4 (update stage form)
  const [loading, setLoading] = useState(false);

  // hàm xử lí form
  const onFinish = (stages: IStagesCreate) => {
    setLoading(true);
    if (!editStages) {
      axios
        .post(
          `${process.env.REACT_APP_BACKEND_URL}/stage/add`,
          {
            projectId: params.projectId,
            name: stages.name,
            startDate: stages.startDate,
            endDateExpected: stages.endDateExpected,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        )
        .then((res) => {
          setLoading(false);
          dispatch(toastSuccess(res.data?.message));
          setFinishCount((prev) => prev + 1);
        })
        .catch((err) => {
          setLoading(false);

<<<<<<< HEAD
          dispatch(toastErr(err.response.data?.message));
=======
          dispatch(toastSuccess(err.response.data?.message));
>>>>>>> 6a063c4 (update stage form)
        });
    } else {
      if ("key" in editStages.stages)
        axios
          .post(
            `${process.env.REACT_APP_BACKEND_URL}/stage/update/${editStages?.stages?.key}`,
            {
              name: stages.name,
              startDate: stages.startDate,
              endDateExpected: stages.endDateExpected,
              endDateActual: stages.endDateActual,
            },
            { headers: { Authorization: `Bearer ${token}` } }
          )
          .then((res) => {
            setLoading(false);
            dispatch(toastSuccess(res.data?.message));
            setFinishCount((prev) => prev + 1);
          })
          .catch((err) => {
            setLoading(false);

<<<<<<< HEAD
            dispatch(toastErr(err.response.data?.message));
=======
            dispatch(toastSuccess(err.response.data?.message));
>>>>>>> 6a063c4 (update stage form)
          });
    }
  };

  const initialValues = editStages
    ? {
        name:
          editStages?.stages && "name" in editStages.stages
            ? editStages.stages.name
            : "",
        startDate: dayjs(
          editStages?.stages && "startDate" in editStages.stages
            ? editStages.stages.startDate
            : "",
          "YYYY-MM-DD"
        ),
        endDateExpected: dayjs(
          editStages?.stages && "endDateExpected" in editStages.stages
            ? editStages.stages.endDateExpected
            : "",
          "YYYY-MM-DD"
        ),
        endDateActual:
          editStages?.stages &&
          "endDateActual" in editStages.stages &&
          editStages.stages.endDateActual
            ? dayjs(editStages.stages.endDateActual, "YYYY-MM-DD")
            : "",
      }
    : {};
  const breadcrumbItem = useMemo(
    () => [
      { title: "Project Name" },
      {
        title:
          editStages?.stages && "name" in editStages.stages
            ? editStages.stages.name
            : "",
      },
    ],
    [editStages]
  );
  return (
    <>
      <div className="modal">
        <div className="form">
          <div className="breadcrumbItem">
            {editStages && (
              <Breadcrumb items={breadcrumbItem} style={{ fontSize: "12px" }} />
            )}
          </div>
          <div
            className="btn_close"
            onClick={() => {
              setCreateStages?.(false);
              setEditStages?.({
                status: false,
                stages: {},
              });
            }}
          >
            <CloseOutlined style={{ fontSize: "20px" }} />
          </div>
          <Title level={3}>{title}</Title>
          <Form
            initialValues={initialValues}
            size="large"
            layout="vertical"
            name=""
            form={form}
            onFinish={onFinish}
          >
            <Form.Item
              label="Stage Name"
              name="name"
              rules={[
                {
                  required: true,
                  message: "Please input your stage name!",
                },
              ]}
            >
              <TextArea autoSize />
            </Form.Item>

            <Row>
              <Col span={11}>
                <Form.Item
                  label="Start Date"
                  name="startDate"
                  rules={[
                    {
                      required: true,
                      message: " Please fill it out completely",
                    },
                  ]}
                >
                  <DatePicker
                    style={{ width: "100%" }}
                    disabledDate={(current) => {
                      const endDateExpected =
                        form.getFieldValue("endDateExpected");
                      return endDateExpected && current
                        ? current < dayjs(Date.now()) ||
<<<<<<< HEAD
                            current > dayjs(endDateExpected)
=======
                            current >= dayjs(endDateExpected)
>>>>>>> 6a063c4 (update stage form)
                        : current < dayjs(Date.now());
                    }}
                  />
                </Form.Item>
              </Col>
              <Col span={11} offset={2}>
                <Form.Item
                  label="End Date Expected"
                  name="endDateExpected"
                  rules={[
                    {
                      required: true,
                      message: " Please fill it out completely",
                    },
                  ]}
                >
                  <DatePicker
                    style={{ width: "100%" }}
                    disabledDate={(current) => {
                      const startDate = form.getFieldValue("startDate");
                      return (
                        current &&
                        (current < dayjs(Date.now()) ||
                          current <= dayjs(startDate))
                      );
                    }}
                  />
                </Form.Item>
              </Col>
            </Row>
            {endDateActual && (
              <Form.Item label="Actual End Date" name="endDateActual">
                <DatePicker
                  style={{ width: "100%" }}
                  disabledDate={(current) => {
                    const startDate = form.getFieldValue("startDate");
                    return current && current < dayjs(startDate);
                  }}
                />
              </Form.Item>
            )}
            <Form.Item
              style={{
                display: "flex",
                justifyContent: "center",
                marginBottom: 0,
              }}
            >
              <Button type="primary" htmlType="submit">
                {loading && <LoadingOutlined />}
                {button}
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </>
  );
};

export default FormStages;
