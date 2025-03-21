import { useEffect, useState } from "react";
import { useAppSelector } from "../store";

type IProps = {
  children?: React.ReactNode;
  permit?: Array<string>;
};

export default function ButtonAuth({ children, permit }: IProps) {
  //当前用户的角色 “管理员”
  const { user } = useAppSelector((state) => state);
  const [isShow, setIsShow] = useState<boolean | undefined>(false);
  useEffect(() => {
    if (user.userInfo) {
      const bool = permit?.includes(user.userInfo.roleName);
      setIsShow(bool);
    }
  }, []);
  // 允许那些角色访问这个按钮 permit=["超级管理员"]
  return <>{isShow ? children : ""}</>;
}
