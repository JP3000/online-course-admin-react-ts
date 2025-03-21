import {
  AlipayCircleOutlined,
  LockOutlined,
  MobileOutlined,
  TaobaoCircleOutlined,
  UserOutlined,
  WeiboCircleOutlined,
} from "@ant-design/icons";
import {
  LoginForm,
  ProConfigProvider,
  ProFormCaptcha,
  ProFormCheckbox,
  ProFormText,
  setAlpha,
} from "@ant-design/pro-components";

import { Space, Spin, Tabs, theme, message } from "antd";
import { TabsProps } from "antd/lib";
import type { CSSProperties } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { userLoginAsync } from "../../store/modules/user";
import { AccountType } from "../../type/user";
import { RootState } from "../../store";
import { useNavigate } from "react-router-dom";

type LoginType = "phone" | "account";

const LoginTable = () => {
  const { token } = theme.useToken();
  const [loginType, setLoginType] = useState<LoginType>("account");
  const dispatch = useDispatch(); // 触发状态机数据变化
  const state = useSelector((state: RootState) => state); // 提取状态机
  const navigate = useNavigate();
  //   console.log("login获取状态机", state.user);

  const handleLogin = async (values: AccountType) => {
    // console.log(values);
    userLoginAsync(values, dispatch, navigate);
  };

  const iconStyles: CSSProperties = {
    marginInlineStart: "16px",
    color: setAlpha(token.colorTextBase, 0.2),
    fontSize: "24px",
    verticalAlign: "middle",
    cursor: "pointer",
  };

  const items: TabsProps["items"] = [
    {
      key: "account",
      label: "账号密码登录",
    },
    {
      key: "phone",
      label: "手机号登录",
    },
  ];

  return (
    <ProConfigProvider hashed={false}>
      <div
        style={{ backgroundColor: token.colorBgContainer, marginTop: "100px" }}
      >
        <Spin spinning={state.user.isLoading}>
          <LoginForm
            onFinish={handleLogin}
            logo="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg"
            title={state.user.test}
            subTitle="登录界面"
            initialValues={{
              username: "jim",
              password: "123123",
            }}
            actions={
              <Space>
                其他登录方式
                <AlipayCircleOutlined style={iconStyles} />
                <TaobaoCircleOutlined style={iconStyles} />
                <WeiboCircleOutlined style={iconStyles} />
              </Space>
            }
          >
            <Tabs
              items={items}
              centered
              activeKey={loginType}
              onChange={(activeKey) => setLoginType(activeKey as LoginType)}
            />

            {loginType === "account" && (
              <>
                <ProFormText
                  name="username"
                  fieldProps={{
                    size: "large",
                    prefix: <UserOutlined className={"prefixIcon"} />,
                  }}
                  placeholder={"用户名: admin or user"}
                  rules={[
                    {
                      required: true,
                      message: "请输入用户名!",
                    },
                  ]}
                />
                <ProFormText.Password
                  name="password"
                  fieldProps={{
                    size: "large",
                    prefix: <LockOutlined className={"prefixIcon"} />,
                    strengthText:
                      "Password should contain numbers, letters and special characters, at least 8 characters long.",
                    statusRender: (value) => {
                      const getStatus = () => {
                        if (value && value.length > 12) {
                          return "ok";
                        }
                        if (value && value.length > 6) {
                          return "pass";
                        }
                        return "poor";
                      };
                      const status = getStatus();
                      if (status === "pass") {
                        return (
                          <div style={{ color: token.colorWarning }}>
                            强度：中
                          </div>
                        );
                      }
                      if (status === "ok") {
                        return (
                          <div style={{ color: token.colorSuccess }}>
                            强度：强
                          </div>
                        );
                      }
                      return (
                        <div style={{ color: token.colorError }}>强度：弱</div>
                      );
                    },
                  }}
                  placeholder={"密码: ant.design"}
                  rules={[
                    {
                      required: true,
                      message: "请输入密码！",
                    },
                  ]}
                />
              </>
            )}
            {loginType === "phone" && (
              <>
                <ProFormText
                  fieldProps={{
                    size: "large",
                    prefix: <MobileOutlined className={"prefixIcon"} />,
                  }}
                  name="mobile"
                  placeholder={"手机号"}
                  rules={[
                    {
                      required: true,
                      message: "请输入手机号！",
                    },
                    {
                      pattern: /^1\d{10}$/,
                      message: "手机号格式错误！",
                    },
                  ]}
                />
                <ProFormCaptcha
                  fieldProps={{
                    size: "large",
                    prefix: <LockOutlined className={"prefixIcon"} />,
                  }}
                  captchaProps={{
                    size: "large",
                  }}
                  placeholder={"请输入验证码"}
                  captchaTextRender={(timing, count) => {
                    if (timing) {
                      return `${count} ${"获取验证码"}`;
                    }
                    return "获取验证码";
                  }}
                  name="captcha"
                  rules={[
                    {
                      required: true,
                      message: "请输入验证码！",
                    },
                  ]}
                  onGetCaptcha={async () => {
                    message.success("获取验证码成功！验证码为：1234");
                  }}
                />
              </>
            )}
            <div
              style={{
                marginBlockEnd: 24,
              }}
            >
              <ProFormCheckbox noStyle name="autoLogin">
                自动登录
              </ProFormCheckbox>
              <a
                style={{
                  float: "right",
                }}
              >
                忘记密码
              </a>
            </div>
          </LoginForm>
        </Spin>
      </div>
    </ProConfigProvider>
  );
};

export default LoginTable;
