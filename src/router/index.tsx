import {
  DesktopOutlined,
  PieChartOutlined,
  SettingOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import DashBoard from "../views/DashBoard";
import Catergory from "../views/Category";

import Course from "../views/Course";
import CoursePub from "../views/Course/pub";

import Setting from "../views/Setting";
import Role from "../views/System/Role";
import User from "../views/System/User";

import { IMenuType } from "./inter";
import PermissionDeny from "../views/PermissionDeny";
import ImportExcel from "../views/Excel/ImportExcel";
import ExportExcel from "../views/Excel/ExportExcel";
import UpLoadFile from "../views/LargeFile/index";
import Banner from "../views/Banner";
// 自定义动态渲染菜单的数据包
// 1.用来渲染菜单
// 2.渲染路由
const mainRoutes: Array<IMenuType> = [
  {
    key: "/dashboard",
    icon: <PieChartOutlined />,
    label: "数据统计",
    title: "数据统计",
    element: <DashBoard />,
  },
  {
    key: "/category",
    icon: <TeamOutlined />,
    label: "分类管理",
    title: "分类管理",
    element: <Catergory />,
  },
  {
    key: "/course",
    icon: <DesktopOutlined />,
    label: "课程管理",
    title: "课程管理",
    element: <Course />,
  },
  {
    key: "/course/pub",
    icon: <DesktopOutlined />,
    label: "课程发布",
    title: "课程发布",
    element: <CoursePub />,
    hideInMenu: true,
  },
  {
    key: "/system",
    icon: <UserOutlined />,
    label: "系统设置",
    title: "系统设置",
    children: [
      {
        key: "/system/role",
        label: "角色管理",
        title: "角色管理",
        element: <Role />,
      },
      {
        key: "/system/user",
        label: "用户管理",
        title: "用户管理",
        element: <User />,
      },
    ],
  },
  {
    key: "/setting",
    icon: <SettingOutlined />,
    label: "个人设置",
    title: "个人设置",
    element: <Setting />,
  },
  {
    key: "/banner",
    icon: <SettingOutlined />,
    label: "轮播图管理",
    title: "轮播图管理",
    element: <Banner />,
  },
  {
    key: "/excel",
    icon: <DesktopOutlined />,
    label: "Excel操作",
    title: "Excel操作",
    children: [
      {
        key: "/excel/importExcel",
        label: "Excel导入",
        title: "Excel导入",
        element: <ImportExcel />,
      },
      {
        key: "/excel/exportExcel",
        label: "Excel导出",
        title: "Excel导出",
        element: <ExportExcel />,
      },
    ],
  },
  {
    key: "/largeFile",
    icon: <DesktopOutlined />,
    label: "大文件上传",
    title: "大文件上传",
    element: <UpLoadFile />,
  },
  {
    key: "/permission/deny",
    icon: <SettingOutlined />,
    label: "无权访问",
    title: "无权访问",
    element: <PermissionDeny />,
  },
];

export default mainRoutes;
