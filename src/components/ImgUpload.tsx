import React, { useState } from "react";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { Flex, message, Upload } from "antd";
import Cloud from "leancloud-storage";
import { RcFile } from "antd/es/upload";

const getBase64 = (img: RcFile, callback: (url: string) => void) => {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result as string));
  reader.readAsDataURL(img);
};

// 选择文件后，上传文件前，对文件做判断和限制

const beforeUpload = (file: RcFile) => {
  const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
  if (!isJpgOrPng) {
    message.error("You can only upload JPG/PNG file!");
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error("Image must smaller than 2MB!");
  }
  return isJpgOrPng && isLt2M;
};

type IProps = {
  onChange?: (arg: string) => void;
  value?: string; // 表单提供的默认数据，提供给表单的新数据
};

const ImgUpload: React.FC<IProps> = (props) => {
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>();

  // 使用action接口地址上传图片时，检测上传进度
  // const handleChange: UploadProps["onChange"] = (info) => {
  //   if (info.file.status === "uploading") {
  //     setLoading(true);
  //     return;
  //   }
  //   if (info.file.status === "done") {
  //     // Get this url from response in real world.
  //     getBase64(info.file.originFileObj as FileType, (url) => {
  //       setLoading(false);
  //       setImageUrl(url);
  //     });
  //   }
  // };

  // 自定义上传函数
  const handleUpload = (info: any) => {
    // info.file时文件资源对象
    //leanCloud上传图片，要求提交 base64 编码字符串
    setLoading(true);
    getBase64(info.file, async (myBase64) => {
      // console.log(base64);
      // 使用SDK的方法构建资源并save存储至云端
      const res: any = await new Cloud.File(`${info.file.name}`, {
        base64: myBase64,
      }).save();
      const { url } = res.attributes;
      setImageUrl(url); //预览图片
      props.onChange!(url); //将图片地址传给父组件
      setLoading(false);
    });
  };

  const uploadButton = (
    <button style={{ border: 0, background: "none" }} type="button">
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>图片上传</div>
    </button>
  );

  return (
    <Flex gap="middle" wrap>
      <Upload
        name="avatar"
        listType="picture-card"
        className="avatar-uploader"
        showUploadList={false}
        beforeUpload={beforeUpload}
        customRequest={handleUpload}
        // action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
        // onChange={handleChange}
      >
        {imageUrl || props.value ? (
          <img
            src={imageUrl || props.value}
            alt="avatar"
            style={{ width: "100%" }}
          />
        ) : (
          uploadButton
        )}
      </Upload>
    </Flex>
  );
};

export default ImgUpload;
