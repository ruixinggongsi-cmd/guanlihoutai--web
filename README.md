# 管理后台前端系统

基于 Vue3 + Vite + Element Plus 的现代化管理后台前端应用，提供完整的用户界面和交互体验。

## 🌟 功能特性

### 🔐 认证授权
- 用户登录/登出
- JWT Token 管理
- 权限控制（基于角色的访问控制 RBAC）
- 路由守卫和权限指令

### 👥 用户管理
- 用户列表管理
- 用户角色分配
- 部门组织架构管理
- 角色权限配置

### 📋 业务管理
- 客户信息管理
- 设备申请与审批流程
- 费用申请与报销流程
- 任务管理系统
- 联系记录管理

### 📊 数据统计
- 客户统计报表
- 设备统计报表
- 费用统计报表
- 业务数据可视化

### 📝 系统日志
- 登录日志记录
- 操作日志追踪
- 日志详情查看
- 日志导出功能

### 📱 移动端支持
- 响应式设计
- 移动端适配
- PWA 支持

## 🛠 技术栈

### 核心框架
- **Vue 3** - 渐进式 JavaScript 框架
- **Vite** - 下一代前端构建工具
- **Element Plus** - Vue 3 组件库
- **Vue Router** - Vue.js 官方路由管理器
- **Pinia** - Vue 状态管理库

### UI/样式
- **Tailwind CSS** - 实用优先的 CSS 框架
- **Element Plus Icons** - Element Plus 图标库
- **ECharts** - 数据可视化图表库

### 工具库
- **Axios** - HTTP 客户端
- **CryptoJS** - 加密算法库
- **XLSX** - Excel 文件处理

### 开发工具
- **TypeScript** - JavaScript 的超集
- **ESLint** - 代码质量检查
- **PostCSS** - CSS 后处理器

## 📦 项目结构

```
manageweb/
├── public/                  # 静态资源
├── src/
│   ├── api/                # API 接口封装
│   ├── assets/              # 静态资源
│   ├── components/          # 公共组件
│   ├── directives/          # 自定义指令
│   ├── router/              # 路由配置
│   ├── stores/              # 状态管理
│   ├── utils/               # 工具函数
│   ├── views/               # 页面组件
│   ├── App.vue              # 根组件
│   ├── main.js              # 入口文件
│   └── style.css            # 全局样式
├── package.json             # 项目配置
├── vite.config.js           # Vite 配置
├── tailwind.config.js       # Tailwind CSS 配置
└── README.md                # 项目文档
```

## 🚀 快速开始

### 环境要求
- Node.js >= 16.0.0
- npm >= 7.0.0 或 pnpm >= 6.0.0

### 安装依赖
```bash
# 使用 pnpm（推荐）
pnpm install

# 或使用 npm
npm install
```

### 开发环境
```bash
# 启动开发服务器
pnpm dev
# 或
npm run dev

# 访问 http://localhost:3000
```

### 生产构建
```bash
# 构建生产版本
pnpm build
# 或
npm run build

# 预览构建结果
pnpm preview
# 或
npm run preview
```

## 🔧 配置说明

### 环境变量
创建 `.env` 文件并配置以下变量：

```env
# API 基础地址
VITE_API_BASE_URL=http://localhost:3001

# 应用标题
VITE_APP_TITLE=管理后台系统
```

### 代理配置
在 `vite.config.js` 中配置开发服务器代理：

```javascript
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})
```

## 📋 主要页面

### 登录页面
- 用户身份验证
- 记住密码功能
- 自动登录

### 首页仪表板
- 系统概览
- 快捷功能入口
- 数据统计展示

### 用户管理
- 用户列表（增删改查）
- 角色管理
- 权限配置
- 部门管理

### 客户管理
- 客户信息维护
- 客户分类
- 联系记录
- 客户统计

### 设备管理
- 设备申请
- 审批流程
- 设备分类
- 设备统计

### 费用管理
- 费用申请
- 报销流程
- 费用分类
- 费用统计

### 任务管理
- 任务创建
- 任务分配
- 进度跟踪
- 任务统计

### 系统管理
- 菜单管理
- 操作日志
- 登录日志
- 系统配置

## 🔒 安全特性

### 前端安全
- XSS 防护
- CSRF 防护
- 输入验证
- 敏感信息加密

### 权限控制
- 路由级权限控制
- 按钮级权限控制
- 数据权限过滤
- 角色权限管理

## 📱 移动端适配

### 响应式设计
- 移动端优先设计
- 自适应布局
- 触摸优化
- 手势支持

### PWA 特性
- 离线访问
- 应用安装
- 推送通知
- 后台同步

## 🧪 开发规范

### 代码规范
- 使用 ESLint 进行代码检查
- 遵循 Vue 3 组合式 API 规范
- 统一的代码格式化
- 详细的代码注释

### 组件规范
- 组件命名规范
- Props 和 Emits 定义
- 插槽使用规范
- 生命周期管理

### API 规范
- 统一的请求封装
- 错误处理机制
- 响应数据格式
- 接口版本管理

## 📊 性能优化

### 构建优化
- 代码分割
- 懒加载
- 资源压缩
- 缓存策略

### 运行时优化
- 虚拟滚动
- 防抖节流
- 图片优化
- 内存管理

## 🔧 开发工具

### 调试工具
- Vue DevTools
- Element Plus DevTools
- 网络请求监控
- 性能分析工具

### 构建工具
- Vite 热更新
- 模块联邦
- 环境变量管理
- 多环境部署

## 📚 API 文档

### 认证相关
- `POST /auth/login` - 用户登录
- `POST /auth/logout` - 用户登出
- `GET /auth/profile` - 获取用户信息

### 用户管理
- `GET /users` - 获取用户列表
- `POST /users` - 创建用户
- `PUT /users/:id` - 更新用户
- `DELETE /users/:id` - 删除用户

### 客户管理
- `GET /customers` - 获取客户列表
- `POST /customers` - 创建客户
- `PUT /customers/:id` - 更新客户
- `DELETE /customers/:id` - 删除客户

### 设备管理
- `GET /equipment-applications` - 获取设备申请列表
- `POST /equipment-applications` - 创建设备申请
- `PUT /equipment-applications/:id/approve` - 审批设备申请

### 费用管理
- `GET /expense-applications` - 获取费用申请列表
- `POST /expense-applications` - 创建费用申请
- `PUT /expense-applications/:id/approve` - 审批费用申请

### 任务管理
- `GET /tasks` - 获取任务列表
- `POST /tasks` - 创建任务
- `PUT /tasks/:id` - 更新任务
- `DELETE /tasks/:id` - 删除任务

### 系统日志
- `GET /logs/login` - 获取登录日志
- `GET /logs/operation` - 获取操作日志
- `GET /logs/export` - 导出日志

## 🤝 贡献指南

### 开发流程
1. Fork 项目仓库
2. 创建功能分支
3. 提交代码更改
4. 发起 Pull Request
5. 代码审查和合并

### 提交规范
- 使用语义化提交信息
- 详细的提交描述
- 关联相关 Issue
- 遵循代码规范

## 📄 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

## 🆘 支持

如遇到问题，请：
1. 查看文档和 FAQ
2. 搜索已有 Issue
3. 创建新的 Issue
4. 联系开发团队

## 📞 联系方式

- 项目维护者：[Your Name]
- 邮箱：your.email@example.com
- 项目主页：https://github.com/yourusername/manageweb