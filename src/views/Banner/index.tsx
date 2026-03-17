import { Button, Form, Input, Space, message } from "antd";

import ImgUpload from "../../components/ImgUpload";
import { BannerType } from "../../type/course";
import { bannerPost } from "../../api/course";
import MusicUpload from "../../components/MusicUpload";

const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

type SizeType = Parameters<typeof Form>[0]["size"];

const Banner = () => {
  const [form] = Form.useForm();

  const handleFinsh = async (values: BannerType) => {
    try {
      await bannerPost(values);
      message.success("上传成功");
    } catch {
      message.error("上传失败，请稍后重试");
    }
  };

  const initData = {
    name: "banner1",
  };

  return (
    <Form
      form={form}
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
          <Button htmlType="button" onClick={() => form.resetFields()}>
            重置
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default Banner;
