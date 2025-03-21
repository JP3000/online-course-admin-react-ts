import { Breadcrumb } from "antd";
import { useLocation } from "react-router-dom";
import { IMenuType } from "../../router/inter";
import mainRoutes from "../../router";
import { useEffect, useState } from "react";

const AppBreadCrumb = () => {
  const location = useLocation();
  const [items, setItems] = useState<Array<BreadcrumbType>>([]);

  // Record是TS提供的一个泛型工具，将两个类型，一个用于约束键名，一个用于约束键值
  const breadCrumbMap: Record<string, string> = {};

  // 下面的递归函数，目的是获取面包屑键值对
  const getBreadCrumbMap = (arr: IMenuType[]) => {
    arr.forEach((item) => {
      breadCrumbMap[item.key] = item.title;
      if (item.children) {
        getBreadCrumbMap(item.children);
      }
    });
  };

  getBreadCrumbMap(mainRoutes);

  type BreadcrumbType = {
    title: string;
  };

  useEffect(() => {
    // 如果路径是 /system/role,期望变成['/system', '/]
    const pathArr = location.pathname.split("/").filter((item) => item);
    const newItems = [{ title: "首页" }];
    pathArr.forEach((item, i) => {
      const url = `/${pathArr.slice(0, i + 1).join("/")}`;
      newItems.push({
        title: breadCrumbMap[url],
      });
    });
    setItems(newItems);
  }, [location.pathname]);
  return <Breadcrumb style={{ margin: "16px 0" }} items={items} />;
};

export default AppBreadCrumb;
