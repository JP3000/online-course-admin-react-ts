import { EllipsisOutlined, PlusOutlined } from "@ant-design/icons";
import type { ActionType, ProColumns } from "@ant-design/pro-components";
import { ProTable, TableDropdown } from "@ant-design/pro-components";
import { Button, Dropdown, Space, Image, Tag } from "antd";
import { useRef } from "react";
import { CourseType } from "../../type/course";
import { courseGet } from "../../api/course";
import { useNavigate } from "react-router-dom";
export const waitTimePromise = async (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

export const waitTime = async (time: number = 100) => {
  await waitTimePromise(time);
};

const columns: ProColumns<CourseType>[] = [
  {
    dataIndex: "index",
    valueType: "indexBorder",
    width: 48,
  },
  {
    title: "课程名称",
    dataIndex: "name",
    copyable: true,
    ellipsis: true,
  },
  {
    // disable: true,
    title: "课程类型",
    dataIndex: "isVip",
    filters: true,
    onFilter: false,
    ellipsis: true,
    valueType: "select",
    valueEnum: {
      1: {
        text: "全部课程",
      },
      2: {
        text: "会员课程",
      },
      3: {
        text: "免费课程",
      },
    },
    render: (bool) => {
      return bool ? (
        <Tag color="gold">会员课程</Tag>
      ) : (
        <Tag color="green">免费课程</Tag>
      );
    },
  },
  {
    disable: true,
    title: "课程封面",
    dataIndex: "poster",
    search: false, //控制搜索区显示项
    render: (url: string, record) => (
      <Space>
        <Image src={url} />
      </Space>
    ),
  },
  {
    title: "创建时间",
    key: "showTime",
    dataIndex: "createdAt",
    valueType: "date",
    sorter: true,
    hideInSearch: true,
  },
  {
    title: "操作",
    valueType: "option",
    key: "option",
    render: (text, record, _, action) => [
      <a
        key="editable"
        onClick={() => {
          action?.startEditable?.(record.id);
        }}
      >
        编辑
      </a>,
      <a>查看</a>,
      <TableDropdown
        key="actionGroup"
        onSelect={() => action?.reload()}
        menus={[
          { key: "copy", name: "复制" },
          { key: "delete", name: "删除" },
        ]}
      />,
    ],
  },
];

const CourseTable = () => {
  const actionRef = useRef<ActionType>();
  const navigate = useNavigate();
  return (
    <ProTable<CourseType>
      columns={columns}
      actionRef={actionRef}
      cardBordered
      request={async (params, sort, filter) => {
        // console.log("params", params); //搜索按钮
        // console.log("sort", sort); // 表格排序
        // console.log("filter", filter); // 表格筛选
        const { name, isVip } = params;
        const res = await courseGet({ name, isVip });
        return {
          data: res.data.results, //这个数据会给到表格去渲染
          success: true,
        };
      }}
      editable={{
        type: "multiple",
      }}
      columnsState={{
        persistenceKey: "pro-table-singe-demos",
        persistenceType: "localStorage",
        defaultValue: {
          option: { fixed: "right", disable: true },
        },
        onChange(value) {
          console.log("value: ", value);
        },
      }}
      rowKey="id"
      search={{
        labelWidth: "auto",
      }}
      options={{
        setting: {
          listsHeight: 400,
        },
      }}
      form={{
        // 由于配置了 transform，提交的参数与定义的不同这里需要转化一下
        syncToUrl: (values, type) => {
          if (type === "get") {
            return {
              ...values,
              created_at: [values.startTime, values.endTime],
            };
          }
          return values;
        },
      }}
      pagination={{
        pageSize: 5,
        onChange: (page) => console.log(page),
      }}
      dateFormatter="string"
      headerTitle="高级表格"
      toolBarRender={() => [
        <Button
          key="button"
          icon={<PlusOutlined />}
          onClick={() => {
            navigate("/course/pub");
          }}
          type="primary"
        >
          新建
        </Button>,
        <Dropdown
          key="menu"
          menu={{
            items: [
              {
                label: "1st item",
                key: "1",
              },
              {
                label: "2nd item",
                key: "2",
              },
              {
                label: "3rd item",
                key: "3",
              },
            ],
          }}
        >
          <Button>
            <EllipsisOutlined />
          </Button>
        </Dropdown>,
      ]}
    />
  );
};

export default CourseTable;
