# MedWeb 项目技能使用指南

> 本文档说明如何使用 MedWeb 项目中保留的 4 个核心技能

在设计和实施阶段，请判断以下技能的必要性：
- frontend-design
- web-artifacts-builder
- webapp-testing
- vercel-agent-skills

## 📋 技能概览

| 技能名称 | 主要用途 | 技术栈 | 优先级 |
|---------|---------|--------|--------|
| [frontend-design](#-1-frontend-design) | 创建高质量前端界面 | HTML/CSS/JS/React/Vue | ⭐⭐⭐⭐⭐ |
| [web-artifacts-builder](#-2-web-artifacts-builder) | 构建复杂 React 应用 | React 18/TS/Vite/Parcel/Tailwind | ⭐⭐⭐⭐⭐ |
| [webapp-testing](#-3-webapp-testing) | 自动化测试 Web 应用 | Playwright/Python | ⭐⭐⭐⭐⭐ |
| [vercel-agent-skills](#-4-vercel-agent-skills) | 性能优化与最佳实践 | 文档/参考指南 | ⭐⭐⭐⭐ |

### 验证状态

✅ 所有技能文件已验证可访问：
- [frontend-design/SKILL.md](frontend-design/SKILL.md)
- [web-artifacts-builder/SKILL.md](web-artifacts-builder/SKILL.md)
- [webapp-testing/SKILL.md](webapp-testing/SKILL.md)
- [vercel-agent-skills/AGENTS.md](vercel-agent-skills/AGENTS.md)

---

## 🎨 1. frontend-design

### 核心功能

创建独特、生产级别的前端界面，避免"AI 生成感"的通用设计。提供专业的设计指导，帮助构建具有特色美学的界面。

### 适用场景

- 构建医学表单界面（问卷展示、条件跳题）
- 设计管理员审核界面
- 创建数据展示与导出界面
- 实现响应式布局设计

### 设计原则

#### 1. 设计思考阶段
在编码前，明确以下要素：
- **目的**：解决什么问题？谁使用？
- **语调**：选择极端方向（极简、混乱、复古未来、有机、奢华、俏皮、编辑、粗野、装饰艺术等）
- **约束**：技术要求、框架、性能、可访问性
- **差异化**：什么是难忘的？

#### 2. 前端美学指南

**排版**
- 选择独特、有特色的字体
- 避免 Arial、Inter 等通用字体
- 配对显示字体和正文字体

**色彩主题**
- 提交一致的美学
- 使用 CSS 变量
- 主色配合锐利的强调色优于均匀分布的调色板

**动画**
- CSS 优先
- React 使用 Motion 库
- 关注高影响时刻（页面加载、交错显示）
- 滚动触发和悬停状态

**空间构成**
- 意外的布局、不对称、重叠
- 对角线流、打破网格
- 慷慨的负空间或受控密度

**背景和视觉细节**
- 创建氛围和深度
- 渐变网格、噪声纹理、几何图案
- 分层透明度、戏剧性阴影、装饰边框

### 使用示例

**场景：构建医疗预约界面**

```markdown
用户请求："构建一个医疗预约界面"

技能响应：
1. 选择美学方向：现代医疗 + 极简主义
2. 实现特色：
   - 字体：Poppins（标题）+ Source Sans Pro（正文）
   - 配色：医疗蓝 (#0066CC) + 清新绿 (#00CC66)
   - 动画：平滑的页面过渡 + 表单字段聚焦效果
   - 布局：卡片式设计 + 不对称网格
```

### 避免的设计模式

❌ 过度居中的布局
❌ 紫色渐变
❌ 统一的圆角
❌ Inter 字体
❌ 通用的"AI 风格"美学

### 配置文件位置

- 主配置：[frontend-design/SKILL.md](frontend-design/SKILL.md)

---

## 🔧 2. web-artifacts-builder

### 核心功能

用于创建复杂的多组件 React 应用的工具套件。支持需要状态管理、路由或 shadcn/ui 组件的复杂工件。

### 技术栈

- React 18 + TypeScript
- Vite（开发）
- Parcel（打包）
- Tailwind CSS 3.4.1
- shadcn/ui（40+ 预装组件）
- Radix UI 依赖

### 使用流程

#### 步骤 1：初始化项目

```bash
bash scripts/init-artifact.sh <project-name>
cd <project-name>
```

**自动创建的内容：**
- ✅ React + TypeScript（通过 Vite）
- ✅ Tailwind CSS 3.4.1 + shadcn/ui 主题系统
- ✅ 路径别名配置（`@/`）
- ✅ 40+ shadcn/ui 组件预装
- ✅ 所有 Radix UI 依赖
- ✅ Parcel 打包配置（`.parcelrc`）
- ✅ Node 18+ 兼容性

#### 步骤 2：开发工件

编辑生成的代码文件，使用预装的 shadcn/ui 组件。

#### 步骤 3：打包为单个 HTML 文件

```bash
bash scripts/bundle-artifact.sh
```

**打包脚本功能：**
- 安装打包依赖（parcel、@parcel/config-default、parcel-resolver-tspaths、html-inline）
- 创建 `.parcelrc` 配置（支持路径别名）
- 使用 Parcel 构建（无源映射）
- 使用 html-inline 将所有资源内联到单个 HTML

#### 步骤 4：分享工件

将 `bundle.html` 作为 Claude 工件分享。

### 实际使用示例

**场景：创建医疗数据仪表板**

```bash
# 1. 初始化项目
bash web-artifacts-builder/scripts/init-artifact.sh medical-dashboard
cd medical-dashboard

# 2. 开发（编辑 src/App.tsx）
# - 使用 shadcn/ui 的 Card、Table、Chart 组件
# - 实现数据可视化
# - 添加响应式布局

# 3. 打包
bash ../web-artifacts-builder/scripts/bundle-artifact.sh

# 4. 结果：bundle.html（可直接在 Claude 中使用）
```

### 设计指南

避免"AI 生成感"：
- ❌ 不要使用过度居中的布局
- ❌ 避免紫色渐变
- ❌ 避免统一的圆角
- ❌ 避免 Inter 字体

### 配置文件位置

- 主配置：[web-artifacts-builder/SKILL.md](web-artifacts-builder/SKILL.md)
- 初始化脚本：[web-artifacts-builder/scripts/init-artifact.sh](web-artifacts-builder/scripts/init-artifact.sh)
- 打包脚本：[web-artifacts-builder/scripts/bundle-artifact.sh](web-artifacts-builder/scripts/bundle-artifact.sh)

---

## 🧪 3. webapp-testing

### 核心功能

使用 Playwright 测试本地 Web 应用的工具包。支持验证前端功能、调试 UI 行为、捕获浏览器截图和查看浏览器日志。

### 辅助脚本

- `scripts/with_server.py` - 管理服务器生命周期（支持多个服务器）

### 决策树：选择测试方法

```
用户任务 → 是否为静态 HTML？
    ├─ 是 → 直接读取 HTML 文件识别选择器
    │         ├─ 成功 → 编写 Playwright 脚本
    │         └─ 失败/不完整 → 视为动态应用
    │
    └─ 否（动态 Web 应用）→ 服务器是否已运行？
        ├─ 否 → 运行：python scripts/with_server.py --help
        │        然后使用辅助工具 + 编写简化的 Playwright 脚本
        │
        └─ 是 → 侦察然后行动：
            1. 导航并等待 networkidle
            2. 截图或检查 DOM
            3. 从渲染状态识别选择器
            4. 使用发现的选择器执行操作
```

### 使用示例

#### 单个服务器

```bash
python scripts/with_server.py --server "npm run dev" --port 5173 -- python your_automation.py
```

#### 多个服务器（后端 + 前端）

```bash
python scripts/with_server.py \
  --server "cd backend && python server.py" --port 3000 \
  --server "cd frontend && npm run dev" --port 5173 \
  -- python your_automation.py
```

### 自动化脚本模板

```python
from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()
    page.goto('http://localhost:5173')
    page.wait_for_load_state('networkidle')  # 关键：等待 JS 执行

    # 执行测试操作
    page.click('button[type="submit"]')
    page.fill('input[name="username"]', 'test@example.com')

    # 截图
    page.screenshot(path='screenshot.png')

    browser.close()
```

### MedWeb 项目测试场景

**场景 1：用户注册流程测试**

```python
# 测试用户注册表单
page.goto('http://localhost:5173/register')
page.fill('input[name="username"]', 'doctor_zhang')
page.fill('input[name="email"]', 'zhang@hospital.com')
page.fill('input[name="password"]', 'SecurePass123')
page.click('button:has-text("注册")')
page.wait_for_selector('text=注册成功')
```

**场景 2：管理员审核流程测试**

```python
# 测试管理员审核功能
page.goto('http://localhost:5173/admin/approvals')
page.click('button:has-text("通过")')
page.wait_for_selector('text=审核通过')
```

### 最佳实践

- ✅ 使用 `sync_playwright()` 进行同步脚本
- ✅ 完成后关闭浏览器
- ✅ 使用描述性选择器：`text=`、`role=`、CSS 选择器、ID
- ✅ 添加适当的等待：`page.wait_for_selector()` 或 `page.wait_for_timeout()`

### 配置文件位置

- 主配置：[webapp-testing/SKILL.md](webapp-testing/SKILL.md)
- 辅助脚本：[webapp-testing/scripts/with_server.py](webapp-testing/scripts/with_server.py)
- 示例文件：[webapp-testing/examples/](webapp-testing/examples/)

---

## 🚀 4. vercel-agent-skills

### 核心功能

Vercel 工程团队的性能优化指南集合，包含 React 和 Next.js 最佳实践、Web 设计指南等。

### 包含的子技能

#### 4.1 web-design-guidelines

**功能**：审查 UI 代码是否符合 Web 界面指南

**触发词**：
- "审查我的 UI"
- "检查可访问性"
- "审计设计"
- "审查 UX"
- "检查我的网站是否符合最佳实践"

**工作流程**：
1. 从源 URL 获取最新指南
2. 读取指定的文件
3. 检查所有指南中的规则
4. 以 `file:line` 格式输出发现

#### 4.2 react-best-practices

**功能**：Vercel 工程团队的 React 和 Next.js 性能优化指南

**版本**：1.0.0（2026 年 1 月）

**包含内容**：40+ 规则，分 8 个类别，按影响优先级排列

### 规则类别（按优先级）

| 优先级 | 类别 | 影响 | 前缀 | 规则数 |
|--------|------|------|------|--------|
| 1 | 消除瀑布流 | 关键 | `async-` | 5 |
| 2 | 包大小优化 | 关键 | `bundle-` | 5 |
| 3 | 服务器端性能 | 高 | `server-` | 5 |
| 4 | 客户端数据获取 | 中-高 | `client-` | 2 |
| 5 | 重新渲染优化 | 中 | `rerender-` | 7 |
| 6 | 渲染性能 | 中 | `rendering-` | 7 |
| 7 | JavaScript 性能 | 低-中 | `js-` | 12 |
| 8 | 高级模式 | 低 | `advanced-` | 2 |

### 使用场景

- 编写新的 React 组件或 Next.js 页面
- 实现数据获取（客户端或服务器端）
- 审查代码以查找性能问题
- 重构现有 React/Next.js 代码
- 优化包大小或加载时间

### 关键规则示例

**1. 消除瀑布流（关键）**

❌ 错误示例（瀑布流）：
```typescript
const user = await fetchUser()
const posts = await fetchPosts()
const comments = await fetchComments()
```

✅ 正确示例（并行）：
```typescript
const [user, posts, comments] = await Promise.all([
  fetchUser(),
  fetchPosts(),
  fetchComments()
])
```

**2. 包大小优化（关键）**

❌ 错误示例（导入整个库）：
```typescript
import _ from 'lodash'
```

✅ 正确示例（按需导入）：
```typescript
import debounce from 'lodash/debounce'
```

### 配置文件位置

- 主配置：[vercel-agent-skills/AGENTS.md](vercel-agent-skills/AGENTS.md)
- Web 设计指南：[vercel-agent-skills/skills/web-design-guidelines/SKILL.md](vercel-agent-skills/skills/web-design-guidelines/SKILL.md)
- React 最佳实践：[vercel-agent-skills/skills/react-best-practices/SKILL.md](vercel-agent-skills/skills/react-best-practices/SKILL.md)

---

## 💡 最佳实践

### 技能组合使用

这 4 个技能覆盖完整的开发生命周期，建议按以下顺序使用：

```
1. frontend-design
   ↓ 设计界面美学和交互
2. web-artifacts-builder
   ↓ 构建 React 应用
3. webapp-testing
   ↓ 测试功能和 UI
4. vercel-agent-skills
   ↓ 优化性能和代码质量
```

### MedWeb 项目开发流程示例

**阶段 1：设计（frontend-design）**
- 确定医疗表单的美学方向
- 选择专业的字体和配色
- 设计清晰的视觉层次

**阶段 2：开发（web-artifacts-builder）**
```bash
bash web-artifacts-builder/scripts/init-artifact.sh medweb-form
cd medweb-form
# 开发表单组件
bash ../web-artifacts-builder/scripts/bundle-artifact.sh
```

**阶段 3：测试（webapp-testing）**
```bash
python webapp-testing/scripts/with_server.py \
  --server "npm run dev" --port 5173 \
  -- python test_form.py
```

**阶段 4：优化（vercel-agent-skills）**
- 审查代码性能问题
- 应用 React 最佳实践
- 优化包大小和加载时间

---

## ❓ 常见问题

### Q1: 如何验证技能文件是否可访问？

**A:** 使用以下命令检查文件是否存在：

```bash
# 检查所有技能配置文件
ls -la frontend-design/SKILL.md
ls -la web-artifacts-builder/SKILL.md
ls -la webapp-testing/SKILL.md
ls -la vercel-agent-skills/AGENTS.md
```

✅ 验证结果：所有 4 个技能文件均已确认可访问。

### Q2: 哪个技能最重要？

**A:** 对于 MedWeb 项目，前 3 个技能同等重要（⭐⭐⭐⭐⭐）：
- **frontend-design**: 医疗界面需要专业设计
- **web-artifacts-builder**: 构建 React 应用的核心工具
- **webapp-testing**: 医疗数据安全性要求高，必须测试

**vercel-agent-skills** 是辅助优化工具（⭐⭐⭐⭐），优先级略低但仍然推荐使用。

### Q3: 如何开始使用这些技能？

**A:** 建议按以下顺序学习和使用：

1. **先阅读配置文件**：了解每个技能的功能和使用方法
2. **从简单开始**：先使用 frontend-design 设计一个简单组件
3. **逐步深入**：使用 web-artifacts-builder 构建完整应用
4. **添加测试**：使用 webapp-testing 确保质量
5. **持续优化**：参考 vercel-agent-skills 改进代码

### Q4: 技能之间有依赖关系吗？

**A:** 没有强制依赖关系，但建议按开发流程顺序使用：
- frontend-design → web-artifacts-builder → webapp-testing → vercel-agent-skills

每个技能都可以独立使用，但组合使用效果最佳。

### Q5: 如何获取更多帮助？

**A:** 查看各技能的详细文档：
- [frontend-design/SKILL.md](frontend-design/SKILL.md)
- [web-artifacts-builder/SKILL.md](web-artifacts-builder/SKILL.md)
- [webapp-testing/SKILL.md](webapp-testing/SKILL.md)
- [vercel-agent-skills/AGENTS.md](vercel-agent-skills/AGENTS.md)

---

## 📚 快速参考

### 技能速查表

| 需求 | 使用技能 | 命令/操作 |
|------|---------|----------|
| 设计界面 | frontend-design | 参考设计原则和美学指南 |
| 初始化项目 | web-artifacts-builder | `bash scripts/init-artifact.sh <name>` |
| 打包应用 | web-artifacts-builder | `bash scripts/bundle-artifact.sh` |
| 测试应用 | webapp-testing | `python scripts/with_server.py ...` |
| 性能优化 | vercel-agent-skills | 参考 React 最佳实践 |
| UI 审查 | vercel-agent-skills | 使用 web-design-guidelines |

### 关键文件路径

```
MedWeb/
├── frontend-design/
│   └── SKILL.md
├── web-artifacts-builder/
│   ├── SKILL.md
│   └── scripts/
│       ├── init-artifact.sh
│       └── bundle-artifact.sh
├── webapp-testing/
│   ├── SKILL.md
│   ├── scripts/
│   │   └── with_server.py
│   └── examples/
└── vercel-agent-skills/
    ├── AGENTS.md
    └── skills/
        ├── web-design-guidelines/
        └── react-best-practices/
```

---

## 📝 总结

本文档介绍了 MedWeb 项目保留的 4 个核心技能：

1. **frontend-design** - 创建高质量前端界面
2. **web-artifacts-builder** - 构建复杂 React 应用
3. **webapp-testing** - 自动化测试 Web 应用
4. **vercel-agent-skills** - 性能优化与最佳实践

所有技能文件已验证可访问，可以立即开始使用。建议按照开发流程顺序（设计→开发→测试→优化）组合使用这些技能，以获得最佳效果。

---

**文档版本**: 1.0
**最后更新**: 2026-01-19
**维护者**: MedWeb 项目团队
