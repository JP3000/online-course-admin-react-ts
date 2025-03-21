import { ReactNode } from "react";
// 专门存放约束类型
export interface IMenuType{
        key: string,
        icon?: ReactNode,
        label: string,
        title: string,
        element?: ReactNode,
        children?:IMenuType[]
        hideInMenu?: boolean
}