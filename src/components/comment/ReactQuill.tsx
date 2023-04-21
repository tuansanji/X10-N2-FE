import React, { Dispatch, SetStateAction, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
interface IQuill {
  setIsComment?: Dispatch<SetStateAction<boolean>>;
  setComment?: Dispatch<SetStateAction<string>>;
  comment: string;
}
const ReactQuillFC: React.FC<IQuill> = ({
  setIsComment,
  setComment,
  comment,
}: IQuill) => {
  const modules = {
    toolbar: [
      // [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      // [{ size: [] }],
      // [{ font: [] }],
      [{ align: ["", "right", "center", "justify"] }],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image"],
      [{ color: ["red", "#785412"] }],
      [{ background: ["red", "#785412"] }],
    ],
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",

    "link",
    "color",
    "image",
    "background",
    "align",
    "size",
    "font",
  ];

  // const [code, setCode] = useState("");
  const handleProcedureContentChange = (
    content: any,
    delta: any,
    source: any,
    editor: any
  ) => {
    // console.log("🚀 ~ editor:", editor);
    // console.log("🚀 ~ source:", source);
    // console.log("🚀 ~ delta:", delta);
    // setCode(content);
    setComment?.(content);
    if (content) {
      setIsComment?.(true);
      if (content === "<p><br></p>") {
        setIsComment?.(false);
      }
    }
    console.log(content);
    // let has_attribues = delta.ops[1].attributes || "";
    // console.log(has_attribues);
    // const cursorPosition = e.quill.getSelection().index;
    // this.quill.insertText(cursorPosition, "★");
    // this.quill.setSelection(cursorPosition + 1);
  };

  return (
    <>
      <ReactQuill
        theme="snow"
        modules={modules}
        formats={formats}
        value={comment}
        onChange={handleProcedureContentChange}
      />
    </>
  );
};

export default ReactQuillFC;
