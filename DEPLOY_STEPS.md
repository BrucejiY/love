# 完整部署指南（前端 + 后端）

## 📦 部署架构

- **前端**: Vercel（静态网站）
- **后端**: Vercel Serverless Functions（或其他平台）

---

## 🎯 步骤 1: 部署前端

### 1.1 导入项目

1. 访问 [Vercel Dashboard](https://vercel.com/dashboard)
2. 点击 "Add New Project"
3. 选择 `BrucejiY/love` 仓库
4. 点击 "Import"

### 1.2 配置前端项目

| 配置项 | 值 |
|--------|-----|
| **Project Name** | `love`（必须小写） |
| **Framework Preset** | `Vite` |
| **Root Directory** | `frontend` ⚠️（必须设置） |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |
| **Install Command** | `npm install` |

### 1.3 暂不配置环境变量

先部署前端，后端后续配置。

### 1.4 点击 Deploy

等待构建完成（约 1-2 分钟）。

---

## 🎯 步骤 2: 部署后端

### 2.1 创建新项目

1. 返回 [Vercel Dashboard](https://vercel.com/dashboard)
2. 再次点击 "Add New Project"
3. 选择**同一个**仓库 `BrucejiY/love`
4. 点击 "Import"

### 2.2 配置后端项目

| 配置项 | 值 |
|--------|-----|
| **Project Name** | `love-api`（或 `love-backend`） |
| **Framework Preset** | `Other` |
| **Root Directory** | `backend` ⚠️（必须设置） |
| **Build Command** | 留空 |
| **Output Directory** | 留空 |
| **Install Command** | `npm install` |

### 2.3 配置环境变量（重要）

点击 "Environment Variables"，添加：

| Name | Value |
|------|-------|
| `ARK_API_KEY` | `342d196d-75d2-4f41-a4ed-4de63b39bd2c` |
| `ARK_BASE_URL` | `https://ark.cn-beijing.volces.com/api/v3` |
| `NODE_ENV` | `production` |

### 2.4 点击 Deploy

等待部署完成。

---

## 🎯 步骤 3: 连接前端和后端

### 3.1 获取后端 URL

后端部署成功后，会得到一个 URL，例如：
- `https://love-api-xxxxx.vercel.app`

### 3.2 配置前端环境变量

1. 进入**前端项目**的设置
2. 找到 "Environment Variables"
3. 添加：
   - Name: `VITE_API_URL`
   - Value: `https://love-api-xxxxx.vercel.app`（你的后端 URL）
4. 保存

### 3.3 重新部署前端

1. 返回前端项目
2. 点击 "Deployments"
3. 点击最新部署的 "..." 菜单
4. 选择 "Redeploy"

---

## ✅ 验证部署

### 前端验证

访问前端 URL（如 `https://love-r7cq.vercel.app`）：
- ✅ 首页显示正常
- ✅ 可以点击"开始分析"
- ✅ 可以上传图片

### 后端验证

访问后端 URL + `/api/health`：
- `https://love-api-xxxxx.vercel.app/api/health`
- 应返回：`{"status":"healthy","timestamp":"..."}`

### 完整测试

1. 上传 5 张以上图片
2. 点击"开始分析"
3. 等待分析完成
4. 查看分析报告

---

## ⚠️ 注意事项

### Vercel Serverless 限制

- ⏱️ 执行时间限制：10-60 秒（取决于套餐）
- 💾 内存限制：1024 MB
- 📦 部署包大小：50 MB

### 可能的问题

1. **超时错误**
   - 原因：AI 分析时间过长
   - 解决：使用其他平台部署后端（Railway/Render）

2. **文件上传限制**
   - Vercel 有请求大小限制（约 4.5MB）
   - 前端已配置图片压缩

---

## 🔄 替代方案：使用其他平台部署后端

如果 Vercel 不适合后端，可以使用：

### Railway（推荐）

1. 访问 [Railway](https://railway.app/)
2. 连接 GitHub 仓库
3. 选择 `backend` 目录
4. 配置环境变量
5. 自动部署

### Render

1. 访问 [Render](https://render.com/)
2. 创建 Web Service
3. 连接 GitHub 仓库
4. Root Directory: `backend`
5. Build Command: `npm install`
6. Start Command: `node server.js`

---

## 📝 快速部署清单

### 前端部署
- [ ] 导入 GitHub 仓库
- [ ] Root Directory: `frontend`
- [ ] Framework: `Vite`
- [ ] 部署成功

### 后端部署
- [ ] 再次导入仓库（作为新项目）
- [ ] Root Directory: `backend`
- [ ] 配置环境变量（ARK_API_KEY）
- [ ] 部署成功

### 连接前后端
- [ ] 获取后端 URL
- [ ] 配置前端 VITE_API_URL
- [ ] 重新部署前端
- [ ] 测试完整功能

---

## 💡 当前状态

✅ 前端已部署: https://love-r7cq.vercel.app
⏳ 后端待部署
⏳ 前后端待连接

下一步：部署后端到 Vercel（或其他平台）

