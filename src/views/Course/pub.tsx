import React, { useEffect, useState } from "react";
import { Button, Cascader, Form, Input, Space, Switch } from "antd";
import { CategoryType, CourseType } from "../../type/course";
import { categoryGet, coursePost } from "../../api/course";
import ImgUpload from "../../components/ImgUpload";
import RichEditor from "../../components/RichEditor";

const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

const { TextArea } = Input;

type SizeType = Parameters<typeof Form>[0]["size"];

const CoursePub: React.FC = () => {
  const [cateList, setCateList] = useState<Array<CategoryType>>([]);
  const handleFinsh = (values: CourseType) => {
    values.level1 = values.cate[0]; //一级类目
    values.level2 = values.cate[1]; // 二级类目
    coursePost(values);
    alert("发布成功");
  };

  useEffect(() => {
    categoryGet().then((res) => {
      // console.log(res);
      // 将后端下发的result数据，整理为有父子关系的树形数据
      const { results } = res.data;
      // 找到所有的顶级类目
      const parentArr = results.filter(
        (item: CategoryType) => item.parentId == "0-0"
      );

      parentArr.forEach((item: CategoryType) => {
        const children = results.filter(
          (child: CategoryType) => child.parentId == item.objectId
        );
        if (children.length) {
          item.children = children;
        }
      });

      setCateList(parentArr);
    });
  }, []);

  const initData = {
    name: "React+TypeScript项目实战",
    intro: "React+TypeScript实战技术栈开发在线课程管理系统",
    isVip: true,
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
      <Form.Item label="课程名称" name="name">
        <Input />
      </Form.Item>

      <Form.Item label="课程封面" name="poster">
        <ImgUpload />
      </Form.Item>

      <Form.Item label="课程分类" name="cate">
        <Cascader
          options={cateList}
          fieldNames={{ label: "name", value: "name" }}
        />
      </Form.Item>

      <Form.Item label="是否收费" name="isVip">
        <Switch defaultChecked />
      </Form.Item>

      <Form.Item label="课程简介" name="intro">
        <TextArea />
      </Form.Item>

      <Form.Item label="课程详情" name="detail">
        <RichEditor />
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

export default CoursePub;
