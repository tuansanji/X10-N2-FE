import React from 'react';
import { v4 as uuid } from 'uuid';
const Comment = () => {
  return (
    <div key={uuid()} className="comment_content">
      <img
        src="https://symbols.vn/wp-content/uploads/2022/02/Hinh-Sanji-Dep-an-tuong.jpg"
        alt=""
        className=""
      />
      <div className="comment-container">
        <h1 className="">sanji</h1>
        <p className="">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Provident est
          exercitationem officiis nostrum natus. Quibusdam enim eaque saepe odio
          tenetur corporis voluptate aliquid. Nisi et impedit facere explicabo
          ullam magnam!
        </p>
        <div className="action-buttons ">
          <span className="">Pin</span>
          <span className="">5h</span>
        </div>
      </div>
    </div>
  );
};

export default Comment;
