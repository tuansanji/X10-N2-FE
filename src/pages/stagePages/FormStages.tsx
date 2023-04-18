import { IStages } from "./StagesPage";
import { Rule } from "antd/lib/form";
import locale from "antd/locale/zh_CN";
import dayjs from "dayjs";
import "dayjs/locale/zh-cn";
import moment from "moment";
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import {
  Button,
  DatePicker,
  Form,
  Input,
  Select,
  Breadcrumb,
  Space,
  Tabs,
} from "antd";

import {
  CloseOutlined,
  LoadingOutlined,
  PlusOutlined,
} from "@ant-design/icons";
const { RangePicker } = DatePicker;
const { TextArea } = Input;
interface IStagesCreate {
  name: string;
  status: string;
  actualEndDate: {
    $d: Date;
  };
  startEndDate: {
    $d: Date;
  }[];
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
  const [componentDisabled, setComponentDisabled] = useState<boolean>(false);
  const [startEndDate, setStartEndDate] = useState<any>([]);

  const [form] = Form.useForm();

  // Hàm xử lý khi Form gửi đi
  const onFinish = (stages: IStagesCreate) => {
    console.log(stages);
    // console.log(moment(stage.startEndDate[0].$d).format("DD-MM-YYYY"));
    const { startEndDate, actualEndDate } = stages;
  };
  const validateActualEndDate = (
    rule: Rule,
    value: moment.Moment,
    callback: (error?: string) => void
  ) => {
    const startEndDate = form.getFieldValue("startEndDate");
    if (value && value.isBefore(startEndDate[0])) {
      callback("Actual End Date must be after the Start Date.");
    } else {
      callback();
    }
  };
  const initialValues = editStages
    ? {
        name:
          editStages?.stages && "name" in editStages.stages
            ? editStages.stages.name
            : "",
        status:
          editStages?.stages && "status" in editStages.stages
            ? editStages.stages.status
            : "",
        actualEndDate: dayjs(
          editStages?.stages && "actualEndDate" in editStages.stages
            ? editStages.stages.actualEndDate
            : "",
          "YYYY-MM-DD"
        ),
        startEndDate: [
          dayjs(
            editStages?.stages && "startDate" in editStages.stages
              ? editStages.stages.startDate
              : "",
            "YYYY-MM-DD"
          ),
          dayjs(
            editStages?.stages && "actualEndDate" in editStages.stages
              ? editStages.stages.estimatedEndDate
              : "",
            "YYYY-MM-DD"
          ),
        ],
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
          <h2 className="form_title">{title}</h2>
          <Form
            form={form}
            className="form_antd"
            labelCol={{ span: 7 }}
            wrapperCol={{ span: 20 }}
            labelAlign="left"
            layout="horizontal"
            disabled={componentDisabled}
            initialValues={initialValues}
            style={{
              width: "80%",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
            onFinish={onFinish}
          >
            <Form.Item
              label="Name"
              name="name"
              rules={[
                {
                  required: true,
                  message: "Please input name!",
                },
              ]}
            >
              <Input placeholder="Enter stage name..." style={{}} />
            </Form.Item>
            {status && (
              <Form.Item
                label="Status"
                name="status"
                rules={[
                  {
                    required: true,
                    message: "Please select status!",
                  },
                ]}
              >
                <Select style={{}}>
                  <Select.Option value="open">open</Select.Option>
                  <Select.Option value="complete">complete</Select.Option>
                  <Select.Option value="progress">progress</Select.Option>
                </Select>
              </Form.Item>
            )}
            <Form.Item
              label="Start - End Date"
              wrapperCol={{ span: 20 }}
              name="startEndDate"
              rules={[
                {
                  required: true,
                  message: " Please fill it out completely",
                },
              ]}
            >
              <RangePicker
                style={{
                  width: "100%",
                }}
              />
            </Form.Item>

            {actualEndDate && (
              <Form.Item
                wrapperCol={{ span: 15 }}
                label="Actual End Date"
                name="actualEndDate"
                rules={[
                  {
                    required: true,
                    message: " Please fill it out completely",
                  },
                  {
                    validator: validateActualEndDate,
                  },
                ]}
              >
                <DatePicker style={{}} />
              </Form.Item>
            )}
            {/*    
        <Form.Item label="TextArea">
          <TextArea rows={4} />
        </Form.Item> */}
            <Form.Item style={{ display: "flex", justifyContent: "center" }}>
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
