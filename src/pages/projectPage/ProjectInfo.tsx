import React from "react";
import { Descriptions, Typography, Button } from "antd";
import dayjs from "dayjs";
import { ProjectDetail } from "./ProjectDetail";

const { Title, Text } = Typography;

interface PropTypes {
  projectDetail?: ProjectDetail;
}

const ProjectInfo: React.FC<PropTypes> = ({ projectDetail }) => {
  return (
    <div className="project-info">
      <Descriptions
        bordered
        layout="vertical"
        column={2}
        title={
          <>
            <Title level={3}>{projectDetail?.name}</Title>
          </>
        }
      >
        <Descriptions.Item label="Project Code">
          {projectDetail?.code}
        </Descriptions.Item>
        <Descriptions.Item label="Project Status">
          <Button type="primary" shape="round" style={{ backgroundColor: "" }}>
            {projectDetail?.status.toUpperCase()}
          </Button>
        </Descriptions.Item>
        <Descriptions.Item label="Description" span={2}>
          {projectDetail?.description}
        </Descriptions.Item>
        <Descriptions.Item label="Start Date">
          {dayjs(projectDetail?.startDate).format("DD-MM-YYYY")}
        </Descriptions.Item>
        <Descriptions.Item label="End Date">
          {dayjs(projectDetail?.estimatedEndDate).format("DD-MM-YYYY")}
        </Descriptions.Item>
      </Descriptions>
    </div>
  );
};

export default ProjectInfo;
