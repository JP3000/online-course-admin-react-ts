// 单独封装弹窗表单
import { useEffect } from "react";
import { Button, Form, Input, Select, Space, Switch, message } from "antd";
import { CategoryType } from "../../../type/course";
import { categoryPost, categoryPut } from "../../../api/course";

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
  cateData: CategoryType | null;
  onSaved: () => Promise<void> | void;
};

const CateForm: React.FC<Props> = (props) => {
  const [form] = Form.useForm();

  const onFinish = async (values: CategoryType) => {
    try {
      if (props.cateData?.objectId) {
        await categoryPut(props.cateData.objectId, values);
        message.success("分类修改成功");
      } else {
        await categoryPost(values);
        message.success("分类新增成功");
      }

      await props.onSaved();
      props.handleCancel(); // 关闭弹窗
    } catch {
      message.error(props.cateData ? "分类修改失败" : "分类新增失败");
    }
  };

  const onReset = () => {
    if (props.cateData) {
      form.setFieldsValue({
        name: props.cateData.name,
        parentId: props.cateData.parentId,
        isShow: props.cateData.isShow,
      });
      return;
    }

    form.setFieldsValue({
      name: "",
      parentId: "0-0",
      isShow: true,
    });
  };

  useEffect(() => {
    if (props.cateData) {
      form.setFieldsValue({
        name: props.cateData.name,
        parentId: props.cateData.parentId,
        isShow: props.cateData.isShow,
      });
    } else {
      form.setFieldsValue({
        parentId: "0-0",
        isShow: true,
      });
    }
  }, [form, props.cateData]);

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
            if (item.objectId === props.cateData?.objectId) {
              return null;
            }
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
            {props.cateData ? "修改" : "确认"}
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
