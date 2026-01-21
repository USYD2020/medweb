# 后端 API 测试指南

## 🎉 第2-4天开发完成总结

### ✅ 已完成的模块

1. **用户模块（UsersModule）**
   - UsersService - 用户增删改查、登录失败锁定
   - User Entity - 用户实体（包含审核状态、角色、登录记录）

2. **认证模块（AuthModule）**
   - AuthService - 注册、登录、JWT生成
   - JWT Strategy - JWT令牌验证
   - Local Strategy - 本地用户名密码验证
   - AuthController - 认证接口

3. **审核模块（ApprovalsModule）**
   - ApprovalsService - 审核业务逻辑
   - ApprovalsController - 审核管理接口
   - ApprovalRequest Entity - 审核申请实体

### 🚀 服务器状态

- **服务器地址**: http://localhost:3000
- **状态**: ✅ 运行中
- **数据库**: ✅ PostgreSQL 已连接
- **Redis**: ✅ 已配置（待使用）

---

## 📡 API 接口列表

### 1. 用户注册

**接口**: `POST /auth/register`

**请求体**:
```json
{
  "username": "testuser",
  "password": "Test@123456",
  "fullName": "测试用户",
  "hospital": "测试医院",
  "department": "测试科室",
  "position": "医生",
  "phone": "13800138000",
  "email": "test@example.com",
  "purpose": "用于临床研究数据采集"
}
```

**响应**:
```json
{
  "message": "注册成功，请等待管理员审核",
  "userId": "uuid"
}
```

**说明**:
- 密码要求：至少8位，包含大小写字母和数字
- 注册后状态为 `pending`，需要管理员审核
- 自动创建审核申请记录

---

### 2. 用户登录

**接口**: `POST /auth/login`

**请求体**:
```json
{
  "username": "admin",
  "password": "Admin@123456"
}
```

**响应**:
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 900,
  "user": {
    "id": "uuid",
    "username": "admin",
    "fullName": "系统管理员",
    "role": "admin"
  }
}
```

**说明**:
- 只有审核通过（status = 'approved'）的用户才能登录
- 密码错误5次后账号锁定30分钟
- accessToken 有效期15分钟
- refreshToken 有效期7天

---

### 3. 获取审核列表（需要管理员权限）

**接口**: `GET /approvals?page=1&limit=10&status=pending`

**请求头**:
```
Authorization: Bearer {accessToken}
```

**查询参数**:
- `page`: 页码（默认1）
- `limit`: 每页数量（默认10）
- `status`: 审核状态（pending/approved/rejected）

**响应**:
```json
{
  "items": [
    {
      "id": "uuid",
      "userId": "uuid",
      "status": "pending",
      "submittedAt": "2026-01-19T02:09:29.000Z",
      "user": {
        "username": "testuser",
        "fullName": "测试用户",
        "hospital": "测试医院",
        "department": "测试科室"
      }
    }
  ],
  "total": 1,
  "page": 1,
  "limit": 10,
  "totalPages": 1
}
```

---

### 4. 批准审核申请（需要管理员权限）

**接口**: `POST /approvals/:id/approve`

**请求头**:
```
Authorization: Bearer {accessToken}
```

**请求体**:
```json
{
  "note": "审核通过"
}
```

**响应**:
```json
{
  "message": "审核通过"
}
```

**说明**:
- 审核通过后，用户状态变为 `approved`
- 用户可以正常登录

---

### 5. 拒绝审核申请（需要管理员权限）

**接口**: `POST /approvals/:id/reject`

**请求头**:
```
Authorization: Bearer {accessToken}
```

**请求体**:
```json
{
  "note": "信息不完整，请重新提交"
}
```

**响应**:
```json
{
  "message": "审核拒绝"
}
```

**说明**:
- 拒绝时必须填写原因（note字段）
- 用户状态变为 `rejected`
- 用户无法登录

---

## 🧪 测试流程

### ⚠️ 重要提示

**如果遇到 503 Service Unavailable 错误**：

系统可能配置了 HTTP 代理，导致本地请求被代理拦截。解决方法：

1. **curl 命令**：添加 `--noproxy localhost` 参数
   ```bash
   curl --noproxy localhost -X POST http://localhost:3000/auth/login ...
   ```

2. **Postman**：在设置中关闭代理
   - Settings → Proxy → 取消勾选 "Use system proxy"

3. **浏览器/前端**：配置代理绕过本地地址

### 测试工具推荐
- **Postman** - 图形化API测试工具
- **curl** - 命令行测试工具
- **REST Client** - VS Code 插件

### 完整测试流程

#### 步骤1：管理员登录
```bash
curl --noproxy localhost -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "Admin@123456"
  }'
```

保存返回的 `accessToken`。

#### 步骤2：注册新用户
```bash
curl --noproxy localhost -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "doctor01",
    "password": "Doctor@123",
    "fullName": "张医生",
    "hospital": "上海市第一人民医院",
    "department": "急诊科",
    "position": "主治医师"
  }'
```

#### 步骤3：查看审核列表
```bash
curl --noproxy localhost -X GET "http://localhost:3000/approvals?status=pending" \
  -H "Authorization: Bearer {accessToken}"
```

#### 步骤4：批准审核
```bash
curl --noproxy localhost -X POST http://localhost:3000/approvals/{审核ID}/approve \
  -H "Authorization: Bearer {accessToken}" \
  -H "Content-Type: application/json" \
  -d '{
    "note": "审核通过"
  }'
```

#### 步骤5：新用户登录
```bash
curl --noproxy localhost -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "doctor01",
    "password": "Doctor@123"
  }'
```

---

## 🔒 安全特性

### 已实现的安全措施

1. **密码安全**
   - ✅ bcrypt 加密（cost factor 12）
   - ✅ 密码强度验证（至少8位，包含大小写字母和数字）
   - ✅ 登录失败锁定（5次失败锁定30分钟）

2. **JWT 认证**
   - ✅ 全局 JWT 守卫（默认所有接口需要认证）
   - ✅ @Public() 装饰器标记公开接口
   - ✅ accessToken 15分钟过期
   - ✅ refreshToken 7天过期

3. **权限控制**
   - ✅ 角色守卫（RolesGuard）
   - ✅ @Roles() 装饰器控制接口权限
   - ✅ 管理员专属接口（审核管理）

4. **审核机制**
   - ✅ 注册后默认 pending 状态
   - ✅ 未审核用户无法登录
   - ✅ 审核记录可追溯

---

## 📊 数据库状态

### 当前数据

- **管理员账号**: 1个
  - 用户名: `admin`
  - 密码: `Admin@123456`
  - 角色: `admin`
  - 状态: `approved`

### 数据库表

- ✅ users（用户表）
- ✅ approval_requests（审核申请表）
- ✅ form_versions（表单版本表）
- ✅ cases（病例表）
- ✅ case_answers（病例答案表）
- ✅ audit_logs（审计日志表）

---

## 🎯 下一步计划

### 第5-7天：表单配置模块

**待开发内容**:
1. Markdown 解析器（MD → JSON Schema）
2. 表单版本管理（CRUD）
3. 表单发布功能
4. 表单预览接口

### 第8-10天：病例管理模块

**待开发内容**:
1. 病例创建/编辑/提交
2. 病例列表查询
3. 草稿自动保存
4. 权限控制（用户只能访问自己的病例）

---

## 💡 提示

1. **测试前确保**:
   - ✅ Docker 容器运行中
   - ✅ 数据库已初始化
   - ✅ 开发服务器已启动（http://localhost:3000）

2. **常见问题**:
   - 401 Unauthorized: 检查 token 是否正确
   - 403 Forbidden: 检查用户角色权限
   - 密码错误: 确认密码符合强度要求

3. **开发服务器**:
   - 自动重启（文件修改后）
   - 热重载已启用
   - 日志输出到终端
