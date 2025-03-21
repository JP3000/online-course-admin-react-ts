import { Navigate, useLocation } from "react-router-dom";
import { useAppSelector } from "../store";
import { useEffect, useState } from "react";

type IProps = {
  children?: React.ReactNode;
};

export default function PermissionAuth({ children }: IProps) {
  // 获取当前用户访问的路由路径 /system/user
  const { pathname } = useLocation();
  // 当前用户权限数组 ['/system/user', '/system/user/create']
  const { user } = useAppSelector((state) => state);
  const [hasPermission, setHasPermission] = useState<boolean>(false);
  useEffect(() => {
    if (user.userInfo) {
      const { permission } = user.userInfo;
      const fullPermitArr = permission.concat(["/permission/deny", "/"]); // 所有用户都可以访问
      const bool = fullPermitArr.includes(pathname);
      setHasPermission(bool);
    }
  }, []);
  return (
    <div>{hasPermission ? children : <Navigate to="/permission/deny" />}</div>
  );
}
