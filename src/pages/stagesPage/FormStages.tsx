import { IStages } from "./StagesPage";
import { Rule } from "antd/lib/form";
import locale from "antd/locale/zh_CN";
import axios from "axios";
import dayjs from "dayjs";
import "dayjs/locale/zh-cn";
import moment from "moment";
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router";
import {
  Breadcrumb,
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  Row,
  Select,
  Space,
  Tabs,
  Typography,
} from "antd";

import {
  CloseOutlined,
  LoadingOutlined,
  PlusOutlined,
} from "@ant-design/icons";

const { RangePicker } = DatePicker;
const { TextArea } = Input;
const { Title } = Typography;

interface IStagesCreate {
  name: string;
  status: string;
  actualEndDate: {
    $d: Date;
  };
  startDate: {
    $d: Date;
  };
  endDateExpected: {
    $d: Date;
  };
}

interface IForm {
  title: string;
  status?: boolean;
  actualEndDate?: boolean;
  button: string;
  editStages?: { status: boolean; stages: IStages | {} };
  setCreateStages?: Dispatch<SetStateAction<boolean>>;
  setEditStages?: Dispatch<
    SetStateAction<{ status: boolean; stages: IStages | {} }>
  >;
}

const FormStages: React.FC<IForm> = ({
  title,
  status = true,
  actualEndDate = true,
  button,
  editStages,

  setCreateStages,
  setEditStages,
}: IForm) => {
  const [form] = Form.useForm();
  const params = useParams();
  const token: string = useSelector((state: any) => state.auth.userInfo.token);

  // Hàm xử lý khi Form gửi đi
  const onFinish = (stages: IStagesCreate) => {
    if (!editStages) {
      axios
        .post(
          `${process.env.REACT_APP_BACKEND_URL}/stage/add`,
          {
            projectId: params.projectId,
            name: stages.name,
            startDate: moment(stages.startDate.$d).format("DD-MM-YYYY"),
            endDateExpected: moment(stages.endDateExpected.$d).format(
              "DD-MM-YYYY"
            ),
          },
          { headers: { Authorization: `Bearer ${token}` } }
        )
        .then((res) => console.log(res))
        .catch((err) => console.log(err));
    } else {
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
        actualEndDate:
          editStages?.stages &&
          "actualEndDate" in editStages.stages &&
          editStages.stages.actualEndDate
            ? dayjs(editStages.stages.actualEndDate, "YYYY-MM-DD")
            : null,
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
                <Form.Item label="Start Date" name="startDate">
                  <DatePicker
                    style={{ width: "100%" }}
                    disabledDate={(current) => {
                      return current && current < dayjs(Date.now());
                    }}
                  />
                </Form.Item>
              </Col>
              <Col span={11} offset={2}>
                <Form.Item label="End Date Expected" name="endDateExpected">
                  <DatePicker
                    style={{ width: "100%" }}
                    disabledDate={(current) => {
                      const startDate = form.getFieldValue("startDate");
                      return (
                        current &&
                        (current < dayjs(Date.now()) ||
                          current < dayjs(startDate))
                      );
                    }}
                  />
                </Form.Item>
              </Col>
            </Row>
            {actualEndDate && (
              <Form.Item
                label="Actual End Date"
                name="actualEndDate"
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
                        current < dayjs(startDate))
                    );
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
                <LoadingOutlined />
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
