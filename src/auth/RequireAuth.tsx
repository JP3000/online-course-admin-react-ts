// 路由守卫组件
import { ReactNode } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { Navigate } from "react-router-dom";

type Props = {
  children?: ReactNode;
};

export default function RequireAuth({ children }: Props) {
  // 获取用户信息，判断登录状态
  const { user } = useSelector((state: RootState) => state);
  return <div>{user.isLogin ? children : <Navigate to="/login" />}</div>;
}
