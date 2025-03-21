import { Button, Col, Modal, Row, Switch, Table } from "antd";
import { useEffect, useState } from "react";
import { categoryGet, categoryPut } from "../../api/course";
import { Space } from "antd";
import type { TableProps } from "antd";
import { CategoryType } from "../../type/course";
import CateForm from "./components/CateForm";
import ButtonAuth from "../../auth/ButtonAuth";

const handleChange = (checked: boolean, id: string) => {
  // console.log(checked, id);
  categoryPut(id, checked); // 更新上架状态
};

const columns: TableProps<CategoryType>["columns"] = [
  {
    title: "类目级别",
    dataIndex: "parentId", // 当前这一列要渲染的字段
    key: "parentId",
    render: (text) => {
      return text == "0-0" ? "顶级类名" : "";
    }, // 自定义渲染函数
  },
  {
    title: "分类名称",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "是否上架",
    dataIndex: "isShow",
    key: "isShow",
    render: (bool: boolean, record) => {
      return (
        <Switch
          defaultChecked={bool}
          onChange={(checked) => {
            handleChange(checked, record.objectId as string);
          }}
        />
      );
    },
  },
  {
    title: "操作",
    key: "操作",
    render: () => (
      // _, record
      <Space size="middle">
        <Button type="primary" size="small">
          编辑
        </Button>
        <ButtonAuth permit={["超级管理员"]}>
          <Button danger type="primary" size="small">
            删除
          </Button>
        </ButtonAuth>
      </Space>
    ),
  },
];

const Catergory = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cateList, setCateList] = useState<Array<CategoryType>>([]);

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

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  // 实时更新表格数据
  const updateCateList = (category: CategoryType) => {
    // console.log("子组件提交的数据", category);
    // 新增顶级类目
    if (category.parentId == "0-0") {
      cateList.push(category);
      setCateList([...cateList]); // 追加新的一级类目
    } else {
      // 新增二级类目
      // category.parentId = cateList[i].objectId
      // 找到二级类目的父级
      const index = cateList.findIndex(
        (item) => item.objectId == category.parentId
      );
      if (cateList[index].children) {
        cateList[index].children!.push(category); // 为已经有children的父级添加
      } else {
        cateList[index].children = [category]; // 为没有children的父级添加
      }
    }
    setCateList([...cateList]); // 追加新类目
  };

  return (
    <div>
      <Row justify="space-between" align="middle">
        <Col span={6}>课程分类管理</Col>
        <Col span={4}>
          <Button type="primary" onClick={showModal}>
            新增分类
          </Button>
        </Col>
      </Row>

      <Table columns={columns} dataSource={cateList} rowKey="objectId"></Table>
      {/* 新增弹窗 */}
      <Modal
        title="Basic Modal"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
      >
        <CateForm
          handleCancel={handleCancel}
          cateList={cateList}
          updateCateList={updateCateList}
        />
      </Modal>
    </div>
  );
};

export default Catergory;
