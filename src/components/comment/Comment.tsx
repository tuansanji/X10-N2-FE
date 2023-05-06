import { IReview } from '../../pages/stagesPage/StageReview';
import { useAppSelector } from '../../redux/hook';
import { RootState } from '../../redux/store';
import { Input, Modal, Popconfirm } from 'antd';
import { NoticeType } from 'antd/es/message/interface';
import axios from 'axios';
import parse from 'html-react-parser';
import moment from 'moment';
import React, {
  Dispatch,
  SetStateAction,
  useRef,
  useState
  } from 'react';
import { useParams } from 'react-router';
import { v4 as uuid } from 'uuid';
const { TextArea } = Input;

export interface IComment {
  taskComment?: any;
  stageId?: string;
  showMessage: (type: NoticeType, content: string, duration?: number) => void;
  setReviewAdded?: Dispatch<SetStateAction<number>>;
  reviewComment?: IReview;
}
const Comment: React.FC<IComment> = ({
  taskComment,
  reviewComment,
  showMessage,
  setReviewAdded,
  stageId,
}: IComment) => {
  const [open, setOpen] = useState(false);
  const user = useAppSelector((state: RootState) => state.auth.userInfo);
  const myCommentRef = useRef<string>(reviewComment?.content || "");

  //hàm xác nhận xóa
  const handleDelete = (id: string) => {
    showMessage("loading", "Loading...");
    axios
      .post(
        `${process.env.REACT_APP_BACKEND_URL}/stage/review/delete/${stageId}`,
        {
          id: id,
        },
        {
          headers: { Authorization: `Bearer ${user?.token}` },
        }
      )
      .then((res) => {
        showMessage("success", res.data?.message, 2);
        setReviewAdded?.((prev) => prev + 1);
      })
      .catch((err) => {
        showMessage("error", err.response.data?.message, 2);
      });
  };
  //hàm sửa
  const handleEdit = () => {
    const myComment = myCommentRef.current;

    if (myComment) {
      showMessage("loading", "Loading...");
      axios
        .post(
          `${process.env.REACT_APP_BACKEND_URL}/stage/review/update/${stageId}`,
          {
            review: myComment,
            id: reviewComment?._id,
          },
          {
            headers: { Authorization: `Bearer ${user?.token}` },
          }
        )
        .then((res) => {
          showMessage("success", res.data?.message, 2);
          setReviewAdded?.((prev) => prev + 1);
          setOpen(false);
        })
        .catch((err) => {
          showMessage("error", err.response.data?.message, 2);
        });
    }
  };

  const handleCancel = () => {
    setOpen(false);
  };
  return (
    <div key={uuid()} className="comment_content">
      <img src={reviewComment?.reviewer?.avatar} alt="" className="img_user" />
      <div className="comment-container">
        <p className="title">
          {reviewComment?.reviewer?.fullName}{" "}
          <span>
            {moment(reviewComment?.createdAt).format("DD/MM/YYYY hh:mm")}
          </span>
        </p>
        <div className="content">
          {reviewComment ? reviewComment.content : parse(taskComment?.content)}
        </div>
        <div className="action-buttons ">
          {user.userName === reviewComment?.reviewer.userName && (
            <span
              className=""
              onClick={() => {
                setOpen(true);
              }}
            >
              Edit
            </span>
          )}
          <Modal
            title="Edit"
            open={open}
            onOk={handleEdit}
            onCancel={handleCancel}
          >
            <TextArea
              defaultValue={reviewComment?.content}
              onChange={(e) => (myCommentRef.current = e.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                }
              }}
              rows={4}
            />
          </Modal>
          <span className="">
            <Popconfirm
              placement="right"
              title="Delete the comment"
              description="Are you sure to delete this comment?"
              onConfirm={() => handleDelete(reviewComment?._id as string)}
              okText="Yes"
              cancelText="No"
            >
              <span className="btn_delete">Delete</span>
            </Popconfirm>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Comment;
