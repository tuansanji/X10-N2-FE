import Comment from "../../components/comment/Comment";
import { useAxios } from "../../components/hook/useAxios";
import { useAppSelector } from "../../redux/hook";
import { RootState } from "../../redux/store";
import { Button, Input, Modal, Skeleton } from "antd";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import { v4 as uuid } from "uuid";
import useMessageApi, {
  UseMessageApiReturnType,
} from "../../components/support/Message";

const { TextArea } = Input;
export interface IUserComment {
  _id: string;
  fullName: string;
  avatar: string;
  email: string;
  userName: string;
}

export interface IReview {
  content: string;
  reviewer: IUserComment;
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}
interface IPropsReview {
  stageId: string;
}
const StageReview = ({ stageId }: IPropsReview) => {
  const [myReview, setMyReview] = useState<string>("");
  const [open, setOpen] = useState(false);
  const [reviewAdded, setReviewAdded] = useState<number>(1);
  const [isBoss, setIsBoss] = useState(false);
  const params = useParams();
  const { responseData, isLoading } = useAxios(
    "post",
    `/stage/review/${stageId}`,
    [stageId, reviewAdded]
  );
  const commentListRef = useRef<HTMLDivElement>(null);
  const { showMessage, contextHolder }: UseMessageApiReturnType =
    useMessageApi();
  const user = useAppSelector((state: RootState) => state.auth.userInfo);

  const showModal = () => {
    setOpen(true);
  };
  useEffect(() => {
    if (commentListRef.current) {
      commentListRef.current.lastElementChild?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "start",
      });
    }
  }, []);
  const handleAddComment = () => {
    if (myReview) {
      showMessage("loading", "Loading...");
      axios
        .post(
          `${process.env.REACT_APP_BACKEND_URL}/stage/review/add/${stageId}`,
          {
            review: myReview,
          },
          {
            headers: { Authorization: `Bearer ${user.token}` },
          }
        )
        .then((res) => {
          setMyReview("");
          showMessage("success", res.data?.message, 2);
          setReviewAdded((prev) => prev + 1);
          setOpen(false);
          setTimeout(() => {
            // Scroll to the last comment
            if (commentListRef.current) {
              commentListRef.current.lastElementChild?.scrollIntoView({
                behavior: "smooth",
                block: "nearest",
                inline: "start",
              });
            }
          }, 1000);
        })
        .catch((err) => {
          showMessage("error", err.response.data?.message, 2);
        });
    }
  };

  const handleCancel = () => {
    setOpen(false);
  };
  // Lấy List member thuộc project
  useEffect(() => {
    (async () => {
      try {
        const response = await axios({
          method: "get",
          url: `${process.env.REACT_APP_BACKEND_URL}/project/members/all/${params.projectId}`,
          headers: { Authorization: `Bearer ${user.token}` },
        });
        response.data?.members?.forEach((userP: any) => {
          if (
            userP.role === "manager" ||
            userP.role === "leader" ||
            userP.role === "supervisor"
          ) {
            if (userP.data.username === user.username) {
              setIsBoss(true);
              return;
            }
          }
        });
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);
  return (
    <div className="stage__review">
      {contextHolder}
      <div className="stage__review--header">
        {isBoss && (
          <Button type="primary" onClick={showModal}>
            Add review
          </Button>
        )}

        <Modal
          title="Add review"
          open={open}
          onOk={handleAddComment}
          onCancel={handleCancel}
        >
          <TextArea
            value={myReview}
            onChange={(e) => setMyReview(e.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
              }
            }}
            rows={4}
          />
        </Modal>
      </div>
      <div className="stage__review--content">
        {isLoading ? (
          <Skeleton active avatar />
        ) : (
          <div
            className="review__list--comment scroll_custom "
            ref={commentListRef}
          >
            {responseData?.review?.length === 0 ? (
              <strong>There are no reviews yet</strong>
            ) : (
              responseData.review.map((comment: IReview) => (
                <Comment
                  key={uuid()}
                  showMessage={showMessage}
                  reviewComment={comment}
                  setReviewAdded={setReviewAdded}
                  stageId={stageId}
                />
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default StageReview;
