# Cloudflare Pages 部署（guanlixiatong.com）

## 1. 创建 Pages 项目

1. Cloudflare 控制台 → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**
2. 仓库：`ruixinggongsi-cmd/guanlihoutai--web`
3. 构建设置：

| 项 | 值 |
|----|-----|
| Production branch | `main` |
| Framework preset | `Vite` |
| Build command | `npm install && npm run build` |
| Build output directory | `dist` |
| Root directory | （留空） |

## 2. 环境变量（Production）

在 Pages → Settings → Environment variables 添加（与 `.env.production` 一致）：

```
VITE_API_BASE_URL = https://api.guanlixiatong.com/api
VITE_API_APPID = default_appid
VITE_API_SECRET = default_secret
```

## 3. 自定义域名（前端）

Pages → Custom domains → 添加：

- `guanlixiatong.com`
- `www.guanlixiatong.com`（可选，重定向到主域名）

## 4. 后端 API 子域名（DNS）

在 **DNS** → `guanlixiatong.com` 添加记录：

| 类型 | 名称 | 内容 | 代理 |
|------|------|------|------|
| CNAME | `api` | Render 提供的后端主机名（如 `guanlihoutai--api.onrender.com`） | 已代理（橙色云） |

Render 侧：Service → Settings → Custom Domains → 添加 `api.guanlixiatong.com`。

若暂未配置 `api` 子域名，构建时把 `VITE_API_BASE_URL` 改为：

`https://guanlihoutai--api.onrender.com/api`

## 5. 重新部署

修改环境变量或 DNS 后，在 Pages 点击 **Retry deployment** 或推送新 commit。
