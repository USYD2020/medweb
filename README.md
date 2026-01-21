# MedWeb - 心脏骤停调查系统

上海市级医院心脏骤停心肺复苏横断面调查研究的全栈数据采集平台。

## 项目简介

本项目是一个基于现代 Web 技术构建的医疗数据采集系统，用于收集和管理心脏骤停患者的临床数据。系统遵循 Utstein 指南标准，支持 OHCA（院外心脏骤停）和 IHCA（院内心脏骤停）两种类型的病例数据采集。

## 技术栈

### 前端
- **框架**: React 19 + TypeScript
- **构建工具**: Vite
- **UI 框架**: Tailwind CSS
- **状态管理**: Zustand
- **路由**: React Router v7
- **表单管理**: React Hook Form + Zod
- **数据请求**: Axios + TanStack React Query

### 后端
- **框架**: NestJS + TypeScript
- **数据库**: PostgreSQL + TypeORM
- **认证**: JWT + Passport
- **安全**: Helmet + Throttler（限流）
- **日志**: Winston
- **缓存**: Redis

## 项目结构

```
MedWeb/
├── frontend/              # React 前端应用
│   ├── src/
│   │   ├── components/   # 组件
│   │   ├── pages/        # 页面
│   │   ├── lib/          # 工具库
│   │   └── data/         # 数据文件
│   └── package.json
├── medweb-backend/        # NestJS 后端应用
│   ├── src/
│   │   ├── modules/      # 功能模块
│   │   ├── common/       # 公共代码
│   │   └── database/     # 数据库相关
│   └── package.json
└── README.md
```

## 功能特性

### 表单系统
- **多步骤表单**: 支持分步填写，自动保存草稿
- **条件显示**: 根据 OHCA/IHCA 类型动态显示相关模块
- **实时验证**: 自动检测必填项并提供友好提示
- **数据持久化**: 支持草稿保存和恢复

### 模块结构
- **模块 A**: 患者基础信息（通用）
- **模块 B**: OHCA 专属数据（院外）
- **模块 C**: IHCA 专属数据（院内）
- **模块 D**: 复苏过程（通用）
- **模块 E**: 预后与结局（通用）

### 用户功能
- 用户注册和登录
- 病例创建和编辑
- 病例列表和详情查看
- 草稿自动保存

## 快速开始

### 前置要求
- Node.js >= 18
- PostgreSQL >= 14
- Redis >= 6

### 安装依赖

```bash
# 安装前端依赖
cd frontend
npm install

# 安装后端依赖
cd ../medweb-backend
npm install
```

### 配置环境变量

#### 前端配置 (`frontend/.env.development`)
```env
VITE_API_BASE_URL=http://localhost:3001
```

#### 后端配置 (`medweb-backend/.env.development`)
```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_DATABASE=medweb

JWT_SECRET=your_jwt_secret
JWT_EXPIRATION=7d

REDIS_HOST=localhost
REDIS_PORT=6379
```

### 启动服务

```bash
# 启动后端（终端1）
cd medweb-backend
npm run start:dev

# 启动前端（终端2）
cd frontend
npm run dev
```

访问 http://localhost:5173 查看前端页面。

## 开发指南

### 数据库初始化

```bash
cd medweb-backend
npm run migration:run
npm run seed:run
```

### API 文档

后端 API 文档请参考 `medweb-backend/` 目录下的相关文档文件。

### 代码规范

- 使用 ESLint 进行代码检查
- 遵循 TypeScript 严格模式
- 组件命名使用 PascalCase
- 文件命名使用 kebab-case

## 待办事项

请参考 [todo.md](./todo.md) 查看当前的开发计划。

## 已知问题

请参考 [tocorrect.md](./tocorrect.md) 查看已知问题列表。

## 许可证

本项目为内部研究项目，未经授权不得用于商业用途。

## 联系方式

如有问题或建议，请联系项目维护者。

---

**注意**: 本系统采集的数据为敏感医疗信息，请确保在生产环境中正确配置安全措施。
