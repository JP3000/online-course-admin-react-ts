// 集中管理 跟用户相关的业务请求
import { AccountType, RoleType, UserInfoType } from "../type/user";
import request from "../utils/request";
import React from "react";
type Key = React.Key;

// 用户登录
export const userLogin = (account:AccountType) => {
    return request.post('/login', account); // 登录
} 

// 更新用户信息
export const userUpdate = (id:string, userObj:UserInfoType, token:string) => {
    return request.put(`/users/${id}`, userObj, {
        headers:{
        "X-LC-Session":token,//当前请求额外携带的headers
        },
    });

}

// 新增角色
export const rolePost = (role:RoleType) => {
    return request.post('/classes/ReactRole', role);
}

// 获取角色列表，角色id对应的数据
export const roleGet = (id?:string) => {
    const queryId = id ? `/${id}` : '';
    return request.get(`/classes/ReactRole${queryId}`);
}

// 删除角色
export const roleDelete = (objectId:string) => {
    return request.delete(`/classes/ReactRole/${objectId}`);
}

// 修改角色
export const rolePut = (objectId:string, role:RoleType) => {
    return request.put(`/classes/ReactRole/${objectId}`, role);
}

// 批量删除角色
export const roleBatchDel = (ids:Array<Key>) => {
    const requests = ids.map(id => {
        return {
            method: "DELETE",
            path: `/1.1/classes/ReactRole/${id}`
        }
    })
    return request.post('/batch', {requests})
}

// 分配账号（帮别人注册）
export const userReg = (account:AccountType) => {
    return request.post('/users', account);
}

// 用户列表 【！！！注意，需要修改LeanCloud中_User标的find权限】
export const userGet = () => {
    return request.get('/users');
}

// Excel批量注入
interface Stu {
    name: string;
    age: number;
    score: number;
}
export const stuBatch = (stu:Array<Stu>) => {
    const requests = stu.map((item) => {
        return {
            method: "POST",
            path: `/1.1/classes/ReactStu`,
            body: item
        };
    })
    return request.post('/batch', {requests})
}
