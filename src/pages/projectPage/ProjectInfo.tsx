import React, { useState } from "react";
import { Descriptions, Typography, Button, Modal, Tooltip } from "antd";
import dayjs from "dayjs";
import { ProjectType } from "./ProjectDetail";
import { EditOutlined } from "@ant-design/icons";
import ProjectForm from "../../components/projectForm/ProjectForm";
import { useTranslation } from "react-i18next";

const { Title, Text } = Typography;

interface PropTypes {
  projectDetail?: ProjectType;
}

const ProjectInfo: React.FC<PropTypes> = ({ projectDetail }) => {
  const [openEditProject, setOpenEditProject] = useState<boolean>(false);
  const { t, i18n } = useTranslation(["content", "base"]);
  let bgColor: string = "";
  switch (projectDetail?.status) {
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
    <div className="project-info">
      <Modal
        open={openEditProject}
        footer={null}
        onCancel={() => setOpenEditProject(false)}
      >
        <ProjectForm
          title="Edit Project Info"
          useCase="edit"
          closeModal={setOpenEditProject}
          projectDetail={{ ...projectDetail }}
          key={projectDetail?._id}
        />
      </Modal>
      <Descriptions
        bordered
        layout="vertical"
        column={2}
        title={
          <div className="description_title">
            <Title level={3}>{projectDetail?.name}</Title>
            <Tooltip title="Edit project">
              <EditOutlined onClick={() => setOpenEditProject(true)} />
            </Tooltip>
          </div>
        }
      >
        <Descriptions.Item label={`${t("content:form.project code")}`}>
          {projectDetail?.code}
        </Descriptions.Item>
        <Descriptions.Item label={`${t("content:form.status")}`}>
          <Button
            type="primary"
            shape="round"
            style={{ backgroundColor: bgColor }}
          >
            <Text strong> {projectDetail?.status.toUpperCase()}</Text>
          </Button>
        </Descriptions.Item>
        <Descriptions.Item label={`${t("content:form.description")}`} span={2}>
          {projectDetail?.description}
        </Descriptions.Item>
        <Descriptions.Item label={`${t("content:startingDate")}`}>
          {dayjs(projectDetail?.startDate).format("DD-MM-YYYY")}
        </Descriptions.Item>
        <Descriptions.Item label={`${t("content:endDateExpected")}`}>
          {dayjs(projectDetail?.estimatedEndDate).format("DD-MM-YYYY")}
        </Descriptions.Item>
      </Descriptions>
    </div>
  );
};

export default ProjectInfo;
