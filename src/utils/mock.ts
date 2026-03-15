import MockAdapter from 'axios-mock-adapter';
import request from './request';

const mock = new MockAdapter(request, { delayResponse: 500 });
const timestamp = new Date().toISOString();

// =======================
// 1. 用户 (Users)
// =======================
mock.onGet('/users').reply(200, {
  results: [
    { objectId: "u1", username: "admin", roleId: "r1", createdAt: timestamp },
    { objectId: "u2", username: "teacher_wang", roleId: "r2", createdAt: timestamp },
    { objectId: "u3", username: "student_li", roleId: "r3", createdAt: timestamp }
  ]
});

// =======================
// 2. 角色 (ReactRole)
// =======================
const authKeys = [
  "/dashboard",
  "/category",
  "/course",
  "/system",
  "/system/role",
  "/system/user",
  "/setting",
  "/banner",
  "/excel",
  "/excel/importExcel",
  "/excel/exportExcel",
  "/largeFile"
];

const mockRoles = [
  { objectId: "r1", roleName: "super_admin", permission: authKeys, createdAt: timestamp },
  { objectId: "r2", roleName: "teacher", permission: ["/dashboard", "/course", "/setting"], createdAt: timestamp },
  { objectId: "r3", roleName: "student", permission: ["/dashboard"], createdAt: timestamp }
];
mock.onGet(/^\/classes\/ReactRole(\/.*)?/).reply((config) => {
    // 拦截 roleGet (带 ID 或不带 ID)
    if(config.url && config.url.includes('ReactRole/')) {
        return [200, mockRoles[0]]
    }
    return [200, { results: mockRoles }];
});

// =======================
// 3. 课程分类 (ReactCategory)
// =======================
const mockCategories = [
  { objectId: "c1", name: "瑜伽与冥想", isShow: true, createdAt: timestamp },
  { objectId: "c2", name: "健身与力量", isShow: true, createdAt: timestamp },
  { objectId: "c3", name: "游泳训练", isShow: true, createdAt: timestamp },
  { objectId: "c4", name: "户外攀岩", isShow: true, createdAt: timestamp }
];
mock.onGet('/classes/ReactCategory').reply(200, {
  results: mockCategories
});

// =======================
// 4. 课程列表 (ReactCourse)
// =======================
const mockCourses = [
  { objectId: "co1", name: "初级正念冥想引导", price: 199, isVip: true, categoryId: "c1", poster: "/images/meditation.jpg", desc: "每天10分钟，找回内心的平静", createdAt: timestamp },
  { objectId: "co2", name: "哈他瑜伽核心进阶", price: 299, isVip: true, categoryId: "c1", poster: "/images/yoga.jpg", desc: "核心力量提升与身体柔韧性进阶", createdAt: timestamp },
  { objectId: "co3", name: "硬拉与深蹲标准动作库", price: 99, isVip: false, categoryId: "c2", poster: "/images/fitness.jpg", desc: "健身房三大项权威解析", createdAt: timestamp },
  { objectId: "co4", name: "自由泳入门到精通", price: 0, isVip: false, categoryId: "c3", poster: "/images/swimming.jpg", desc: "零基础学习标准自由泳姿势", createdAt: timestamp },
  { objectId: "co5", name: "室内攀岩抱石技巧", price: 150, isVip: false, categoryId: "c4", poster: "/images/climbing.jpg", desc: "从V0到V3的核心攀爬技巧", createdAt: timestamp }
];
// 匹配带有查询参数的 ReactCourse 请求
mock.onGet(/^\/classes\/ReactCourse/).reply(200, {
  results: mockCourses
});

// =======================
// 5. 数据统计图表 (ReactChart)
// =======================
mock.onGet('/classes/ReactChart').reply(200, {
  results: [{
    objectId: "chart1",
    // 假设这些是不同图表的数据源
    reactChart: [
      { month: "1月", sales: 120 }, { month: "2月", sales: 200 }, { month: "3月", sales: 150 },
      { month: "4月", sales: 300 }, { month: "5月", sales: 280 }, { month: "6月", sales: 400 }
    ],
    funnelChart: [
      { value: 100, name: '展现' }, { value: 80, name: '试听' },
      { value: 60, name: '注册' }, { value: 40, name: '付费' }, { value: 20, name: '复购' }
    ],
    radarChart: [
      { name: '瑜伽', max: 100, value: 80 }, { name: '健身', max: 100, value: 90 },
      { name: '游泳', max: 100, value: 60 }, { name: '攀岩', max: 100, value: 85 }
    ]
  }]
});

// =======================
// 6. 轮播图 (ReactBanner)
// =======================
const mockBanners = [
  { objectId: "b1", url: "/images/banner_meditation.jpg", name: "周末冥想营", link: "/", createdAt: timestamp },
  { objectId: "b2", url: "/images/banner_fitness.jpg", name: "夏季减脂挑战", link: "/", createdAt: timestamp },
  { objectId: "b3", url: "/images/meditation.jpg", name: "新手免费公开课", link: "/", createdAt: timestamp },
];
mock.onGet('/classes/ReactBanner').reply(200, {
  results: mockBanners
});

// =======================
// 通用的 POST / PUT / DELETE 拦截 (保证表单提交不报错)
// =======================
mock.onPost(/\/classes\/.+/).reply(200, {
  objectId: "mock_new_id_" + Math.random().toString(36).substring(7),
  createdAt: timestamp
});

mock.onPut(/\/classes\/.+/).reply(200, {
  updatedAt: timestamp
});

mock.onPut(/\/users\/.+/).reply(200, {
  updatedAt: timestamp
});

mock.onDelete(/\/classes\/.+/).reply(200, {});

mock.onPost('/batch').reply(200, {});

export default mock;
