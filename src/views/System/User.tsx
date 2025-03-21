import { Button, Col, Drawer, Image, Row, Table } from "antd";
import { useEffect, useState } from "react";
import { Space } from "antd";
import type { TableProps } from "antd";
import { UserInfoType } from "../../type/user";
import UserForm from "./components/UserForm";
import { userGet } from "../../api/user";

const User = () => {
  const [list, setList] = useState<Array<UserInfoType>>([]);
  const [open, setOpen] = useState(false);

  const columns: TableProps<UserInfoType>["columns"] = [
    {
      title: "账号ID",
      dataIndex: "objectId",
      key: "parentId",
    },
    {
      title: "账号名称",
      dataIndex: "username",
      key: "objectId",
    },
    {
      title: "账号权限",
      dataIndex: "roleName",
      key: "objectId",
    },
    {
      title: "用户头像",
      dataIndex: "avatar",
      key: "avatar",
      render: (avatar) => {
        return <Image src={avatar} style={{ height: "50px" }} />;
      },
    },
    {
      title: "操作",
      key: "操作",
      render: () => (
        //_, record, index
        <Space size="middle">
          <Button type="primary" size="small">
            编辑
          </Button>
          <Button type="primary" size="small" danger>
            删除
          </Button>
        </Space>
      ),
    },
  ];

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    userGet().then((res) => {
      setList(res.data.results);
    });
  }, []); // 网络请求

  return (
    <div>
      <Row justify="space-between" align="middle">
        <Col span={12}>
          <Button
            type="primary"
            onClick={showDrawer}
            style={{ marginBottom: 16 }}
          >
            新增账号
          </Button>
        </Col>
      </Row>

      <Table columns={columns} dataSource={list} rowKey="objectId" />
      {/* 新增弹窗 */}
      <Drawer title="新增角色" onClose={onClose} open={open}>
        <UserForm />
      </Drawer>
    </div>
  );
};

export default User;
