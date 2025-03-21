// 对axios进行集中封装配置
import { message } from "antd";
import axios from "axios";

// 基于axios创建一个分身
const instance = axios.create({
    baseURL:'https://jdimw4dd.lc-cn-n1-shared.com/1.1', // 通用接口地址配置
    headers:{ // 请求头配置
        "X-LC-Id": "JdIMW4DdKVBPUgJ6xhZBqVLG-gzGzoHsz",
        "X-LC-Key": "ECrANK5WsVTbHGCHd2wKLp1M" ,
        "Content-Type": "application/json",
        //"X-LC-Session":"用户登录后端下发的，不固定" 
    },
});

// 添加请求拦截器
instance.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    console.log('请求拦截器');
    message.success('操作成功');
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
    message.error('操作失败');
    console.log("响应拦截器", error);
    // return Promise.reject(error);
  });

export default instance