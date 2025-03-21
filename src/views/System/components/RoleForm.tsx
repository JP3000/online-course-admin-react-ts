// 单独封装弹窗表单
import React, { useEffect, useState } from "react";
import { Button, Form, Input, Space, Tree } from "antd";
import { RoleType } from "../../../type/user";
import mainRoutes from "../../../router";
import type { TreeProps } from "antd";
import { rolePost, rolePut } from "../../../api/user";

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
};

const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

type IProps = {
  updateList: (values: RoleType) => void;
  roleData: RoleType | null; // 区分新增和编辑
};

const RoleForm: React.FC<IProps> = (props) => {
  const [form] = Form.useForm();
  const [deafultKeys, setDefaultKeys] = useState<Array<string>>([]);

  const onFinish = async (values: RoleType) => {
    // console.log(values);
    if (props.roleData) {
      //编辑
      const { objectId } = props.roleData;
      await rolePut(objectId, values); //编辑数据到后端
      props.updateList({ ...values, objectId });
    } else {
      //新增
      const res = await rolePost(values); // 上传给后端，完整的角色数据
      const { objectId } = res.data; // 等role数据上传完毕后，后端会下发一个新的objectId，用于后续的修改和删除
      props.updateList({ ...values, objectId }); // 将新的数据传递给父组件
    }
  };

  useEffect(() => {
    // console.log("新增或编辑", props.roleData);
    if (props.roleData) {
      //编辑
      form.setFieldsValue(props.roleData);
      setDefaultKeys(props.roleData.permission); // 将默认选中的权限赋值给tree
    } else {
      //新增
      form.resetFields(); // 重置表单
      setDefaultKeys([]);
    }
  }, [props.roleData]);

  const onReset = () => {
    form.resetFields();
  };

  const onCheck: TreeProps["onCheck"] = (checkedKeys) => {
    // console.log("onCheck", checkedKeys); // 用户勾选的路由路径
    setDefaultKeys(checkedKeys as Array<string>); // 将用户勾选的路由路径，赋值给默认选中的权限
    form.setFieldsValue({
      permission: checkedKeys, //将tree中选中的表单数据，赋值给表单
    });
  };

  return (
    <Form
      {...layout}
      form={form}
      name="control-hooks"
      onFinish={onFinish}
      style={{ maxWidth: 600 }}
    >
      <Form.Item name="roleName" label="角色名称" rules={[{ required: true }]}>
        <Input />
      </Form.Item>

      <Form.Item
        name="permission"
        label="角色权限"
        valuePropName="checked"
        rules={[{ required: true }]}
      >
        <Tree
          checkable
          onCheck={onCheck}
          treeData={mainRoutes}
          checkedKeys={deafultKeys}
        />
      </Form.Item>

      <Form.Item {...tailLayout}>
        <Space>
          <Button
            type={props.roleData ? "primary" : "default"}
            htmlType="submit"
          >
            {props.roleData ? "修改" : "新增"}
          </Button>
          <Button htmlType="button" onClick={onReset}>
            重置
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default RoleForm;
