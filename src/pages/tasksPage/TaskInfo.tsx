import Comment, { IComment } from "../../components/comment/Comment";
import ReactQuillFC from "../../components/comment/ReactQuill";
import { CameraFilled, CloseOutlined } from "@ant-design/icons";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import Image from "@ckeditor/ckeditor5-image/src/image";
import ImageCaption from "@ckeditor/ckeditor5-image/src/imagecaption";
import ImageResize from "@ckeditor/ckeditor5-image/src/imageresize";
import ImageStyle from "@ckeditor/ckeditor5-image/src/imagestyle";
import ImageToolbar from "@ckeditor/ckeditor5-image/src/imagetoolbar";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import { Badge, Breadcrumb, Button, Descriptions, message, Upload } from "antd";
import parse from "html-react-parser";
import React, { useEffect, useRef, useState } from "react";
// import LinkImage from "@ckeditor/ckeditor5-link/src/linkimage";
// import Base64UploadAdapter from "@ckeditor/ckeditor5-upload/src/adapters/base64uploadadapter";

const TaskInfo = () => {
  const [isComment, setIsComment] = useState<boolean>(false);
  const [listComment, setListComment] = useState<IComment[]>([]);
  const [comment, setComment] = useState<string>("");
  const commentListRef = useRef<HTMLDivElement | null>(null);
  const editorRef = useRef<ClassicEditor | null>(null);

  const handleSendComment = () => {
    if (comment) {
      setListComment([...listComment, { content: comment }]);
      setComment("");
      setIsComment(false);
      editorRef.current?.setData("");
    }
  };

  // ClassicEditor
  //   .create( document.querySelector( '#editor' ), {
  //       plugins: [ Essentials, Paragraph, Heading, List, Bold, Italic ],
  //       toolbar: [ 'heading', 'bold', 'italic', 'numberedList', 'bulletedList' ]
  //   } )
  //   .then( editor => {
  //       console.log( 'Editor was initialized', editor );
  //   } )
  //   .catch( error => {
  //       console.error( error.stack );
  //   } );

  return (
    <div className="task_info--container" id="task_info">
      <div className="modal modal_task">
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

                <CKEditor
                  // disabled
                  // config={{
                  //   // image: {
                  //   //   toolbar: ["toggleImageCaption", "imageTextAlternative"],
                  //   // },
                  //   removePlugins: ["Image", "Table", "Link"],
                  // }}
                  editor={ClassicEditor}
                  data=""
                  onReady={(editor) => {
                    editorRef.current = editor;
                  }}
                  onChange={(event, editor) => {
                    const data = editor.getData();

                    // console.log({ event, editor, data });
                    setComment(data);
                    data ? setIsComment(true) : setIsComment(false);
                  }}
                  onBlur={(event, editor) => {
                    // console.log("es.", event);
                  }}
                  onFocus={(event, editor) => {
                    // console.log("Focus.", editor);
                  }}
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
  );
};

export default TaskInfo;
