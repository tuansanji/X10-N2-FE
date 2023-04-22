import parse from "html-react-parser";
import React from "react";
import { v4 as uuid } from "uuid";
export interface IComment {
  content: string;
}
const Comment: React.FC<IComment> = ({ content }: IComment) => {
  const htmlString = `<p>nếu một mai</p><ul><li>aèn;làm;là</li><li>àksanlfnlà4</li><li>áknflkánlkfnsa</li></ul>`;
  return (
    <div key={uuid()} className="comment_content">
      <img
        src="https://symbols.vn/wp-content/uploads/2022/02/Hinh-Sanji-Dep-an-tuong.jpg"
        alt=""
        className="img_user"
      />
      <div className="comment-container">
        <p className="title">
          sanj <span>17-11-2023 15:40</span>
        </p>
        <div className="content">
          {/* <div dangerouslySetInnerHTML={{ __html: htmlString }} />
           */}
          {parse(content)}
        </div>
        <div className="action-buttons ">
          <span className="">Pin</span>
          <span className="">Delete</span>
        </div>
      </div>
    </div>
  );
};

export default Comment;
