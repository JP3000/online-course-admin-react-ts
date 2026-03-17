// 对axios进行集中封装配置
import { message } from "antd";
import axios from "axios";

const rawBaseURL = import.meta.env.VITE_API_BASE_URL?.trim();
const baseURL = rawBaseURL || "http://127.0.0.1:3001";

// 基于axios创建一个分身
const instance = axios.create({
  baseURL, // 通用接口地址配置
    headers:{ // 请求头配置
        "Content-Type": "application/json",
    //"X-LC-Session":"用户登录后端下发的，不固定"
    },
});

// 添加请求拦截器
instance.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    return config;
  }, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  });

// 添加响应拦截器
instance.interceptors.response.use(function (response) {
    // 2xx 范围内的状态码都会触发该函数。
    // 对响应数据做点什么
    return response;// 此处的return不能丢，结果会给到发请求的then
  }, function (error) {
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么
    const status = error?.response?.status;
    if (status === 401) {
      message.error("登录状态已失效，请重新登录");
    } else if (status === 403) {
      message.error("无权限执行该操作");
    } else if (status >= 500) {
      message.error("服务器异常，请稍后重试");
    } else {
      message.error(error?.response?.data?.error || "操作失败");
    }

    return Promise.reject(error);
  });

export default instance