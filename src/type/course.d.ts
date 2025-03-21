// 集中管理跟课程业务相关的ts类型约束

// 约定课程分类的数据格式
export interface CategoryType {
    objectId?:string
    name:string
    parentId:string // 当前分类的父级id，顶级为0-0
    isShow:boolean
    children?:CategoryType[]
}

export interface CourseType {
    objectId?:string
    name:string
    poster:string
    level1:string // 一级类目名称
    level2:string // 二级类目名称
    isVip:boolean
    intro:string
    detail:string
    cate:Array<string>
}

