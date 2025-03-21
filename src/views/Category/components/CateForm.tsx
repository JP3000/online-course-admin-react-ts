// 单独封装弹窗表单
import React from "react";
import { Button, Form, Input, Select, Space, Switch } from "antd";
import { CategoryType } from "../../../type/course";
import { categoryPost } from "../../../api/course";

const { Option } = Select;

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
};

const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

// 约束函数式组件的props格式
type Props = {
  handleCancel: () => void;
  cateList: CategoryType[];
  updateCateList: (arg: CategoryType) => void;
};

const CateForm: React.FC<Props> = (props) => {
  const [form] = Form.useForm();

  const onFinish = async (values: CategoryType) => {
    // console.log(values); // 表单数据，没有objectId
    const res = await categoryPost(values);
    const { objectId } = res.data; // 后端下发的唯一Id
    props.updateCateList({ ...values, objectId }); // 向父级提交新增成功的数据，同时呈现在父级列表
    props.handleCancel(); // 关闭弹窗
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
      <Form.Item name="name" label="分类名称" rules={[{ required: true }]}>
        <Input />
      </Form.Item>

      <Form.Item name="parentId" label="父级类目" rules={[{ required: true }]}>
        <Select placeholder="请选择父级类目" allowClear>
          <Option value="0-0">顶级类目</Option>
          {props.cateList.map((item) => {
            return (
              <Option key={item.objectId} value={item.objectId}>
                {item.name}
              </Option>
            );
          })}
        </Select>
      </Form.Item>

      <Form.Item
        name="isShow"
        label="是否上架"
        valuePropName="checked"
        rules={[{ required: true }]}
      >
        <Switch />
      </Form.Item>

      <Form.Item {...tailLayout}>
        <Space>
          <Button type="primary" htmlType="submit">
            确认
          </Button>
          <Button htmlType="button" onClick={onReset}>
            重置
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default CateForm;
