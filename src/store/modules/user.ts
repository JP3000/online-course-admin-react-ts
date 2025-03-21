// 定义一个专门用于管理用户相关信息的子模块
// 定义状态机核心对象
import { createSlice, Dispatch } from "@reduxjs/toolkit";
import { AccountType, UserInfoType } from "../../type/user";
import { roleGet, userLogin } from "../../api/user";
import { NavigateFunction } from "react-router-dom";
import store2 from "store2";

type UserStateType = {
  isLogin: boolean;
  isLoading: boolean;
  userInfo: null | UserInfoType;
  test: string;
}

const initState:UserStateType = {
  //状态机模块的数据包
  isLogin: false,
  isLoading: false,
  userInfo: null,
  test: "在线课程管理系统",
};
// 尝试提取本地存储的数据，修改默认数值

const info = store2.get('userInfo-code26');
if(info){
  initState.isLogin = true;
  initState.userInfo = info;
}
const userSlice = createSlice({
  name: "user",
  initialState: initState,
  reducers: {
    // 定义修改状态的方法
    // 开启登录
    loginStart(state) {
      state.isLoading = true;
    },
    // 登录成功
    loginSuccess(state, action) {
      state.isLoading = false;
      state.isLogin = true;
      state.userInfo = action.payload;
      store2('userInfo-code26', action.payload);    
    },
    // 登录失败,退出登录
    loginFail(state) {
      state.isLoading = false;
      state.isLogin = false;
      state.userInfo = null;
      store2.remove('userInfo-code26');
    },
  },
});

// 导出状态机核心对象
export const { loginStart, loginSuccess, loginFail } = userSlice.actions;

// 导出状态机模块
export default userSlice.reducer;

// 异步登录：实现用户登录请求的异步方法
export const userLoginAsync = async (account:AccountType, dispath:Dispatch, navigate:NavigateFunction) => {
  // 触发loginStart
  dispath(loginStart());
  // 发起网络请求
  try {
     // 成功，触发loginSuccess
    const res = await userLogin(account)
    const {roleId} = res.data; // 获取角色Id
    const role = await roleGet(roleId) // 角色Id对应的完整角色数据包
    dispath(loginSuccess({...res.data, ...role.data}));//整合用户信息，角色信息
    alert(`登录成功`);
    // 触发路由跳转，再次尝试访问主面板
    navigate("/");
  } catch (error) {
    // 失败，触发loginFail
    dispath(loginFail());
    alert(`登录失败 ${error}`);
  }
}
