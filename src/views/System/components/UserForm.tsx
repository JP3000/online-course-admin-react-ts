// 单独封装弹窗表单
import React, { useEffect, useState } from "react";
import { Button, Form, Input, Select, Space } from "antd";
import { AccountType, RoleType } from "../../../type/user";
import { roleGet, userReg } from "../../../api/user";

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
};

const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

const UserForm: React.FC = () => {
  const [form] = Form.useForm();
  const [roleList, setRoleList] = useState<Array<RoleType>>([]);

  useEffect(() => {
    roleGet().then((res) => {
      setRoleList(res.data.results);
    });
  }, []);

  const onFinish = async (values: AccountType) => {
    console.log(values);
    userReg(values);
  };

  const onReset = () => {
    form.resetFields();
  };

  return (
    <Form
      {...layout}
      form={form}
      name="control-hooks"
      onFinish={onFinish}
      style={{ maxWidth: 600 }}
    >
      <Form.Item name="username" label="账号名称" rules={[{ required: true }]}>
        <Input />
      </Form.Item>

      <Form.Item name="password" label="默认密码" rules={[{ required: true }]}>
        <Input />
      </Form.Item>

      {/* name="roleName" */}
      <Form.Item name="roleId" label="关联角色" rules={[{ required: true }]}>
        <Select
          options={roleList}
          fieldNames={{ label: "roleName", value: "objectId" }}
        />
      </Form.Item>

      <Form.Item {...tailLayout}>
        <Space>
          <Button type="primary" htmlType="submit">
            分配账号
          </Button>
          <Button htmlType="button" onClick={onReset}>
            重置
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default UserForm;
