export interface AccountType {
    username: string; // 必须为username,leanCloud后端要求
    password: string;
}

// 用户信息
export interface UserInfoType {
    username: string;
    objectId: string;
    sessionToken: string;
    avatar?:string;
    roleName: string;
    permission: string[];
}

// 角色
export interface RoleType {
    objectId: string;
    roleName: string;
    permission: string[]; // 存放当前用户有权访问的路由路径
}
