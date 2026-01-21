# 部署指南

本文档介绍如何将 MedWeb 系统部署到生产环境。

## 架构概览

```
┌─────────────────┐         ┌─────────────────┐
│  GitHub Pages   │ ───────>│   Render (后端)  │
│  (前端 React)   │  API    │  (NestJS + PG)  │
└─────────────────┘         └─────────────────┘
     免费                       免费
```

---

## 第一部分：前端部署到 GitHub Pages（自动化）

### 步骤 1：启用 GitHub Pages

1. 进入您的 GitHub 仓库：https://github.com/USYD2020/medweb
2. 点击 **Settings**（设置）
3. 在左侧菜单找到 **Pages**
4. 在 **Build and deployment** 下配置：
   - **Source**: GitHub Actions
5. 保存设置

### 步骤 2：配置环境变量（可选）

如果您需要为前端设置后端 API URL：

1. 在仓库中进入 **Settings** → **Secrets and variables** → **Actions**
2. 添加新的 repository secret：
   - Name: `VITE_API_BASE_URL`
   - Value: `https://medweb-backend.onrender.com`（您的 Render 后端地址）

### 步骤 3：触发部署

推送代码到 `main` 分支会自动触发部署。或者：
1. 进入 **Actions** 标签页
2. 选择 "Deploy Frontend to GitHub Pages"
3. 点击 **Run workflow**

### 访问前端

部署完成后，您的网站将发布在：
```
https://usyd2020.github.io/medweb/
```

---

## 第二部分：后端部署到 Render

### 步骤 1：创建 Render 账户

1. 访问 https://render.com
2. 点击 **Sign Up** 注册（推荐使用 GitHub 账号登录）
3. 验证邮箱

### 步骤 2：部署 PostgreSQL 数据库

1. 登录 Render 后，点击 **New** → **PostgreSQL**
2. 配置数据库：
   - Name: `medweb-db`
   - Database: `medweb`
   - User: `medweb_user`
   - Region: Singapore（或离您最近的区域）
   - Plan: **Free**（免费）
3. 点击 **Create Database**

**保存以下信息**（在创建后显示）：
- Internal Database URL
- External Database URL
- Host, Port, User, Password, Database

### 步骤 3：部署 Redis

1. 点击 **New** → **Redis**
2. 配置：
   - Name: `medweb-redis`
   - Region: 与数据库相同
   - Plan: **Free**（免费）
3. 点击 **Create Redis**

### 步骤 4：部署后端服务

#### 方法 A：使用 render.yaml（推荐）

1. 点击 **New** → **Blueprint**
2. 连接您的 GitHub 仓库
3. Render 会自动检测 `medweb-backend/render.yaml` 配置
4. 点击 **Apply Blueprint**

#### 方法 B：手动创建 Web Service

1. 点击 **New** → **Web Service**
2. 连接您的 GitHub 仓库，选择 `medweb-backend` 目录
3. 配置：
   - Name: `medweb-backend`
   - Runtime: **Node**
   - Build Command: `npm install && npm run build`
   - Start Command: `npm run start:prod`
   - Region: 与数据库相同
4. 配置环境变量（点击 **Advanced** → **Add Environment Variable**）：

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `PORT` | `10000` |
| `DATABASE_HOST` | [数据库 Host] |
| `DATABASE_PORT` | [数据库 Port] |
| `DATABASE_USERNAME` | [数据库 User] |
| `DATABASE_PASSWORD` | [数据库 Password] |
| `DATABASE_NAME` | [数据库名称] |
| `JWT_SECRET` | [随机生成的字符串] |
| `JWT_EXPIRATION` | `7d` |
| `REDIS_HOST` | [Redis Host] |
| `REDIS_PORT` | [Redis Port] |

5. 点击 **Create Web Service**

### 步骤 5：运行数据库迁移

1. 在 Render 控制台中，打开您的后端服务
2. 点击 **Shell** 标签
3. 运行命令：
```bash
npm run migration:run
```

### 步骤 6：获取后端 URL

部署完成后，Render 会提供一个 URL，例如：
```
https://medweb-backend.onrender.com
```

**请保存此 URL**，用于配置前端。

---

## 第三部分：连接前后端

### 更新前端 API 地址

编辑 `frontend/.env.production`：
```env
VITE_API_BASE_URL=https://medweb-backend.onrender.com
```

然后推送代码到 GitHub，前端会自动重新部署。

### 验证连接

1. 访问前端：https://usyd2020.github.io/medweb/
2. 尝试注册/登录
3. 创建新病例并保存

---

## 故障排查

### 前端问题

**页面空白或 404**
- 检查 GitHub Pages 设置是否正确
- 等待几分钟让部署完成
- 查看 Actions 日志是否有错误

**API 请求失败**
- 确认后端服务正在运行
- 检查浏览器控制台的 API URL 是否正确
- 确认 CORS 配置正确

### 后端问题

**数据库连接失败**
- 检查 Render 上的数据库是否正在运行
- 验证环境变量是否正确
- 查看 Render 日志

**服务启动失败**
- 检查 Build 和 Start 命令是否正确
- 查看构建日志

### Redis 连接问题

- 确认 Redis 服务正在运行
- 检查 Redis Host 和 Port 是否正确

---

## 成本

| 服务 | 费用 |
|------|------|
| GitHub Pages | 免费 |
| Render (Web Service) | 免费（有限制）|
| Render (PostgreSQL) | 免费（90天，之后 $7/月）|
| Render (Redis) | 免费（有限制）|

**注意**：Render 免费套餐在服务无活动 15 分钟后会进入休眠，首次访问需要 30-60 秒唤醒时间。

---

## 下一步

1. 设置自定义域名（可选）
2. 配置 CDN（可选）
3. 设置监控和告警（可选）
4. 配置自动备份

---

如有问题，请参考：
- [GitHub Pages 文档](https://docs.github.com/pages)
- [Render 文档](https://render.com/docs)
