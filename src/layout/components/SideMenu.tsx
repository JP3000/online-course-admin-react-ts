import { useEffect, useState } from "react";
import { Menu, Layout } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import { filterRoutes } from "../../utils/tools";
import { IMenuType } from "../../router/inter";
import { useAppSelector } from "../../store";

const { Sider } = Layout;

// 根据mainRoutes中的原始数据包，剔除不需要渲染为侧边菜单的数据包

const SideMenu = () => {
  const navigate = useNavigate(); // 获取编程式导航方法
  const location = useLocation(); // 获取当前路由信息
  const [realMenu, setRealMenu] = useState<Array<IMenuType>>([]);
  const [collapsed, setCollapsed] = useState(false);
  const { user } = useAppSelector((state) => state);

  useEffect(() => {
    if (user.userInfo) {
      const menu = filterRoutes(user.userInfo.permission); // 根据角色权限过滤菜单数据
      setRealMenu(menu);
    }
  }, []);

  const handleMenu = ({ key }: { key: string }) => {
    // console.log(key, "key");
    navigate(key); // 触发路由跳转
  };

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={(value) => setCollapsed(value)}
    >
      <Menu
        theme="dark"
        defaultSelectedKeys={["1"]}
        mode="inline"
        items={realMenu}
        onClick={handleMenu}
        // selectedKeys使菜单激活
        selectedKeys={[location.pathname]}
      />
    </Sider>
  );
};

export default SideMenu;
