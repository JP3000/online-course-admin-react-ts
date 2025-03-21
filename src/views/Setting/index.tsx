import React, { useEffect } from "react";
import type { FormProps } from "antd";
import { Button, Checkbox, Form, Input } from "antd";
import ImgUpload from "../../components/ImgUpload";
import { useAppSelector } from "../../store";
import { userUpdate } from "../../api/user";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../store/modules/user";

type FieldType = {
  username?: string;
  avatar?: string;
  remember?: string;
};

const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (errorInfo) => {
  console.log("Failed:", errorInfo);
};

const Setting: React.FC = () => {
  const [form] = Form.useForm();
  // 提取状态机中的用户信息
  const { user } = useAppSelector((state) => state);
  const dispatch = useDispatch();

  useEffect(() => {
    if (user.userInfo) {
      const { username, avatar } = user.userInfo;
      // 调用form对象提供的方法，动态为表单设置值
      form.setFieldsValue({
        username: username,
        avatar: avatar,
      });
    }
  }, []);

  const onFinish = async (values: any) => {
    console.log("Success:", values);
    const { objectId, sessionToken } = user.userInfo!;
    await userUpdate(objectId, values, sessionToken);
    dispatch(loginSuccess({ ...user.userInfo, ...values })); //更新本地用户信息
  };
  return (
    <Form
      name="basic"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      style={{ maxWidth: 600 }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
      form={form}
    >
      <Form.Item<FieldType>
        label="用户名"
        name="username"
        rules={[{ required: true, message: "请输入用户名" }]}
      >
        <Input readOnly />
      </Form.Item>

      <Form.Item<FieldType>
        label="用户头像"
        name="avatar"
        rules={[{ required: true, message: "请上传图片" }]}
      >
        <ImgUpload />
      </Form.Item>

      <Form.Item<FieldType>
        name="remember"
        valuePropName="checked"
        label={null}
      >
        <Checkbox>记住信息</Checkbox>
      </Form.Item>

      <Form.Item label={null}>
        <Button type="primary" htmlType="submit">
          确认修改
        </Button>
      </Form.Item>
    </Form>
  );
};

export default Setting;
