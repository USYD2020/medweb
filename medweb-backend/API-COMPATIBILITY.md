# 前后端 API 兼容性说明

## ✅ 已完成的兼容性修复

### 1. 登录接口响应格式

**后端返回格式**：
```json
{
  "accessToken": "eyJhbGci...",
  "refreshToken": "eyJhbGci...",
  "expiresIn": 900,
  "user": {
    "id": "uuid",
    "username": "admin",
    "fullName": "系统管理员",
    "role": "admin"
  }
}
```

**前端接口定义**（已修复）：
```typescript
export interface LoginResponse {
  accessToken: string;      // ✅ 已修复为驼峰命名
  refreshToken: string;     // ✅ 新增字段
  expiresIn: number;        // ✅ 新增字段
  user: {
    id: string;
    username: string;
    fullName: string;
    role: 'user' | 'admin';
  };
}
```

**修改的文件**：
- ✅ `frontend/src/lib/api/auth.ts` - 更新接口定义
- ✅ `frontend/src/pages/LoginPage.tsx` - 更新使用方式

---

## 📋 API 接口清单

### 认证接口

#### 1. POST /auth/register - 用户注册
**请求体**：
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

**响应**：
```json
{
  "message": "注册成功，请等待管理员审核",
  "userId": "uuid"
}
```

#### 2. POST /auth/login - 用户登录
**请求体**：
```json
{
  "username": "admin",
  "password": "Admin@123456"
}
```

**响应**：
```json
{
  "accessToken": "eyJhbGci...",
  "refreshToken": "eyJhbGci...",
  "expiresIn": 900,
  "user": {
    "id": "uuid",
    "username": "admin",
    "fullName": "系统管理员",
    "role": "admin"
  }
}
```

---

### 审核接口（需要管理员权限）

#### 3. GET /approvals - 获取审核列表
**请求头**：
```
Authorization: Bearer {accessToken}
```

**查询参数**：
- `page`: 页码（默认1）
- `limit`: 每页数量（默认10）
- `status`: 审核状态（pending/approved/rejected）

**响应**：
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

#### 4. POST /approvals/:id/approve - 批准审核
**请求头**：
```
Authorization: Bearer {accessToken}
```

**请求体**：
```json
{
  "note": "审核通过"
}
```

**响应**：
```json
{
  "message": "审核通过"
}
```

#### 5. POST /approvals/:id/reject - 拒绝审核
**请求头**：
```
Authorization: Bearer {accessToken}
```

**请求体**：
```json
{
  "note": "信息不完整，请重新提交"
}
```

**响应**：
```json
{
  "message": "审核拒绝"
}
```

---

## 🔐 认证机制

### JWT Token 使用

1. **accessToken**：
   - 有效期：15分钟
   - 用途：API 请求认证
   - 存储位置：localStorage（键名：`access_token`）

2. **refreshToken**：
   - 有效期：7天
   - 用途：刷新 accessToken（待实现）
   - 存储位置：localStorage（键名：`refresh_token`）

### 请求头格式

所有需要认证的接口都需要在请求头中携带 JWT token：

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## ⚠️ 常见问题

### 1. 503 Service Unavailable 错误

**原因**：系统配置了 HTTP 代理，导致本地请求被代理拦截。

**解决方法**：
- **curl**：添加 `--noproxy localhost` 参数
- **Postman**：Settings → Proxy → 取消勾选 "Use system proxy"
- **前端开发**：配置 Vite 代理或在 `.env.development` 中设置正确的 API 地址

### 2. 401 Unauthorized 错误

**可能原因**：
- Token 已过期（15分钟后）
- Token 格式错误
- 用户状态不是 `approved`
- 未在请求头中携带 token

**解决方法**：
- 检查 token 是否正确
- 重新登录获取新 token
- 确认用户已通过审核

### 3. 403 Forbidden 错误

**原因**：用户角色权限不足（如普通用户访问管理员接口）

**解决方法**：
- 确认当前用户角色
- 使用管理员账号登录

---

## 📝 待实现功能

### 1. Token 刷新接口
```typescript
POST /auth/refresh
{
  "refreshToken": "eyJhbGci..."
}
```

### 2. 获取当前用户信息
```typescript
GET /auth/me
Authorization: Bearer {accessToken}
```

### 3. 用户登出
```typescript
POST /auth/logout
Authorization: Bearer {accessToken}
```

---

## 🎯 测试状态

| 接口 | 状态 | 测试时间 |
|------|------|----------|
| POST /auth/register | ✅ 通过 | 2026-01-19 |
| POST /auth/login | ✅ 通过 | 2026-01-19 |
| GET /approvals | ✅ 通过 | 2026-01-19 |
| POST /approvals/:id/approve | ✅ 通过 | 2026-01-19 |
| POST /approvals/:id/reject | ⏳ 待测试 | - |

---

## 📚 相关文档

- [API 测试指南](./API-TEST.md)
- [开发进度](./PROGRESS.md)
- [PRD 文档](../PRD/PRD.md)
