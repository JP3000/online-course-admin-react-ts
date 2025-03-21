// 集中管理工具方法函数

import  mainRoutes  from "../router"
import { IMenuType } from "../router/inter";
import { cloneDeep } from "lodash-es";

// 将路由数据包，整理为key:value形式
export const routeMapTool = () => {
    const breadCrumbMap: Record<string, string> = {};
    const getBreadCrumbMap = (arr: IMenuType[]) => {
        arr.forEach((item) => {
          breadCrumbMap[item.key] = item.title;
          if (item.children) {
            getBreadCrumbMap(item.children);
          }
        });
      };
      
    getBreadCrumbMap(mainRoutes);
    return breadCrumbMap;
};

// 根据角色权限，hidden属性，筛选菜单数据包
export function filterRoutes(permission: string[]) {
  // permission []: string[] = ['dashboard', 'dashboard/workplace', 'dashboard/analysis']
  const routes = cloneDeep(mainRoutes); // 深拷贝
  function loop(arr: IMenuType[]) {
    for (let i = arr.length - 1; i >= 0; i--) {
      const isPermit = permission.includes(arr[i].key);//查看许可中是否有权限    
      if (arr[i].hideInMenu || !isPermit) {
        arr.splice(i, 1);
      }
      if (arr[i] && arr[i].children) {
        loop(arr[i].children!); // 递归调用
      }
    }
  }
  loop(routes);
  return routes;
}
