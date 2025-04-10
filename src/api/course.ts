// 集中管理跟课程相关的网络请求
import { BannerType, CategoryType, CourseType } from "../type/course";
import request from "../utils/request";
// 录入课程分类数据
export const categoryPost = (category:CategoryType) => {
    return request.post('/classes/ReactCategory', category)
}

// 查询分类列表
export const categoryGet = () => {
    return request.get('/classes/ReactCategory')
}

// 更新分类
export const categoryPut = (objectId:string, isShow:boolean) => {
    return request.put(`/classes/ReactCategory/${objectId}`,{isShow:isShow})
}

// 新增课程
export const coursePost = (course:CourseType) => {
    return request.post('/classes/ReactCourse', course)
}

// // 课程列表数据加载
// interface SearchType{
//     name?:string
// }

// // 精准查询
// export const courseGet = ({name}:{name:string}) => {
//     const where:SearchType = {

//     }as SearchType;
//     if(name){
//         where.name = name
//     }
//     return request.get('/classes/ReactCourse',{
//         params:{
//             where, // 查询条件
//         }
//     })
// }


// 课程列表数据加载
interface SearchType{
    name:{"$regex":string, "$options":"i"}
    isVip?:boolean | number
}

// 正则模糊查询
export const courseGet = ({name, isVip}:{name:string, isVip?:boolean | number}) => {
    const where:SearchType = {

    }as SearchType;
    if(name){
        where.name = {"$regex":name, "$options":"i"}//正则条件
    }
    if(isVip){
        const bool = isVip == 2;
        where.isVip = bool;
    }
    const query = `where=${JSON.stringify(where)}`;
    return request.get(`/classes/ReactCourse?${query}`);
}

// 数据统计
export const chartGet = () => {
    return request.get('/classes/ReactChart')
}

// 新增轮播图
export const bannerPost = (banner:BannerType) => {
    return request.post('/classes/ReactBanner', banner)
}