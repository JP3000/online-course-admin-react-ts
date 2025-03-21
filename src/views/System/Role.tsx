import { Button, Col, Drawer, Popconfirm, Row, Table, Tag } from "antd";
import React, { useEffect, useState } from "react";
import { Space } from "antd";
import type { TableProps } from "antd";
import { RoleType } from "../../type/user";
import RoleForm from "./components/RoleForm";
import { roleBatchDel, roleDelete, roleGet } from "../../api/user";
import { routeMapTool } from "../../utils/tools";

type Key = React.Key;

const Role = () => {
  const [roleList, setRoleList] = useState<Array<RoleType>>([]);
  const [open, setOpen] = useState(false);
  const routeMap = routeMapTool();

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  const columns: TableProps<RoleType>["columns"] = [
    {
      title: "角色ID",
      dataIndex: "objectId",
      key: "parentId",
    },
    {
      title: "角色名称",
      dataIndex: "roleName",
      key: "objectId",
    },
    {
      title: "角色权限 ",
      dataIndex: "permission",
      key: "permission",
      render: (permit) => {
        return permit.map((path: string) => (
          <Tag color="blue" key={path}>
            {routeMap[path]}
          </Tag>
        ));
      },
    },
    {
      title: "操作",
      key: "操作",
      render: (_, record, index) => (
        <Space size="middle">
          <Button
            type="primary"
            size="small"
            onClick={() => handleDrawer(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="你确定删除吗？"
            description="删除后，数据无法找回！"
            onConfirm={() => handleDelete(record, index)}
            okText="确认"
            cancelText="取消"
            placement="left"
          >
            <Button danger>删除</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const updateList = (role: RoleType) => {
    //实现新增用户的实时更新
    // 如果表单提交过来的数据中的objectId存在，则更新，否则新增
    for (let i = 0; i < roleList.length; i++) {
      if (roleList[i].objectId === role.objectId) {
        roleList[i] = role;
        setRoleList([...roleList]);
        return;
      }
    }
    // 如果没有找到相同的objectId，则新增
    roleList.push(role);
    setRoleList([...roleList]);
    setOpen(false);
  };

  // 删除
  const handleDelete = async (record: RoleType, index: number) => {
    // console.log("删除", record, index);
    await roleDelete(record.objectId); // 请求api删除后端数据
    roleList.splice(index, 1); //删除显示的本地数据
    setRoleList([...roleList]); // 触发响应式变化
  };

  useEffect(() => {
    roleGet().then((res) => {
      setRoleList(res.data.results);
    });
  }, []);

  const [row, setRow] = useState<RoleType | null>(null);

  const handleDrawer = (arg: RoleType | null) => {
    showDrawer();
    setRow(arg);
  };

  const [delKeys, setDelKeys] = useState<Array<Key>>([]);
  // 可勾选的表格，批量删除
  const rowSelection: TableProps<RoleType>["rowSelection"] = {
    onChange: (selectedRowKeys: React.Key[]) => {
      console.log(selectedRowKeys);
      setDelKeys(selectedRowKeys); // 勾选表格存在时，记录待删除的数据id
    },
  };

  const handleBatchDel = () => {
    roleBatchDel(delKeys); // 请求api删除后端数据
    // 思考：如果删除线下
  };

  return (
    <div>
      <Row justify="space-between" align="middle">
        <Col span={12}>
          <Button
            type="primary"
            onClick={() => handleDrawer(null)}
            style={{ marginBottom: 16 }}
          >
            新增角色
          </Button>
          <Space>
            {delKeys.length ? (
              <Button type="primary" danger onClick={() => handleBatchDel()}>
                批量删除
              </Button>
            ) : null}
          </Space>
        </Col>
      </Row>

      <Table
        columns={columns}
        dataSource={roleList}
        rowKey="objectId"
        rowSelection={rowSelection}
      />
      {/* 新增弹窗 */}
      <Drawer title="新增角色" onClose={onClose} open={open}>
        <RoleForm updateList={updateList} roleData={row} />
      </Drawer>
    </div>
  );
};

export default Role;
