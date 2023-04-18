import _ from "lodash";
import React, { useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import {
  Typography,
  Form,
  Input,
  Select,
  Row,
  Col,
  DatePicker,
  Button,
} from "antd";
import dayjs from "dayjs";

const { Title } = Typography;
const { TextArea } = Input;

interface PropsType {
  title?: string;
  useCase: "create" | "edit" | "info";
  data?: object;
  key?: any;
  closeModal?: React.Dispatch<React.SetStateAction<boolean>>;
  projectDetail?: any;
}

const ProjectInfo: React.FC<PropsType> = (props) => {
  const [form] = Form.useForm();
  const token = useSelector((state: any) => state.auth.userInfo.token);
  const [startDate, setStartDate] = useState<string>();
  const [endDate, setEndDate] = useState<string>();
  const statusOptions = [
    { label: "Prepare", value: "Prepare" },
    { label: "On Going", value: "On Going" },
    { label: "Suspension", value: "Suspension" },
    { label: "Complete", value: "Complete" },
  ];

  const handleCreate = async (data: any) => {
    console.log("Gửi POST Request Create với Data:", data);
    try {
      if (!_.isEmpty(data)) {
        const response = await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/project/new`,
          { ...data },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log("Response: ", response);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (value: any) => {
    console.log("Gửi Edit Request với Data:", value);
  };

  const handleSubmit = (value: any) => {
    if (props.useCase === "create") {
      handleCreate(value);
    } else {
      handleEdit(value);
    }
    if (props.closeModal) {
      props.closeModal(false);
    }
    form.resetFields();
  };

  const handleDelete = () => {};

  return (
    <div className="project-info">
      <Title level={3}>{props.title}</Title>
      <Form
        disabled={props.useCase === "info" ? true : false}
        initialValues={{
          ...props.projectDetail,
          startDate: dayjs(props.projectDetail?.startDate),
          estimatedEndDate: dayjs(props.projectDetail?.endDate),
        }}
        size="large"
        layout="vertical"
        name="projectInfo"
        form={form}
        onFinish={handleSubmit}
      >
        {/* Project Name Field */}
        <Form.Item
          label="Project Name"
          name="name"
          rules={[
            {
              required: true,
              message: "Please input your project name!",
            },
          ]}
        >
          <TextArea autoSize />
        </Form.Item>

        {/* Code Name and Status Field: Chỉ hiển thị khi show Info và Edit */}
        <Form.Item hidden={props.useCase === "create" && true}>
          <Row>
            <Col span={11}>
              <Form.Item label="Code Name" name="code">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={11} offset={2}>
              <Form.Item label="Status" name="status">
                <Select options={statusOptions} />
              </Form.Item>
            </Col>
          </Row>
        </Form.Item>

        {/* Description Field */}
        <Form.Item
          label="Description"
          name="description"
          rules={[
            {
              required: true,
              message: "Please describe your project!",
            },
          ]}
        >
          <TextArea autoSize={{ minRows: 4 }} />
        </Form.Item>

        {/* Start Date - End Date Field */}
        <Row>
          <Col span={11}>
            <Form.Item label="Start Date" name="startDate">
              <DatePicker
                style={{ width: "100%" }}
                disabledDate={(current) => {
                  return current && current < dayjs(Date.now());
                }}
                onChange={(date: any, dateString: string) => {
                  setStartDate(dateString);
                }}
              />
            </Form.Item>
          </Col>
          <Col span={11} offset={2}>
            <Form.Item label="End Date" name="estimatedEndDate">
              <DatePicker
                onChange={(date: any, dateString: string) => {
                  setEndDate(dateString);
                }}
                style={{ width: "100%" }}
                disabledDate={(current) => {
                  return current && current < dayjs(startDate);
                }}
              />
            </Form.Item>
          </Col>
        </Row>

        {/* Submit Buttons Field */}
        <Form.Item hidden={props.useCase !== "create" && true}>
          <Button type="primary" htmlType="submit">
            Create Project
          </Button>
        </Form.Item>
        <Form.Item hidden={props.useCase !== "edit" && true}>
          <Row>
            <Col span={11}>
              <Button type="primary" htmlType="submit">
                Confirm Edit
              </Button>
            </Col>
            <Col span={11} offset={2}>
              <Button onClick={handleDelete} type="primary" danger>
                Delete Project
              </Button>
            </Col>
          </Row>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ProjectInfo;
