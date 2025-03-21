import React, { useState } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

type IProps = {
  onChange?: (value: string) => void;
};

export default function RichEditor(props: IProps) {
  const [value, setValue] = useState("");

  const handleChange = (content: string) => {
    setValue(content);
    props?.onChange?.(content); //将富文本内容给到Form表单
  };

  return (
    <ReactQuill
      theme="snow"
      value={value}
      onChange={handleChange}
      style={{ height: "200px", marginBottom: "50px" }}
    />
  );
}
