import { Button, Col, Image, Row, Table } from "antd";
import { useEffect, useState } from "react";
import { Space } from "antd";
import type { TableProps } from "antd";
import { UserInfoType } from "../../type/user";
import { userGet } from "../../api/user";

export default function ExportExcel() {
  const [list, setList] = useState<Array<UserInfoType>>([]);

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

  useEffect(() => {
    userGet().then((res) => {
      setList(res.data.results);
    });
  }, []); // 网络请求

  const handleExport = async () => {
    const ExportJsonExcel = await import("js-export-excel");

    const option: any = {};

    option.fileName = "用户列表"; // excel文件名称

    option.datas = [
      //一个对象，是一个excel选项卡
      {
        sheetData: [
          { objectId: "一行一列", username: "一行二列", avatar: "头像" },
          { objectId: "二行一列", username: "二行二列", avatar: "头像" },
          ...list,
        ],
        sheetName: "用户账号列表",
        sheetFilter: ["objectId", "username", "avatar"],
        sheetHeader: ["用户ID", "账号名称", "用户头像"],
        columnWidths: [20, 20],
      },
      {
        sheetData: [
          { one: "一行一列", two: "一行二列" },
          { one: "二行一列", two: "二行二列" },
        ],
      },
    ];

    const toExcel = new ExportJsonExcel.default(option); //new
    toExcel.saveExcel(); //保存
  };

  return (
    <div>
      <Row justify="space-between" align="middle">
        <Col span={12}>
          <Button
            type="primary"
            style={{ marginBottom: 16 }}
            onClick={handleExport}
          >
            导出Excel
          </Button>
        </Col>
      </Row>

      <Table columns={columns} dataSource={list} rowKey="objectId" />
      {/* 新增弹窗 */}
    </div>
  );
}
