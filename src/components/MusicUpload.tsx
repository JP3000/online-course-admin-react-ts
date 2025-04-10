import React, { useState } from "react";
import { Upload, Button, message } from "antd";
import {
  LoadingOutlined,
  PlusOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import Cloud from "leancloud-storage"; // 假设你使用的是某个云存储 SDK
import { log } from "echarts/types/src/util/log.js";

type IProps = {
  onChange?: (arg: string) => void;
  value?: string;
};

const MusicUpload: React.FC<IProps> = (props) => {
  const [loading, setLoading] = useState(false);
  const [musicUrl, setMusicUrl] = useState("");

  const handleUpload = async (info: any) => {
    console.log(info);
    setLoading(true);

    // 使用 SDK 的方法构建资源并 save 存储至云端
    const res: any = await new Cloud.File(
      `${info.file.name}`,
      info.file
    ).save();
    // console.log(res.attributes.url);
    const { url } = res.attributes;
    setMusicUrl(url);
    props.onChange!(url); //将数据转给父级表单
    setLoading(false);
  };

  const uploadButton = (
    <Button>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div>音频上传</div>
    </Button>
  );

  return (
    <Upload name="music" showUploadList={false} customRequest={handleUpload}>
      {musicUrl || props.value ? (
        <video src={musicUrl || props.value} controls />
      ) : (
        uploadButton
      )}
    </Upload>
  );
};

export default MusicUpload;
