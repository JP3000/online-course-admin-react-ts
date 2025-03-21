import { theme, Layout } from "antd";
import { Outlet } from "react-router-dom";
import AppBreadCrumb from "./AppBreadCrumb";
// import PermissionAuth from "../../auth/PermissionAuth";

const { Content } = Layout;

const AppMain = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  // const [realRoutes, setRealRoutes] = useState<Array<IMenuType>>([]); // 存放整理后的路由数据包

  // useEffect(() => {
  //   let arr: IMenuType[] = [];
  //   mainRoutes.forEach((item) => {
  //     if (item.children) {
  //       // 有children，将数组展开，将子路由融入
  //       arr = [...arr, ...item.children];
  //     } else {
  //       arr.push(item);
  //     }
  //   });
  //   setRealRoutes(arr);
  // }, []);

  return (
    <Content style={{ margin: "0 16px" }}>
      <AppBreadCrumb />
      <div
        style={{
          padding: 24,
          minHeight: 360,
          background: colorBgContainer,
          borderRadius: borderRadiusLG,
        }}
      >
        {/* 写法1：手动配路由 */}
        {/* <Routes>
          <Route path="/dashboard" element={<DashBoard />} />
          <Route path="/Course" element={<Course />} />
          <Route path="/Category" element={<Category />} />
          <Route path="/system/role" element={<Role />} />
        </Routes> */}

        {/* 写法2：使用数据包自动渲染路由 */}
        {/* <Routes>
          {realRoutes.map((item) => {
            return (
              <Route
                key={item.key}
                path={item.key}
                element={item.element}
              ></Route>
            );
          })}
        </Routes> */}

        {/* <PermissionAuth> */}
        <Outlet />
        {/* </PermissionAuth> */}
      </div>
    </Content>
  );
};

export default AppMain;
