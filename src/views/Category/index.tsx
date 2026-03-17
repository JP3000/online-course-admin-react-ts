import { Button, Col, message, Modal, Popconfirm, Row, Space, Switch, Table } from "antd";
import { useEffect, useState } from "react";
import { categoryDelete, categoryGet, categoryPut } from "../../api/course";
import type { TableProps } from "antd";
import { CategoryType } from "../../type/course";
import CateForm from "./components/CateForm";
import ButtonAuth from "../../auth/ButtonAuth";

const Catergory = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cateList, setCateList] = useState<Array<CategoryType>>([]);
  const [currentCate, setCurrentCate] = useState<CategoryType | null>(null);

  const fetchCateList = async () => {
    try {
      const res = await categoryGet();
      const { results } = res.data;
      // 将后端下发的result数据，整理为有父子关系的树形数据
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
    } catch {
      message.error("分类列表加载失败，请稍后重试");
    }
  };

  const handleChange = async (checked: boolean, id?: string) => {
    if (!id) {
      return;
    }

    try {
      await categoryPut(id, checked); // 更新上架状态
      message.success("状态更新成功");
      await fetchCateList();
    } catch {
      message.error("状态更新失败，请稍后重试");
    }
  };

  const handleDelete = async (id?: string) => {
    if (!id) {
      return;
    }

    try {
      await categoryDelete(id);
      message.success("删除成功");
      await fetchCateList();
    } catch {
      message.error("删除失败，请稍后重试");
    }
  };

  const columns: TableProps<CategoryType>["columns"] = [
    {
      title: "类目级别",
      dataIndex: "parentId", // 当前这一列要渲染的字段
      key: "parentId",
      render: (text) => {
        return text == "0-0" ? "顶级类目" : "二级类目";
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
            checked={!!bool}
            onChange={(checked) => {
              handleChange(checked, record.objectId);
            }}
          />
        );
      },
    },
    {
      title: "操作",
      key: "操作",
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="primary"
            size="small"
            onClick={() => {
              setCurrentCate(record);
              setIsModalOpen(true);
            }}
          >
            编辑
          </Button>
          <ButtonAuth permit={["超级管理员"]}>
            <Popconfirm
              title="确定删除该分类吗？"
              okText="确定"
              cancelText="取消"
              onConfirm={() => handleDelete(record.objectId)}
            >
              <Button danger type="primary" size="small">
                删除
              </Button>
            </Popconfirm>
          </ButtonAuth>
        </Space>
      ),
    },
  ];

  useEffect(() => {
    fetchCateList();
  }, []);

  const showModal = () => {
    setCurrentCate(null);
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setCurrentCate(null);
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
        title={currentCate ? "编辑分类" : "新增分类"}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
        destroyOnClose
      >
        <CateForm
          handleCancel={handleCancel}
          cateList={cateList}
          cateData={currentCate}
          onSaved={fetchCateList}
        />
      </Modal>
    </div>
  );
};

export default Catergory;
