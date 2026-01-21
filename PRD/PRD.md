## 技能必要性判断（设计/实施阶段）

- **frontend-design：必要**  
  需要将 MD 问卷结构化成可用的表单 UI（多题型、分组、校验、保存草稿、提交确认、移动端适配）。
- **web-artifacts-builder：必要**  
  目标是“把MD问卷做成网页并可多人使用”，需要能产出可运行的 Web 页面/组件/路由等交付物。
- **webapp-testing：必要**  
  涉及账号审核、权限、数据安全、表单正确性；必须具备回归测试与权限/接口测试能力，避免数据错填与越权。

---

# PRD｜《上海市级医院心脏骤停心肺复苏横断面调查研究》改良版CRF（Web版）

## 1. 项目概述
将 MD 格式 CRF 问卷转为可在线填写的 Web 数据采集系统（类似问卷星但“可登录、可审核、可追溯”），支持多人注册登录并登记病例；账号需管理员审核后启用，确保数据安全与研究合规。

## 2. 背景与目标
- **研究目标**：依据 2015/2024 OHCA Utstein 与 2019 IHCA Utstein 指南，规范采集横断面调查数据，达到国际临床研究数据质量与可追溯标准。
- **产品目标**：  
  1) 快速把 MD 问卷“结构化+可配置化”上线  
  2) 实现“注册-审核-登录-填报-导出/审计”的闭环  
  3) 满足最小合规：加密传输、权限控制、审计日志、数据备份

## 3. 角色与权限（RBAC）
- **访客**：仅可查看项目介绍/注册入口，不可查看问卷内容与数据。
- **申请用户（Pending）**：已提交注册申请，未审核；不可登录或仅可登录但不可访问数据采集（两种策略二选一，默认“不可登录”）。
- **研究填报用户（User）**：可创建/编辑自己提交的病例表单、提交、查看自己的历史记录。
- **管理员（Admin）**：审核用户申请；用户管理；问卷版本管理；查看/导出数据；查看审计日志；配置系统参数。

## 4. 核心功能（MVP必须）
1. **用户注册与登录**
   - 注册信息：账号（唯一）、密码（强度策略）、姓名/单位/科室/职位/联系方式（可配置必填）、用途说明（可选）、同意条款（必勾）。
   - 登录：账号+密码；登录态保持（JWT/Session）。
   - 密码找回：管理员重置或邮件重置（MVP建议管理员重置，降低外部依赖）。
2. **管理员审核**
   - 管理后台：注册申请列表（待审/通过/拒绝），查看申请详情，审批备注。
   - 审核结果通知：站内通知为MVP；邮件/短信为增强项。
3. **数据采集（CRF填写）**
   - 将 **MD 问卷**转为**可渲染的表单配置**（见第6节）。
   - 支持题型：单选、多选、下拉、日期/时间、数字、文本、长文本、分段标题、条件显示（跳题）、重复组（如多次事件记录，增强项）。
   - 表单能力：保存草稿、提交锁定（可配置是否允许提交后修改）、必填校验、范围校验（如年龄/时间间隔）、字段解释/提示。
   - 病例（Case）管理：列表、搜索（按创建时间/状态/关键字段）、查看详情。
4. **安全措施（MVP基线）**
   - 全站 HTTPS；密码哈希存储；最小权限；CSRF/XSS 基础防护。
   - 审计日志：登录、审批、数据提交/修改、导出行为留痕。
   - 备份与恢复：每日自动备份数据库（策略可配置）。

## 5. 非目标（本期不做，避免过度设计）
- 多中心复杂权限（中心管理员/PI分级）、电子签名、EMR对接、自动质控规则引擎（可做路线图）。
- 复杂统计分析看板（先保证数据采集准确与导出）。

## 6. 问卷（MD）到网页的转换方案（关键）
### 6.1 输入
- 一份 MD 文件（包含标题、分组、题目、选项、必填标记、提示语、可能的跳题逻辑）。
- **约定MD规范（必须制定）**：例如用 `## 分组`、`- [ ]` 表示选项、`(必填)` 标记、`{min,max}` 表示范围等。

### 6.2 中间格式（建议）
- 将 MD 解析为 JSON Schema/自定义 Form DSL（推荐自定义更直观），存入数据库并带版本号：`FormVersion`.
- 支持"问卷版本冻结"：已经用于数据采集的版本不可直接覆盖，只能新建版本。

### 6.3 表单 JSON Schema 示例
```json
{
  "formId": "crf-v1",
  "title": "心脏骤停心肺复苏调查研究 CRF",
  "version": "1.0.0",
  "sections": [
    {
      "id": "section_a",
      "title": "模块 A：患者基础信息",
      "fields": [
        {
          "id": "hospital_name",
          "type": "text",
          "label": "中心/医院名称",
          "required": true,
          "placeholder": "请输入医院名称"
        },
        {
          "id": "doctor_name",
          "type": "text",
          "label": "登记医师/研究者",
          "required": true
        },
        {
          "id": "admission_date",
          "type": "date",
          "label": "纳入日期",
          "required": true,
          "format": "YYYY-MM-DD"
        },
        {
          "id": "gender",
          "type": "radio",
          "label": "性别",
          "required": true,
          "options": [
            { "value": "male", "label": "男" },
            { "value": "female", "label": "女" }
          ]
        },
        {
          "id": "comorbidities",
          "type": "checkbox",
          "label": "既往史 (Comorbidities)",
          "options": [
            { "value": "none", "label": "无" },
            { "value": "cardiovascular", "label": "心血管疾病" },
            { "value": "respiratory", "label": "呼吸系统疾病" },
            { "value": "diabetes", "label": "内分泌代谢性疾病" }
          ]
        }
      ]
    },
    {
      "id": "section_b",
      "title": "模块 B：OHCA 专属数据域",
      "visibleWhen": {
        "field": "arrest_type",
        "operator": "equals",
        "value": "OHCA"
      },
      "fields": [
        {
          "id": "arrest_location",
          "type": "radio",
          "label": "心脏骤停发生地点",
          "required": true,
          "options": [
            { "value": "home", "label": "家中/居住地" },
            { "value": "public", "label": "公共场所" },
            { "value": "workplace", "label": "工作场所" }
          ]
        }
      ]
    }
  ]
}
```

### 6.4 渲染
- 前端根据表单 JSON 渲染组件（题型映射），统一校验与错误提示。
- 条件显示：JSON 中表达 `visibleWhen` / `enableWhen` 规则。

## 7. 数据库表结构详细设计

### 7.1 用户表 (users)
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    role VARCHAR(20) NOT NULL DEFAULT 'user',

    -- 个人信息
    full_name VARCHAR(100) NOT NULL,
    hospital VARCHAR(200),
    department VARCHAR(100),
    position VARCHAR(100),
    phone VARCHAR(20),
    email VARCHAR(100),
    purpose TEXT,

    -- 时间戳
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_login_at TIMESTAMP WITH TIME ZONE,

    -- 安全
    failed_login_attempts INT DEFAULT 0,
    locked_until TIMESTAMP WITH TIME ZONE,

    INDEX idx_username (username),
    INDEX idx_status (status)
);
```

### 7.2 审核申请表 (approval_requests)
```sql
CREATE TABLE approval_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    reviewed_at TIMESTAMP WITH TIME ZONE,
    reviewer_id UUID REFERENCES users(id),
    decision_note TEXT,

    INDEX idx_user_id (user_id),
    INDEX idx_status (status)
);
```

### 7.3 表单版本表 (form_versions)
```sql
CREATE TABLE form_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(200) NOT NULL,
    version VARCHAR(50) NOT NULL,
    description TEXT,
    schema_json JSONB NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'draft',
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    published_at TIMESTAMP WITH TIME ZONE,

    UNIQUE(name, version),
    INDEX idx_status (status)
);
```

### 7.4 病例表 (cases)
```sql
CREATE TABLE cases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    case_number VARCHAR(50) UNIQUE NOT NULL,
    created_by UUID NOT NULL REFERENCES users(id),
    form_version_id UUID NOT NULL REFERENCES form_versions(id),
    status VARCHAR(20) NOT NULL DEFAULT 'draft',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    submitted_at TIMESTAMP WITH TIME ZONE,

    -- 快速检索字段
    patient_hospital_number VARCHAR(100),
    patient_admission_date DATE,
    arrest_type VARCHAR(20),

    INDEX idx_created_by (created_by),
    INDEX idx_status (status),
    INDEX idx_case_number (case_number)
);
```

### 7.5 病例答案表 (case_answers)
```sql
CREATE TABLE case_answers (
    case_id UUID PRIMARY KEY REFERENCES cases(id) ON DELETE CASCADE,
    answers_json JSONB NOT NULL DEFAULT '{}',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_answers_gin (answers_json) USING GIN
);
```

### 7.6 审计日志表 (audit_logs)
```sql
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id UUID REFERENCES users(id),
    actor_username VARCHAR(50),
    action VARCHAR(100) NOT NULL,
    target_type VARCHAR(50),
    target_id UUID,
    meta_json JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_actor_id (actor_id),
    INDEX idx_action (action),
    INDEX idx_created_at (created_at)
);
```

## 8. 关键流程（用户旅程）
1) 访客注册提交 → 2) 管理员后台审核 → 3) 审核通过后用户可登录 →  
4) 选择“新建病例” → 5) 在线填写CRF（草稿/校验） → 6) 提交 → 7) 用户可查看自己提交记录（管理员可导出/审计）

## 9. 页面/模块清单（信息架构）
- 公共：
  - 首页（项目简介、伦理/隐私声明入口）
  - 注册页、登录页
- 用户端：
  - Dashboard：我的病例（草稿/已提交）
  - 新建病例/编辑病例（动态表单）
  - 病例详情（只读/可编辑取决于状态）
- 管理端：
  - 审核中心（申请列表、详情、通过/拒绝）
  - 用户管理（启用/停用/重置密码）
  - 问卷管理（上传MD/预览/发布版本/归档）
  - 数据导出（按时间/版本/状态筛选）
  - 审计日志

## 10. 安全与合规要求（必须明确）
- 传输：强制 HTTPS（TLS）。
- 存储：密码使用强哈希（bcrypt/argon2）；敏感字段（如电话）可选加密列。
- 权限：RBAC；对象级权限（用户只能访问自己创建的 Case）。
- 防护：限流、登录失败锁定/验证码（增强项）、输入消毒、防注入。
- 审计：关键操作全记录；导出行为必须记录。
- 数据留存：可配置保留周期；备份加密；最小可见性原则。

## 11. 技术架构详细设计

### 11.1 前端技术栈
- **核心框架**: React 18 + TypeScript 5.0+
- **构建工具**: Vite 5.0+ (快速开发体验)
- **路由管理**: React Router v6
- **表单处理**: React Hook Form 7.x + Zod (类型安全的表单验证)
- **状态管理**:
  - TanStack Query v5 (服务端状态管理、缓存)
  - Zustand (轻量级全局状态，用于认证)
- **UI组件库**: Tailwind CSS 3.x + shadcn/ui (基于 Radix UI)
- **HTTP客户端**: Axios
- **日期处理**: date-fns
- **平台**: Web（PC优先，响应式设计兼容移动端）

**选择理由**:
- TypeScript 提供强类型检查，减少医疗数据录入错误
- React Hook Form 性能优异，支持复杂表单验证
- TanStack Query 自动处理缓存、重试，适合医疗数据场景
- shadcn/ui 无障碍访问性好，可定制性强

### 11.2 后端技术栈
- **核心框架**: NestJS 10.x (Node.js + TypeScript)
- **ORM**: TypeORM 0.3.x
- **数据库**: PostgreSQL 15+
- **缓存**: Redis 7.x (会话存储、限流)
- **认证**: Passport.js + JWT
- **验证**: class-validator + class-transformer
- **密码加密**: bcrypt
- **安全**: helmet (安全头部) + rate-limiter-flexible
- **日志**: winston
- **定时任务**: node-cron (用于自动备份)

**选择理由**:
- NestJS 企业级架构，内置依赖注入、模块化设计
- TypeScript 前后端统一语言，类型共享
- 装饰器语法清晰，便于权限控制和参数验证

### 11.3 数据库设计
- **主数据库**: PostgreSQL 15+
  - ACID 事务保证医疗数据一致性
  - JSONB 支持灵活存储表单答案
  - 行级安全 (RLS) 增强数据隔离
  - 触发器支持自动审计
- **缓存层**: Redis
  - JWT 黑名单
  - 会话存储
  - 限流计数器
  - 临时数据缓存

### 11.4 部署架构
- **容器化**: Docker + Docker Compose
- **反向代理**: Nginx (SSL终止 + 静态文件服务)
- **架构图**:
```
[用户] → HTTPS → [Nginx] → [前端容器 (React SPA)]
                           ↓ API请求
                    [后端容器 (NestJS)] ↔ [Redis]
                           ↓
                    [PostgreSQL]
```

### 11.5 安全措施
- **传输**: 强制 HTTPS (TLS 1.3)
- **认证**: JWT + Refresh Token 机制
- **密码**: bcrypt 哈希 (cost factor 12)
- **防护**:
  - CSRF Token
  - XSS 防护 (输入消毒、CSP)
  - SQL 注入防护 (ORM 参数化查询)
  - 限流 (登录: 5次/分钟，API: 100次/分钟)
  - 登录失败锁定 (5次失败锁定30分钟)
- **审计**: 所有关键操作记录到 audit_logs 表

### 11.6 备份策略
- **数据库**: 每日全量备份 + WAL 归档
- **保留周期**: 30天
- **恢复演练**: 每季度一次
- **存储**: 加密后存储到对象存储 (OSS/S3)

## 11.7 项目结构设计

### 前端项目结构
```
medweb-frontend/
├── src/
│   ├── components/          # 通用组件
│   │   ├── ui/             # shadcn/ui 基础组件
│   │   ├── layout/         # 布局组件 (Header, Sidebar, Footer)
│   │   └── form/           # 表单组件
│   │       ├── FormRenderer.tsx      # 动态表单渲染器（核心）
│   │       └── fields/               # 各类字段组件
│   ├── features/           # 功能模块
│   │   ├── auth/          # 认证模块
│   │   ├── cases/         # 病例管理
│   │   ├── admin/         # 管理员功能
│   │   └── dashboard/     # 仪表盘
│   ├── pages/             # 页面组件
│   ├── lib/               # 工具库 (API客户端、工具函数)
│   ├── store/             # 全局状态 (Zustand)
│   ├── types/             # TypeScript 类型定义
│   └── router/            # 路由配置
```

### 后端项目结构
```
medweb-backend/
├── src/
│   ├── common/            # 通用模块
│   │   ├── decorators/   # 自定义装饰器 (@Roles, @AuditLog)
│   │   ├── guards/       # 守卫 (JWT, Roles, Throttle)
│   │   └── filters/      # 异常过滤器
│   ├── modules/          # 业务模块
│   │   ├── auth/        # 认证模块
│   │   ├── users/       # 用户管理
│   │   ├── approvals/   # 审核管理
│   │   ├── cases/       # 病例管理
│   │   ├── forms/       # 表单版本管理
│   │   ├── audit/       # 审计日志
│   │   └── export/      # 数据导出
│   └── database/        # 数据库迁移和种子数据
```

## 11.8 API 设计规范

### 认证相关
- `POST /api/auth/register` - 用户注册
- `POST /api/auth/login` - 用户登录
- `POST /api/auth/logout` - 用户登出
- `POST /api/auth/refresh` - 刷新token
- `GET /api/auth/me` - 获取当前用户信息

### 用户管理
- `GET /api/users` - 获取用户列表（管理员）
- `GET /api/users/:id` - 获取用户详情
- `PATCH /api/users/:id` - 更新用户信息
- `POST /api/users/:id/reset-password` - 重置密码（管理员）

### 审核管理
- `GET /api/approvals` - 获取审核列表（管理员）
- `POST /api/approvals/:id/approve` - 批准申请
- `POST /api/approvals/:id/reject` - 拒绝申请

### 病例管理
- `GET /api/cases` - 获取病例列表
- `POST /api/cases` - 创建病例
- `GET /api/cases/:id` - 获取病例详情
- `PATCH /api/cases/:id` - 更新病例（草稿状态）
- `POST /api/cases/:id/submit` - 提交病例
- `DELETE /api/cases/:id` - 删除病例（草稿状态）

### 表单版本管理
- `GET /api/forms` - 获取表单版本列表
- `POST /api/forms` - 创建表单版本（管理员）
- `POST /api/forms/:id/publish` - 发布表单版本（管理员）
- `POST /api/forms/parse-markdown` - 解析MD文件为表单配置

### 数据导出
- `POST /api/export/cases` - 导出病例数据（管理员）
- `GET /api/export/download/:id` - 下载导出文件

### 审计日志
- `GET /api/audit-logs` - 获取审计日志（管理员）

## 12. 可观测性与运维
- 日志：应用日志、审计日志分离；错误报警（Sentry 可选）。
- 备份：自动化脚本；定期恢复演练（最低季度一次）。
- 安全审计：依赖库漏洞扫描（CI里做）、权限回归测试。

## 13. 验收标准（可测试）
- 注册后账号默认为 Pending，**未审核无法进入问卷**。
- 管理员可在后台通过/拒绝申请；通过后用户可登录并创建病例。
- 用户仅能查看/编辑自己创建的病例；管理员可查看全部。
- 动态表单支持：单选/多选/文本/数字/日期；必填与范围校验生效；草稿保存与提交锁定生效。
- 全站 HTTPS；数据库不存明文密码；审计日志能追踪：登录、审核、提交、导出。
- 可按条件导出数据（CSV/Excel，增强项）且导出行为记入审计日志。

## 14. 开发步骤规划（MVP阶段）

### 阶段 1: 项目初始化（第1天）
**目标**: 搭建前后端基础框架

**前端任务**:
1. 使用 Vite 创建 React + TypeScript 项目
2. 配置 Tailwind CSS 和 shadcn/ui
3. 安装依赖: React Router, React Hook Form, Zod, TanStack Query, Zustand, Axios
4. 创建基础目录结构
5. 配置环境变量 (.env)

**后端任务**:
1. 使用 NestJS CLI 创建项目
2. 配置 TypeORM + PostgreSQL
3. 配置 Redis 连接
4. 安装依赖: Passport, JWT, bcrypt, class-validator, helmet
5. 创建基础模块结构
6. 配置环境变量

**数据库任务**:
1. 创建 PostgreSQL 数据库
2. 创建初始迁移文件（用户表、审核表）
3. 运行迁移

### 阶段 2: 用户认证系统（第2-3天）
**目标**: 实现注册、登录、JWT认证

**后端实现**:
1. 创建 User 实体和 ApprovalRequest 实体
2. 实现 AuthService (注册、登录、JWT生成)
3. 实现 JWT Strategy 和 Guards
4. 创建 Auth Controller (注册、登录、登出、刷新token)
5. 添加密码加密 (bcrypt)
6. 实现审计日志记录

**前端实现**:
1. 创建 authStore (Zustand)
2. 实现 API 客户端配置 (Axios + 拦截器)
3. 创建注册页面和表单
4. 创建登录页面和表单
5. 实现 ProtectedRoute 组件
6. 实现自动token刷新

**关键文件**:
- 后端: `src/modules/auth/`, `src/modules/users/`
- 前端: `src/features/auth/`, `src/store/authStore.ts`

### 阶段 3: 管理员审核系统（第4天）
**目标**: 实现用户申请审核功能

**后端实现**:
1. 创建 ApprovalsService
2. 实现审核列表查询（分页、筛选）
3. 实现批准/拒绝接口
4. 添加 @Roles 装饰器和 RolesGuard
5. 记录审核操作到审计日志

**前端实现**:
1. 创建管理员布局和路由
2. 实现审核列表页面
3. 实现审核详情对话框
4. 实现批准/拒绝操作
5. 添加实时刷新（TanStack Query）

**关键文件**:
- 后端: `src/modules/approvals/`
- 前端: `src/features/admin/`, `src/pages/admin/ApprovalPage.tsx`

### 阶段 4: 表单配置系统（第5-6天）
**目标**: 将问卷MD转为JSON配置，实现表单版本管理

**后端实现**:
1. 创建 FormVersion 实体
2. 实现 MD 解析器 (MarkdownParserService)
3. 定义表单 JSON Schema 格式
4. 实现表单版本 CRUD
5. 实现表单发布功能

**前端实现**:
1. 创建表单管理页面（管理员）
2. 实现 MD 文件上传
3. 实现表单预览功能
4. 实现版本列表和切换

**MD 解析规则**:
- `## 标题` → 分组
- `1. 问题` → 字段
- `□ 选项` → 单选/多选选项
- `[填空]` → 文本输入
- `[YYYY-MM-DD]` → 日期选择
- `(必填)` → 必填标记

**关键文件**:
- 后端: `src/modules/forms/`, `src/modules/forms/parsers/markdown-parser.service.ts`
- 前端: `src/features/admin/components/FormVersionManager.tsx`

### 阶段 5: 动态表单渲染器（第7-8天）
**目标**: 实现核心的动态表单渲染引擎

**前端实现**:
1. 创建 FormRenderer 组件（核心）
2. 实现各类字段组件:
   - TextField (文本输入)
   - NumberField (数字输入)
   - DateField (日期选择)
   - TimeField (时间选择)
   - RadioField (单选)
   - CheckboxField (多选)
   - SelectField (下拉选择)
   - TextareaField (长文本)
3. 实现字段验证（Zod schema 动态生成）
4. 实现条件显示逻辑
5. 实现表单分组和导航

**关键文件**:
- 前端: `src/components/form/FormRenderer.tsx`, `src/components/form/fields/`

### 阶段 6: 病例管理系统（第9-10天）
**目标**: 实现病例创建、编辑、提交功能

**后端实现**:
1. 创建 Case 和 CaseAnswer 实体
2. 实现 CasesService (CRUD)
3. 实现草稿保存和提交逻辑
4. 添加权限控制（用户只能访问自己的病例）
5. 实现病例列表查询（分页、筛选）

**前端实现**:
1. 创建 Dashboard 页面（病例列表）
2. 实现新建病例页面（使用 FormRenderer）
3. 实现编辑病例页面
4. 实现病例详情页面（只读模式）
5. 实现草稿自动保存（防抖）
6. 实现提交确认对话框

**关键文件**:
- 后端: `src/modules/cases/`
- 前端: `src/features/cases/`, `src/pages/CasesPage.tsx`, `src/pages/NewCasePage.tsx`

### 阶段 7: 数据导出和审计（第11天）
**目标**: 实现数据导出和审计日志查看

**后端实现**:
1. 创建 ExportService
2. 实现病例数据导出（CSV/Excel）
3. 实现审计日志查询接口
4. 添加导出操作审计

**前端实现**:
1. 创建数据导出页面
2. 实现筛选条件（时间范围、状态）
3. 实现导出下载
4. 创建审计日志查看页面

**关键文件**:
- 后端: `src/modules/export/`, `src/modules/audit/`
- 前端: `src/pages/admin/DataExportPage.tsx`, `src/pages/admin/AuditLogPage.tsx`

### 阶段 8: 安全加固和测试（第12-14天）
**目标**: 完善安全措施，进行测试

**安全任务**:
1. 配置 HTTPS (Nginx)
2. 实现限流（登录、API）
3. 添加 CSRF 防护
4. 实现登录失败锁定
5. 配置 CSP 头部
6. 敏感数据脱敏

**测试任务**:
1. 编写单元测试（关键服务）
2. 编写 E2E 测试（核心流程）
3. 权限测试（越权访问）
4. 表单验证测试
5. 性能测试

**部署任务**:
1. 编写 Dockerfile
2. 编写 docker-compose.yml
3. 配置 Nginx
4. 配置数据库备份脚本
5. 部署到测试环境

## 15. 里程碑总结

### MVP 阶段（2周）
- ✅ 用户注册/审核/登录系统
- ✅ 动态表单渲染引擎
- ✅ 病例创建/编辑/提交
- ✅ 基础审计日志
- ✅ 数据导出功能
- ✅ 安全措施（HTTPS、JWT、限流）

### P1 增强阶段（2-4周，可选）
- 📋 MD 在线编辑和实时预览
- 📋 条件显示/跳题逻辑
- 📋 重复组（多次事件记录）
- 📋 邮件/短信通知
- 📋 数据统计看板
- 📋 高级导出（自定义字段）
- 📋 二次验证（2FA）

