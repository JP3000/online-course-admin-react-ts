import React, { useEffect, useState } from "react";
import { Button, Form, Input, Space } from "antd";

import ImgUpload from "../../components/ImgUpload";
import { BannerType } from "../../type/course";
import { bannerPost } from "../../api/course";
import MusicUpload from "../../components/MusicUpload";

const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

type SizeType = Parameters<typeof Form>[0]["size"];

const Banner: React.FC = () => {
  const handleFinsh = (values: BannerType) => {
    bannerPost(values);
    alert("上传成功");
  };

  const initData = {
    name: "banner1",
  };

  return (
    <Form
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      layout="horizontal"
      size={"default" as SizeType}
      style={{ maxWidth: 600 }}
      onFinish={handleFinsh}
      initialValues={initData}
    >
      <Form.Item label="轮播图名称" name="name">
        <Input />
      </Form.Item>

      <Form.Item label="轮播图" name="img">
        <ImgUpload />
      </Form.Item>

      <Form.Item label="音乐上传" name="music">
        <MusicUpload />
      </Form.Item>

      <Form.Item {...tailLayout}>
        <Space>
          <Button type="primary" htmlType="submit">
            确认
          </Button>
          <Button htmlType="button">重置</Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default Banner;
