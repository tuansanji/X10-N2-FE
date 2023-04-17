import Comment from "../../components/comment/Comment";
import ReactQuillFC from "../../components/comment/ReactQuill";
import { CameraFilled, CloseOutlined } from "@ant-design/icons";
import { Badge, Button, Descriptions, message, Upload } from "antd";
import React from "react";

import type { UploadProps } from "antd";
const TaskInfo = () => {
  const props: UploadProps = {
    name: "file",
    action: "https://www.mocky.io/v2/5cc8019d300000980a055e76",
    headers: {
      authorization: "authorization-text",
    },
    onChange(info) {
      if (info.file.status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === "done") {
        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };
  return (
    <div className="task_info">
      <div className="task_info--container">
        <div className="btn_close">
          <CloseOutlined style={{ fontSize: "25px" }} />
        </div>
        <div className="modal modal_task">
          <div className="modal_table">
            <Descriptions
              title="JOB DETAILS"
              bordered
              column={2}
              labelStyle={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "16px",
              }}
            >
              <Descriptions.Item label="Job Code">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Sint
                aspernatur non quaerat quo? Quisquam harum quam est. Delectus
                rem officiis nulla, voluptates nam dolore officia voluptas
                debitis sint? Ipsa, illum. Lorem ipsum dolor sit amet
                consectetur adipisicing elit. Sint aspernatur non quaerat quo?
                Quisquam harum quam est. Delectus rem officiis nulla, voluptates
                nam dolore officia voluptas debitis sint? Ipsa, illum. Lorem
                ipsum dolor sit amet consectetur adipisicing elit. Sint
                aspernatur non quaerat quo? Quisquam harum quam est. Delectus
                rem officiis nulla, voluptates nam dolore officia voluptas
                debitis sint? Ipsa, illum.
              </Descriptions.Item>
              <Descriptions.Item label="Title">
                tiêu đề công việc
              </Descriptions.Item>
              <Descriptions.Item label="Type of work">
                loại công việc
              </Descriptions.Item>
              <Descriptions.Item label="Priority">độ ưu tiên</Descriptions.Item>
              <Descriptions.Item label="Creator">người tạo</Descriptions.Item>
              <Descriptions.Item label="Executor">
                người thi hành
              </Descriptions.Item>

              <Descriptions.Item label="Status" span={3}>
                <Badge status="processing" text="Running" />
              </Descriptions.Item>

              <Descriptions.Item label="Date created">
                ngày tạo
              </Descriptions.Item>
              <Descriptions.Item label="Start date" span={2}>
                ngày bắt đầu
              </Descriptions.Item>

              <Descriptions.Item label="Deadline">hạn chót</Descriptions.Item>
              <Descriptions.Item label="Actual end date" span={2}>
                ngày kết thúc thực tế
              </Descriptions.Item>

              <Descriptions.Item
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
                architecto. Odit aperiam quod eveniet! Aut deleniti aperiam
                ipsam blanditiis, temporibus amet velit laboriosam.Lorem ipsum
                dolor sit amet consectetur adipisicing elit. Vitae, accusamus
                autem minima nam hic consequuntur vel architecto. Odit aperiam
                quod eveniet! Aut deleniti aperiam ipsam blanditiis, temporibus
                amet velit laboriosam.Lorem ipsum dolor sit amet consectetur
                adipisicing elit. Vitae, accusamus autem minima nam hic
                consequuntur vel architecto. Odit aperiam quod eveniet! Aut
                deleniti aperiam ipsam blanditiis, temporibus amet velit
                laboriosam.
              </Descriptions.Item>
            </Descriptions>
          </div>
          <div className="modal_comment">
            <h3 className="comment_title">JOB EXCHANGE</h3>
            <div className="comments_container ">
              <div className="comment_list">
                <Comment />
                <Comment />
                <Comment />
                <Comment />
                <Comment />
                <Comment />
                <Comment />
              </div>
              <div className="comment_list-chat">
                <div className="comment_action ">
                  <img
                    src={
                      "https://symbols.vn/wp-content/uploads/2022/02/Hinh-Sanji-Dep-an-tuong.jpg"
                    }
                    alt=""
                    className=""
                  />
                  <ReactQuillFC />

                  {/* <input
                    type="text"
                    placeholder="What's on your mind?"
                    className=""
                  />
                  <div className="icon_img">
                    <Upload {...props}>
                      <Button
                        icon={
                          <CameraFilled
                            style={{
                              fontSize: "20px",
                            }}
                          />
                        }
                      ></Button>
                    </Upload>
                  </div> */}
                </div>
                <div className="btn_action">
                  <Button
                    type="primary"
                    style={{ width: "90%", height: "55%" }}
                  >
                    Send
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskInfo;
