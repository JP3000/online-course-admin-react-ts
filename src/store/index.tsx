import { configureStore } from "@reduxjs/toolkit";
import user from "./modules/user";
import { TypedUseSelectorHook, useSelector } from "react-redux";

const store = configureStore({
  reducer: {
    user, // 配置子模块
  },
});

// 对外导出状态机对象
export default store;

// 动态获取store的数据类型，对外抛出
export type RootState = ReturnType<typeof store.getState>;

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
