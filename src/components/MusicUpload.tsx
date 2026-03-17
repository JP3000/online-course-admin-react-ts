import React, { useState } from "react";
import { Upload, Button, message } from "antd";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import Cloud from "leancloud-storage"; // 假设你使用的是某个云存储 SDK
import type { UploadProps } from "antd";

type IProps = {
  onChange?: (arg: string) => void;
  value?: string;
};

const MusicUpload: React.FC<IProps> = (props) => {
  const [loading, setLoading] = useState(false);
  const [musicUrl, setMusicUrl] = useState("");

  const handleUpload: UploadProps["customRequest"] = async (info) => {
    setLoading(true);

    try {
      if (typeof info.file === "string") {
        throw new Error("不支持的文件类型");
      }

      const fileName = "name" in info.file ? info.file.name : `audio_${Date.now()}.mp3`;

      // 使用 SDK 的方法构建资源并 save 存储至云端
      const res: any = await new Cloud.File(fileName, info.file).save();
      const { url } = res.attributes;
      setMusicUrl(url);
      props.onChange?.(url); //将数据转给父级表单
      info.onSuccess?.(res);
      message.success("音频上传成功");
    } catch (error) {
      info.onError?.(error as Error);
      message.error("音频上传失败，请稍后重试");
    } finally {
      setLoading(false);
    }
  };

  const uploadButton = (
    <Button>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div>音频上传</div>
    </Button>
  );

  return (
    <Upload
      name="music"
      accept="audio/*"
      showUploadList={false}
      customRequest={handleUpload}
    >
      {musicUrl || props.value ? (
        <audio src={musicUrl || props.value} controls />
      ) : (
        uploadButton
      )}
    </Upload>
  );
};

export default MusicUpload;
