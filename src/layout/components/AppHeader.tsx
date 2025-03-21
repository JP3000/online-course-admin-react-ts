import { Col, Dropdown, Image, Layout, Row } from "antd";
import { MenuProps } from "antd/lib";
import {
  LogoutOutlined,
  SettingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { loginFail } from "../../store/modules/user";
const { Header } = Layout;

const AppHeader = () => {
  const { user } = useSelector((state: RootState) => state);
  const dispatch = useDispatch();

  const handleMenuClick: MenuProps["onClick"] = (e) => {
    if (e.key === "2") {
      dispatch(loginFail()); //退出登录
    }
  };

  const items: MenuProps["items"] = [
    {
      label: "个人设置",
      key: "1",
      icon: <SettingOutlined />,
    },
    {
      label: "退出登录",
      key: "2",
      icon: <LogoutOutlined />,
      danger: true,
    },
  ];

  const menuProps = {
    items,
    onClick: handleMenuClick,
  };

  return (
    <div>
      <Header style={{ backgroundColor: "white" }}>
        <Row
          justify="end"
          align="middle"
          style={{ height: "100%", paddingRight: "50px" }}
        >
          <Col>
            <Dropdown.Button
              menu={menuProps}
              icon={
                user.userInfo && user.userInfo.avatar ? (
                  <Image
                    src={user.userInfo.avatar}
                    style={{ height: "25px" }}
                  />
                ) : (
                  <UserOutlined />
                )
              }
            >
              {user.userInfo ? user.userInfo.username : "尚未登录"}
            </Dropdown.Button>
          </Col>
        </Row>
      </Header>
    </div>
  );
};

export default AppHeader;
