import Comment, { IComment } from "../../components/comment/Comment";
import ReactQuillFC from "../../components/comment/ReactQuill";
import { CameraFilled, CloseOutlined } from "@ant-design/icons";
import { Badge, Breadcrumb, Button, Descriptions, message, Upload } from "antd";
import React, { useEffect, useRef, useState } from "react";

const TaskInfo = () => {
  const [isComment, setIsComment] = useState<boolean>(false);
  const [listComment, setListComment] = useState<IComment[]>([]);
  const [comment, setComment] = useState<string>("");
  const commentListRef = useRef<HTMLDivElement | null>(null);
  const breadcrumbItem = [
    { title: "project-name" },
    { title: "stages-name" },
    { title: "task-name" },
  ];
  const handleSendComment = () => {
    if (comment) {
      setListComment([...listComment, { content: comment }]);
      setComment("");
      setIsComment(false);
      // if (commentListRef && commentListRef.current) {
      //   commentListRef.current.scrollIntoView({
      //     behavior: "smooth",
      //     block: "end",
      //     inline: "nearest",
      //   });
      // }
      console.log(commentListRef);
    }
  };

  return (
    <div className="task_info--container">
      <div className="modal modal_task">
        <div className="breadcrumbItem">
          <Breadcrumb items={breadcrumbItem} />
        </div>
        <div className="modal_table">
          <Descriptions
            title="JOB DETAILS"
            bordered
            column={2}
            labelStyle={{
              width: "15%",
              textAlign: "start",
              verticalAlign: "top",
            }}
            contentStyle={{
              textAlign: "start",
              verticalAlign: "top",

              width: "35%",
            }}
          >
            <Descriptions.Item label="Title" span={2}>
              tiêu đề công việc lorem
            </Descriptions.Item>

            <Descriptions.Item label="Job Code">rafce</Descriptions.Item>
            <Descriptions.Item label="Status">
              <Badge status="processing" text="Running" />
            </Descriptions.Item>
            <Descriptions.Item label="Type of work">
              loại công việc Lorem ipsum dolor sit amet consectetur
            </Descriptions.Item>
            <Descriptions.Item label="Priority">độ ưu tiên</Descriptions.Item>
            <Descriptions.Item label="Creator">người tạo</Descriptions.Item>
            <Descriptions.Item label="Executor">
              người thi hành
            </Descriptions.Item>

            <Descriptions.Item label="Date created">ngày tạo</Descriptions.Item>
            <Descriptions.Item label="Start date" span={1}>
              ngày bắt đầu
            </Descriptions.Item>

            <Descriptions.Item label="Deadline">hạn chót</Descriptions.Item>
            <Descriptions.Item label="Actual end date" span={1}>
              ngày kết thúc thực tế
            </Descriptions.Item>

            <Descriptions.Item
              span={2}
              style={{ textAlign: "start", verticalAlign: "top" }}
              label="Descriptions"
            >
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Vitae,
              accusamus autem minima nam hic consequuntur vel architecto. Odit
              aperiam quod eveniet! Aut deleniti aperiam ipsam blanditiis,
              temporibus amet velit laboriosam.Lorem ipsum dolor sit amet
              consectetur adipisicing elit. Vitae, accusamus autem minima nam
              hic consequuntur vel architecto. Odit aperiam quod eveniet! Aut
              deleniti aperiam ipsam blanditiis, temporibus amet velit
              laboriosam.Lorem ipsum dolor sit amet consectetur adipisicing
              elit. Vitae, accusamus autem minima nam hic consequuntur vel
              architecto. Odit aperiam quod eveniet! Aut deleniti aperiam ipsam
              blanditiis, temporibus amet velit laboriosam.Lorem ipsum dolor sit
              amet consectetur adipisicing elit. Vitae, accusamus autem minima
              nam hic consequuntur vel architecto. Odit aperiam quod eveniet!
              Aut deleniti aperiam ipsam blanditiis, temporibus amet velit
              laboriosam.Lorem ipsum dolor sit amet consectetur adipisicing
              elit. Vitae, accusamus autem minima nam hic consequuntur vel
              architecto. Odit aperiam quod eveniet! Aut deleniti aperiam ipsam
              blanditiis, temporibus amet velit laboriosam.
            </Descriptions.Item>
          </Descriptions>
        </div>
        <div className="modal_comment">
          <h3 className="comment_title">JOB EXCHANGE</h3>
          <div className="comments_container ">
            <div ref={commentListRef} className="comment_list">
              {listComment?.map((comment, index: number) => (
                <Comment key={index} content={comment.content} />
              ))}
            </div>
            <div
              className="comment_list-chat"
              style={{ height: isComment ? "400px" : "150px" }}
            >
              <div className="comment_action ">
                <img
                  src={
                    "https://symbols.vn/wp-content/uploads/2022/02/Hinh-Sanji-Dep-an-tuong.jpg"
                  }
                  alt=""
                  className="img_user"
                />
                <ReactQuillFC
                  setIsComment={setIsComment}
                  setComment={setComment}
                  comment={comment}
                />
              </div>

              <div className="btn_action">
                <Button
                  type="primary"
                  style={{ width: "90%", height: "50px" }}
                  onClick={handleSendComment}
                >
                  Send
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    // <div className="task_info">
    // <div className="task_info--container">
    //   <div className="btn_close">
    //     <CloseOutlined style={{ fontSize: "25px" }} />
    //   </div>
    //   <div className="modal modal_task">
    //     <div className="breadcrumbItem">
    //       <Breadcrumb items={breadcrumbItem} />
    //     </div>
    //     <div className="modal_table">
    //       <Descriptions
    //         title="JOB DETAILS"
    //         bordered
    //         column={2}
    //         labelStyle={{
    //           width: "15%",
    //           textAlign: "start",
    //           verticalAlign: "top",
    //         }}
    //         contentStyle={{
    //           textAlign: "start",
    //           verticalAlign: "top",

    //           width: "35%",
    //         }}
    //       >
    //         <Descriptions.Item label="Title" span={2}>
    //           tiêu đề công việc lorem
    //         </Descriptions.Item>

    //         <Descriptions.Item label="Job Code">rafce</Descriptions.Item>
    //         <Descriptions.Item label="Status">
    //           <Badge status="processing" text="Running" />
    //         </Descriptions.Item>
    //         <Descriptions.Item label="Type of work">
    //           loại công việc Lorem ipsum dolor sit amet consectetur
    //         </Descriptions.Item>
    //         <Descriptions.Item label="Priority">độ ưu tiên</Descriptions.Item>
    //         <Descriptions.Item label="Creator">người tạo</Descriptions.Item>
    //         <Descriptions.Item label="Executor">
    //           người thi hành
    //         </Descriptions.Item>

    //         <Descriptions.Item label="Date created">ngày tạo</Descriptions.Item>
    //         <Descriptions.Item label="Start date" span={1}>
    //           ngày bắt đầu
    //         </Descriptions.Item>

    //         <Descriptions.Item label="Deadline">hạn chót</Descriptions.Item>
    //         <Descriptions.Item label="Actual end date" span={1}>
    //           ngày kết thúc thực tế
    //         </Descriptions.Item>

    //         <Descriptions.Item
    //           span={2}
    //           style={{ textAlign: "start", verticalAlign: "top" }}
    //           label="Descriptions"
    //         >
    //           Lorem ipsum dolor sit amet consectetur adipisicing elit. Vitae,
    //           accusamus autem minima nam hic consequuntur vel architecto. Odit
    //           aperiam quod eveniet! Aut deleniti aperiam ipsam blanditiis,
    //           temporibus amet velit laboriosam.Lorem ipsum dolor sit amet
    //           consectetur adipisicing elit. Vitae, accusamus autem minima nam
    //           hic consequuntur vel architecto. Odit aperiam quod eveniet! Aut
    //           deleniti aperiam ipsam blanditiis, temporibus amet velit
    //           laboriosam.Lorem ipsum dolor sit amet consectetur adipisicing
    //           elit. Vitae, accusamus autem minima nam hic consequuntur vel
    //           architecto. Odit aperiam quod eveniet! Aut deleniti aperiam ipsam
    //           blanditiis, temporibus amet velit laboriosam.Lorem ipsum dolor sit
    //           amet consectetur adipisicing elit. Vitae, accusamus autem minima
    //           nam hic consequuntur vel architecto. Odit aperiam quod eveniet!
    //           Aut deleniti aperiam ipsam blanditiis, temporibus amet velit
    //           laboriosam.Lorem ipsum dolor sit amet consectetur adipisicing
    //           elit. Vitae, accusamus autem minima nam hic consequuntur vel
    //           architecto. Odit aperiam quod eveniet! Aut deleniti aperiam ipsam
    //           blanditiis, temporibus amet velit laboriosam.
    //         </Descriptions.Item>
    //       </Descriptions>
    //     </div>
    //     <div className="modal_comment">
    //       <h3 className="comment_title">JOB EXCHANGE</h3>
    //       <div className="comments_container ">
    //         <div className="comment_list">
    //           <Comment />
    //           <Comment />
    //           <Comment />
    //           <Comment />s
    //           <Comment />
    //         </div>
    //         <div
    //           className="comment_list-chat"
    //           style={{ height: isComment ? "400px" : "150px" }}
    //         >
    //           <div className="comment_action ">
    //             <img
    //               src={
    //                 "https://symbols.vn/wp-content/uploads/2022/02/Hinh-Sanji-Dep-an-tuong.jpg"
    //               }
    //               alt=""
    //               className="img_user"
    //             />
    //             <ReactQuillFC setIsComment={setIsComment} />
    //           </div>

    //           <div className="btn_action">
    //             <Button type="primary" style={{ width: "90%", height: "55%" }}>
    //               Send
    //             </Button>
    //           </div>
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    // </div>
    // </div>
  );
};

export default TaskInfo;
