import React, { useState } from "react";
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

const { Title, Text } = Typography;
const { TextArea } = Input;

interface PropsType {
  title?: string;
  useCase: "create" | "edit" | "info";
  data?: object;
  key?: any;
  closeModal?: React.Dispatch<React.SetStateAction<boolean>>; //Chỗ này khai báo đúng type của setState thì bị lỗi chưa biết fix
  projectDetail?: any;
}

const ProjectInfo: React.FC<PropsType> = (props) => {
  const [form] = Form.useForm();
  const [startDate, setStartDate] = useState<string>();
  const statusOptions = [
    { label: "Prepare", value: "Prepare" },
    { label: "On Going", value: "On Going" },
    { label: "Pending", value: "Pending" },
    { label: "Complete", value: "Complete" },
  ];

  const handleSubmit = (value: any) => {
    console.log(value);
    if (props.closeModal) {
      props.closeModal(false);
    }
    form.resetFields();
  };
  console.log("Project when click Edit:", props.projectDetail);

  const handleEdit = () => {};

  const handleDelete = () => {};

  return (
    <div className="project-info">
      <Title level={3}>{props.title}</Title>
      <Form
        disabled={props.useCase === "info" ? true : false}
        initialValues={{
          ...props.projectDetail,
          startDate: dayjs(props.projectDetail?.startDate),
          endDate: dayjs(props.projectDetail?.endDate),
        }}
        size="large"
        layout="vertical"
        name="projectInfo"
        onFinish={handleSubmit}
        form={form}
      >
        <Form.Item label="Project Name" name="name">
          <TextArea autoSize />
        </Form.Item>

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
        <Form.Item label="Description" name="description">
          <TextArea autoSize={{ minRows: 4 }} />
        </Form.Item>
        <Form.Item>
          <Row>
            <Col span={11}>
              <Form.Item label="Start Date" name="startDate">
                <DatePicker
                  format="DD/MM/YYYY"
                  style={{ width: "100%" }}
                  onChange={(date: any, dateString: string) => {
                    setStartDate(dateString);
                  }}
                />
              </Form.Item>
            </Col>
            <Col span={11} offset={2}>
              <Form.Item label="End Date" name="endDate">
                <DatePicker
                  style={{ width: "100%" }}
                  disabledDate={(current) => {
                    return current && current < dayjs(startDate);
                  }}
                />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item hidden={props.useCase !== "create" && true}>
            <Button type="primary" htmlType="submit">
              Create Project
            </Button>
          </Form.Item>
          <Form.Item hidden={props.useCase !== "edit" && true}>
            <Row>
              <Col span={11}>
                <Button onClick={handleEdit} type="primary">
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
        </Form.Item>
      </Form>
    </div>
  );
};

export default ProjectInfo;
