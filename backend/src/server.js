import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

dotenv.config();

const prisma = new PrismaClient();
const app = express();

const port = Number(process.env.PORT || 3001);

app.use(cors());
app.use(express.json({ limit: "2mb" }));

function toLeanObject(record) {
  if (!record) {
    return record;
  }

  const { id, ...rest } = record;
  return {
    ...rest,
    objectId: id,
  };
}

function toLeanList(records) {
  return records.map((item) => toLeanObject(item));
}

function parseWhere(whereQuery) {
  if (!whereQuery || typeof whereQuery !== "string") {
    return {};
  }

  try {
    return JSON.parse(whereQuery);
  } catch {
    return {};
  }
}

function extractIdFromBatchPath(path) {
  if (!path || typeof path !== "string") {
    return null;
  }

  const match = path.match(/ReactRole\/([^/]+)$/);
  return match?.[1] || null;
}

app.get("/health", (_req, res) => {
  res.json({ ok: true, service: "online-course-admin-backend" });
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body || {};

  if (!username || !password) {
    return res.status(400).json({ error: "用户名和密码不能为空" });
  }

  const user = await prisma.user.findUnique({
    where: { username },
    include: { role: true },
  });

  if (!user) {
    return res.status(401).json({ error: "账号或密码错误" });
  }

  const isValid = await bcrypt.compare(password, user.passwordHash);
  if (!isValid) {
    return res.status(401).json({ error: "账号或密码错误" });
  }

  return res.json({
    objectId: user.id,
    username: user.username,
    sessionToken: `session_${user.id}`,
    roleId: user.roleId,
    avatar: user.avatar,
  });
});

app.get("/users", async (_req, res) => {
  const users = await prisma.user.findMany({
    include: { role: true },
    orderBy: { createdAt: "desc" },
  });

  const results = users.map((item) => ({
    objectId: item.id,
    username: item.username,
    avatar: item.avatar,
    roleId: item.roleId,
    roleName: item.role.roleName,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  }));

  res.json({ results });
});

app.post("/users", async (req, res) => {
  const { username, password, roleId } = req.body || {};

  if (!username || !password || !roleId) {
    return res.status(400).json({ error: "username、password、roleId 均为必填" });
  }

  const exists = await prisma.user.findUnique({ where: { username } });
  if (exists) {
    return res.status(409).json({ error: "账号已存在" });
  }

  const role = await prisma.role.findUnique({ where: { id: roleId } });
  if (!role) {
    return res.status(400).json({ error: "角色不存在" });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const created = await prisma.user.create({
    data: {
      username,
      passwordHash,
      roleId,
    },
  });

  res.json({ objectId: created.id, createdAt: created.createdAt });
});

app.put("/users/:id", async (req, res) => {
  const { id } = req.params;
  const { username, avatar } = req.body || {};

  const updated = await prisma.user.update({
    where: { id },
    data: {
      ...(username ? { username } : {}),
      ...(avatar !== undefined ? { avatar } : {}),
    },
  });

  res.json({ updatedAt: updated.updatedAt });
});

app.get("/classes/ReactRole/:id", async (req, res) => {
  const role = await prisma.role.findUnique({ where: { id: req.params.id } });
  if (!role) {
    return res.status(404).json({ error: "角色不存在" });
  }

  return res.json(toLeanObject(role));
});

app.get("/classes/ReactRole", async (_req, res) => {
  const roles = await prisma.role.findMany({ orderBy: { createdAt: "desc" } });
  res.json({ results: toLeanList(roles) });
});

app.post("/classes/ReactRole", async (req, res) => {
  const { roleName, permission } = req.body || {};

  if (!roleName || !Array.isArray(permission)) {
    return res.status(400).json({ error: "roleName 和 permission 为必填" });
  }

  const created = await prisma.role.create({
    data: { roleName, permission },
  });

  res.json({ objectId: created.id, createdAt: created.createdAt });
});

app.put("/classes/ReactRole/:id", async (req, res) => {
  const { roleName, permission } = req.body || {};
  const updated = await prisma.role.update({
    where: { id: req.params.id },
    data: {
      ...(roleName ? { roleName } : {}),
      ...(Array.isArray(permission) ? { permission } : {}),
    },
  });

  res.json({ updatedAt: updated.updatedAt });
});

app.delete("/classes/ReactRole/:id", async (req, res) => {
  await prisma.role.delete({ where: { id: req.params.id } });
  res.json({});
});

app.get("/classes/ReactCategory", async (_req, res) => {
  const categories = await prisma.category.findMany({
    orderBy: [{ parentId: "asc" }, { createdAt: "asc" }],
  });
  res.json({ results: toLeanList(categories) });
});

app.post("/classes/ReactCategory", async (req, res) => {
  const { name, parentId = "0-0", isShow = true } = req.body || {};
  if (!name) {
    return res.status(400).json({ error: "name 不能为空" });
  }

  const created = await prisma.category.create({
    data: { name, parentId, isShow: !!isShow },
  });

  res.json({ objectId: created.id, createdAt: created.createdAt });
});

app.put("/classes/ReactCategory/:id", async (req, res) => {
  const { name, parentId, isShow } = req.body || {};

  const updated = await prisma.category.update({
    where: { id: req.params.id },
    data: {
      ...(name !== undefined ? { name } : {}),
      ...(parentId !== undefined ? { parentId } : {}),
      ...(isShow !== undefined ? { isShow: !!isShow } : {}),
    },
  });

  res.json({ updatedAt: updated.updatedAt });
});

app.delete("/classes/ReactCategory/:id", async (req, res) => {
  await prisma.category.delete({ where: { id: req.params.id } });
  res.json({});
});

app.get("/classes/ReactCourse", async (req, res) => {
  const where = parseWhere(req.query.where);

  const prismaWhere = {};

  if (where?.name?.$regex) {
    prismaWhere.name = {
      contains: String(where.name.$regex),
      mode: "insensitive",
    };
  }

  if (typeof where?.isVip === "boolean") {
    prismaWhere.isVip = where.isVip;
  }

  const courses = await prisma.course.findMany({
    where: prismaWhere,
    orderBy: { createdAt: "desc" },
  });

  res.json({ results: toLeanList(courses) });
});

app.post("/classes/ReactCourse", async (req, res) => {
  const payload = req.body || {};
  const cate = Array.isArray(payload.cate) ? payload.cate : [];

  const created = await prisma.course.create({
    data: {
      name: payload.name || "未命名课程",
      poster: payload.poster || "",
      level1: payload.level1 || cate[0] || "",
      level2: payload.level2 || cate[1] || "",
      isVip: !!payload.isVip,
      intro: payload.intro || "",
      detail: payload.detail || "",
    },
  });

  res.json({ objectId: created.id, createdAt: created.createdAt });
});

app.get("/classes/ReactChart", async (_req, res) => {
  let chart = await prisma.chart.findFirst({ orderBy: { createdAt: "desc" } });

  if (!chart) {
    chart = await prisma.chart.create({
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
  }

  res.json({ results: [toLeanObject(chart)] });
});

app.get("/classes/ReactBanner", async (_req, res) => {
  const banners = await prisma.banner.findMany({ orderBy: { createdAt: "desc" } });
  res.json({ results: toLeanList(banners) });
});

app.post("/classes/ReactBanner", async (req, res) => {
  const { name = "未命名轮播", img = "", music = "" } = req.body || {};
  const created = await prisma.banner.create({ data: { name, img, music } });
  res.json({ objectId: created.id, createdAt: created.createdAt });
});

app.post("/batch", async (req, res) => {
  const { requests } = req.body || {};

  if (!Array.isArray(requests)) {
    return res.status(400).json({ error: "requests 必须是数组" });
  }

  for (const item of requests) {
    if (item?.method === "DELETE" && typeof item?.path === "string") {
      const roleId = extractIdFromBatchPath(item.path);
      if (roleId) {
        await prisma.role.deleteMany({ where: { id: roleId } });
      }
      continue;
    }

    if (item?.method === "POST" && typeof item?.path === "string") {
      if (item.path.includes("ReactStu")) {
        const body = item.body || {};
        const age = Number(body.age);
        const score = Number(body.score);

        if (!Number.isNaN(age) && !Number.isNaN(score) && body.name) {
          await prisma.stu.create({
            data: {
              name: String(body.name),
              age,
              score,
            },
          });
        }
      }
    }
  }

  res.json({});
});

app.use((error, _req, res, _next) => {
  console.error(error);
  return res.status(500).json({ error: error?.message || "服务器异常" });
});

app.listen(port, () => {
  console.log(`Backend listening on http://localhost:${port}`);
});