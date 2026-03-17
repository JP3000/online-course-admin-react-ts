import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const allPermissions = [
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
  "/largeFile",
];

async function main() {
  await prisma.stu.deleteMany();
  await prisma.banner.deleteMany();
  await prisma.chart.deleteMany();
  await prisma.course.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();
  await prisma.role.deleteMany();

  const [superAdminRole, teacherRole, studentRole] = await Promise.all([
    prisma.role.create({
      data: {
        roleName: "super_admin",
        permission: allPermissions,
      },
    }),
    prisma.role.create({
      data: {
        roleName: "teacher",
        permission: ["/dashboard", "/course", "/setting", "/excel"],
      },
    }),
    prisma.role.create({
      data: {
        roleName: "student",
        permission: ["/dashboard"],
      },
    }),
  ]);

  const passwordHash = await bcrypt.hash("123123", 10);

  await prisma.user.createMany({
    data: [
      {
        username: "admin",
        passwordHash,
        avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=admin",
        roleId: superAdminRole.id,
      },
      {
        username: "jim",
        passwordHash,
        avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=jim",
        roleId: superAdminRole.id,
      },
      {
        username: "teacher_wang",
        passwordHash,
        avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=teacher",
        roleId: teacherRole.id,
      },
      {
        username: "student_li",
        passwordHash,
        avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=student",
        roleId: studentRole.id,
      },
    ],
  });

  const [yoga, fitness] = await Promise.all([
    prisma.category.create({
      data: {
        id: "cate_top_yoga",
        name: "瑜伽与冥想",
        parentId: "0-0",
        isShow: true,
      },
    }),
    prisma.category.create({
      data: {
        id: "cate_top_fitness",
        name: "健身与力量",
        parentId: "0-0",
        isShow: true,
      },
    }),
  ]);

  await prisma.category.createMany({
    data: [
      {
        name: "正念冥想",
        parentId: yoga.id,
        isShow: true,
      },
      {
        name: "哈他瑜伽",
        parentId: yoga.id,
        isShow: true,
      },
      {
        name: "力量训练",
        parentId: fitness.id,
        isShow: true,
      },
      {
        name: "体能恢复",
        parentId: fitness.id,
        isShow: true,
      },
    ],
  });

  await prisma.course.createMany({
    data: [
      {
        name: "正念冥想入门",
        poster: "/images/meditation.jpg",
        level1: "瑜伽与冥想",
        level2: "正念冥想",
        isVip: true,
        intro: "每天10分钟，提升专注力",
        detail: "课程内容涵盖呼吸练习、身体扫描、情绪观察。",
      },
      {
        name: "力量训练基础",
        poster: "/images/fitness.jpg",
        level1: "健身与力量",
        level2: "力量训练",
        isVip: false,
        intro: "动作标准化与安全训练",
        detail: "课程内容涵盖深蹲、硬拉、卧推与辅助训练。",
      },
    ],
  });

  await prisma.chart.create({
    data: {
      info: {
        data: [
          { value: 1048, name: "前端开发" },
          { value: 735, name: "Java开发" },
          { value: 580, name: "运维工程师" },
          { value: 484, name: "测试工程师" },
          { value: 300, name: "UI设计" },
        ],
      },
    },
  });

  await prisma.banner.createMany({
    data: [
      {
        name: "周末冥想营",
        img: "/images/banner_meditation.jpg",
        music: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
      },
      {
        name: "夏季减脂挑战",
        img: "/images/banner_fitness.jpg",
        music: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
      },
    ],
  });

  console.log("Seed completed.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });