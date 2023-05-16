import { IUser, IUserBase } from "./TaskForm";
import Loading from "../../components/support/Loading";
import taskApi from "../../services/api/taskApi";
import { Button, Modal, Popover, Skeleton, Steps } from "antd";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import type { StepsProps } from "antd";

interface IActivities {
  _id: string;
  userId: IUserBase;
  actions: any;
  timestamp: Date;
}
const test = [
  {
    type: "create",
    title: "Tạo task",
    auth: "Nguyễn thị hồng",
    createdDate: "2023-05-10T17:31:22.541Z",
    actionFrom: "Open",
    actionTo: "In progress",
  },
  {
    type: "update",
    title: "Cập nhật task",
    auth: "Nguyễn Huyến trang",
    createdDate: "2024-05-10T17:31:22.541Z",
    actionFrom: "In progress",
    actionTo: "In review",
  },
  {
    type: "comment",
    title: "Bình luận task",
    auth: "Lionel messi",
    createdDate: "2025-05-10T17:31:22.541Z",
    actionFrom: "",
    actionTo: "",
    comment:
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Temporibus odit esse fugit quasi earum quis cum, ullam quas sed asperiores veniam. Distinctio praesentium inventore assumenda excepturi deleniti dolorum officia ratione!",
  },
  {
    type: "complete",
    title: "Hoàn thành task",
    auth: "Nguyễn thị hồng",
    createdDate: "2026-05-10T17:31:22.541Z",
    actionFrom: "In review",
    actionTo: "Done",
  },
  {
    type: "cancel",
    title: "Hủy bỏ task",
    auth: "Cristiano ronaldo",
    createdDate: "2021-05-10T17:31:22.541Z",
    actionFrom: "Open",
    actionTo: "Cancel",
  },
];

interface IProps {
  taskCurrentId?: string;
}

const TaskHistory: React.FC<IProps> = ({ taskCurrentId }) => {
  const [activities, setActivities] = useState<IActivities[] | any>(null);
  const [loading, setLoading] = useState(true);
  const params = useParams();

  useEffect(() => {
    taskApi
      .getActivities(taskCurrentId || (params.taskId as string))
      .then((res: any) => {
        setActivities(res?.activities);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
      });
  }, [params.taskId, taskCurrentId]);

  const colorTitle = (title: string) => {
    switch (title) {
      case "create":
        return "#32a852 ";
      case "update":
        return "#007aff ";
      case "comment":
        return "#5856d6 ";
      case "complete":
        return "#ff9500 ";
      case "cancel":
        return "#ff3b30 ";
      default:
        return "#333";
    }
  };

  const stepItem = (listStep: IActivities[]) => {
    const newListStep =
      activities &&
      listStep.map((step: IActivities) => {
        return {
          title: (
            <p
              className="title"
              // style={{ color: colorTitle(step.type) }}
            >
              {step?._id}
            </p>
          ),
          description: (
            <div className="history__des">
              <div className="history__user">
                <p>{step?.userId?.fullName}</p>
                <time>
                  {moment(step?.timestamp).format("DD/MM/YYYY hh:mm")}
                </time>
              </div>
              <div className="history__status">
                {/* {step.comment ? (
                <p className="comment">{step.comment}</p>
              ) : (
                <>
                  <span>{step.actionFrom}</span>
                  <div className="arrow__wrapper">
                    <div className="arrow-1"></div>
                  </div>
                  <span>{step.actionTo}</span>
                </>
              )} */}
              </div>
            </div>
          ),
        };
      });
    return newListStep;
  };

  return (
    <div className="task__history">
      {loading ? (
        <Loading />
      ) : (
        <Steps
          current={-1}
          progressDot
          direction="vertical"
          items={stepItem(activities)}
        />
      )}
    </div>
  );
};

export default TaskHistory;
