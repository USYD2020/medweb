# Docker 启动与数据库初始化指南

## 📋 目录
1. [确认 Docker Desktop 已启动](#第一步)
2. [打开终端](#第二步)
3. [进入项目目录](#第三步)
4. [启动数据库容器](#第四步)
5. [验证容器启动](#第五步)
6. [生成数据库迁移](#第六步)
7. [运行数据库迁移](#第七步)
8. [创建管理员账号](#第八步)
9. [验证初始化成功](#第九步)

---

## 第一步：确认 Docker Desktop 已启动 ✅

根据您的截图，Docker Desktop 已经成功启动了！

**如何判断 Docker 已就绪：**
- ✅ 左侧菜单显示 "Containers"（容器）
- ✅ 底部显示 "RAM 0.00 GB CPU 0.00%"
- ✅ 当前显示 "No containers are running"

**Docker Desktop 已就绪，可以继续下一步！**

---

## 第二步：打开终端（Terminal）

### 方法1：使用 Spotlight 搜索（推荐）
1. 按键盘快捷键 `Command (⌘) + 空格`
2. 输入 "Terminal" 或"终端"
3. 按回车键打开

### 方法2：从应用程序打开
1. 打开 Finder（访达）
2. 进入"应用程序" → "实用工具"
3. 双击"终端.app"

---

## 第三步：进入项目目录

在终端中**复制粘贴**以下命令：

```bash
cd "/Users/gogo/Library/Mobile Documents/com~apple~CloudDocs/MedWeb/medweb-backend"
```

然后按 `回车键` 执行。

**如何验证成功：**
终端提示符会显示当前目录，例如：
```
gogo@MacBook medweb-backend %
```

---

## 第四步：启动数据库容器 🚀

在终端中**复制粘贴**以下命令：

```bash
docker-compose -f docker-compose.dev.yml up -d
```

然后按 `回车键` 执行。

**命令说明：**
- `docker-compose`：Docker 编排工具
- `-f docker-compose.dev.yml`：指定配置文件
- `up`：启动容器
- `-d`：后台运行模式

**预期输出（成功）：**
```
[+] Running 3/3
 ✔ Network medweb-backend_default           Created
 ✔ Container medweb-postgres-dev            Started
 ✔ Container medweb-redis-dev               Started
```

**等待时间：** 首次启动需要下载镜像，大约 1-3 分钟

---

## 第五步：验证容器是否启动成功 ✓

### 方法1：在终端验证

在终端中输入：
```bash
docker ps
```

**预期输出：**
```
CONTAINER ID   IMAGE                 STATUS         PORTS                    NAMES
xxxxxxxxxxxx   postgres:15-alpine    Up 10 seconds  0.0.0.0:5432->5432/tcp   medweb-postgres-dev
xxxxxxxxxxxx   redis:7-alpine        Up 10 seconds  0.0.0.0:6379->6379/tcp   medweb-redis-dev
```

### 方法2：在 Docker Desktop 查看

1. 回到 Docker Desktop 窗口
2. 点击左侧的 "Containers"（容器）
3. 您应该能看到两个正在运行的容器：
   - `medweb-postgres-dev`（PostgreSQL 数据库）
   - `medweb-redis-dev`（Redis 缓存）
4. 状态应该显示为绿色的 "Running"

---

## 第六步：生成数据库迁移文件 📝

在终端中**复制粘贴**以下命令：

```bash
npm run migration:generate -- src/database/migrations/InitialSchema
```

然后按 `回车键` 执行。

**命令说明：**
- 自动比对实体定义和数据库结构
- 生成创建表的 SQL 迁移文件

**预期输出（成功）：**
```
Migration /Users/gogo/.../src/database/migrations/1234567890123-InitialSchema.ts has been generated successfully.
```

**等待时间：** 约 5-10 秒

---

## 第七步：运行数据库迁移 🗄️

在终端中**复制粘贴**以下命令：

```bash
npm run migration:run
```

然后按 `回车键` 执行。

**命令说明：**
- 执行迁移文件，在数据库中创建所有表

**预期输出（成功）：**
```
query: SELECT * FROM current_schema()
query: CREATE TABLE "users" (...)
query: CREATE TABLE "approval_requests" (...)
query: CREATE TABLE "form_versions" (...)
query: CREATE TABLE "cases" (...)
query: CREATE TABLE "case_answers" (...)
query: CREATE TABLE "audit_logs" (...)
Migration InitialSchema1234567890123 has been executed successfully.
query: COMMIT
```

**等待时间：** 约 3-5 秒

---

## 第八步：创建初始管理员账号 👤

在终端中**复制粘贴**以下命令：

```bash
npm run seed
```

然后按 `回车键` 执行。

**预期输出（成功）：**
```
开始执行种子数据...
✓ 数据库连接成功
✓ 管理员账号创建成功
  用户名: admin
  密码: Admin@123456
✓ 种子数据执行完成
```

**重要信息：**
- 📝 **管理员用户名**: `admin`
- 🔑 **管理员密码**: `Admin@123456`
- ⚠️ 请妥善保管这些登录信息
用户名: admin
密码: Admin@123456
---

## 第九步：验证数据库初始化成功 ✅

### 方法1：查看 Docker Desktop 日志

1. 在 Docker Desktop 中点击 `medweb-postgres-dev` 容器
2. 点击 "Logs" 标签
3. 查看日志，应该能看到数据库连接和表创建的记录

### 方法2：使用终端验证表是否创建

在终端中输入：
```bash
docker exec -it medweb-postgres-dev psql -U medweb -d medweb_db -c "\dt"
```

**预期输出：**
```
                List of relations
 Schema |        Name         | Type  | Owner
--------+---------------------+-------+--------
 public | approval_requests   | table | medweb
 public | audit_logs          | table | medweb
 public | case_answers        | table | medweb
 public | cases               | table | medweb
 public | form_versions       | table | medweb
 public | migrations          | table | medweb
 public | users               | table | medweb
```

---

## 🎉 完成！数据库初始化成功

如果您看到了上述所有成功的输出，恭喜您！数据库已经成功初始化。

**当前状态：**
- ✅ Docker 容器运行中（PostgreSQL + Redis）
- ✅ 数据库表已创建（6张业务表 + 1张迁移表）
- ✅ 管理员账号已创建（admin / Admin@123456）

---

## 🚨 常见问题排查

### 问题1：端口被占用

**错误信息：**
```
Error: bind: address already in use
```

**解决方法：**
```bash
# 查看占用 5432 端口的进程
lsof -i :5432

# 停止占用端口的进程，或修改 docker-compose.dev.yml 中的端口
```

### 问题2：Docker 守护进程未运行

**错误信息：**
```
Cannot connect to the Docker daemon
```

**解决方法：**
1. 确保 Docker Desktop 应用已打开
2. 等待底部状态栏显示 "Docker Desktop is running"
3. 重新执行命令

### 问题3：迁移文件已存在

**错误信息：**
```
Migration file already exists
```

**解决方法：**
```bash
# 直接运行迁移（跳过生成步骤）
npm run migration:run
```

---

## 📦 容器管理命令

### 停止容器（保留数据）

```bash
docker-compose -f docker-compose.dev.yml stop
```

### 重新启动容器

```bash
docker-compose -f docker-compose.dev.yml start
```

### 停止并删除容器（保留数据卷）

```bash
docker-compose -f docker-compose.dev.yml down
```

### 完全清理（删除容器和数据）

```bash
docker-compose -f docker-compose.dev.yml down -v
```

⚠️ **警告**：使用 `-v` 参数会删除所有数据，需要重新执行迁移和种子数据！

---

## 🚀 下一步：继续开发后端

数据库初始化完成后，我将继续开发以下模块：

### 第2-4天：认证授权模块

**待开发内容：**
1. **用户模块（Users Module）**
   - UsersService - 用户增删改查
   - UsersController - 用户管理接口
   - DTO（数据传输对象）

2. **认证模块（Auth Module）**
   - AuthService - 注册、登录、JWT生成
   - JWT Strategy - JWT令牌验证
   - Local Strategy - 本地用户名密码验证
   - AuthController - 认证接口
   - DTO（RegisterDto、LoginDto）

3. **审核模块（Approvals Module）**
   - ApprovalsService - 审核业务逻辑
   - ApprovalsController - 审核管理接口
   - 集成审核流程到注册

---

## 📝 快速命令参考

### 完整初始化流程（一次性执行）

```bash
# 1. 进入项目目录
cd "/Users/gogo/Library/Mobile Documents/com~apple~CloudDocs/MedWeb/medweb-backend"

# 2. 启动数据库
docker-compose -f docker-compose.dev.yml up -d

# 3. 生成迁移
npm run migration:generate -- src/database/migrations/InitialSchema

# 4. 运行迁移
npm run migration:run

# 5. 创建管理员
npm run seed
```

### 日常开发命令

```bash
# 查看运行中的容器
docker ps

# 查看容器日志
docker logs medweb-postgres-dev
docker logs medweb-redis-dev

# 进入数据库容器
docker exec -it medweb-postgres-dev psql -U medweb -d medweb_db

# 查看数据库表
docker exec -it medweb-postgres-dev psql -U medweb -d medweb_db -c "\dt"

# 启动后端开发服务器（数据库初始化完成后）
npm run start:dev
```

---

## 📞 需要帮助？

完成上述步骤后，请告诉我：
- ✅ "数据库初始化成功" - 我将继续开发认证授权模块
- ❌ "遇到错误：[错误信息]" - 我将帮您排查问题

---

## 📚 相关文档

- [项目开发进度](./PROGRESS.md) - 查看详细开发进度
- [PRD文档](./PRD/PRD.md) - 产品需求文档
- [实施计划](../.claude/plans/ticklish-sleeping-anchor.md) - 完整实施计划
