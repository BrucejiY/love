# Vercel 分步部署指南 🚀

按照这个指南，5 分钟完成前后端部署！

---

## 📦 第一部分：部署前端

### Step 1: 导入项目
1. 访问 https://vercel.com/dashboard
2. 点击 **"Add New Project"**
3. 找到并点击 **`BrucejiY/love`** 仓库
4. 点击 **"Import"**

### Step 2: 配置前端（复制这些设置）

```
Project Name: love
```

**Root Directory:** 点击 "Edit"，输入：
```
frontend
```

**Framework Preset:** 选择
```
Vite
```

**Build Command:**（应该自动填充）
```
npm run build
```

**Output Directory:**（应该自动填充）
```
dist
```

### Step 3: 跳过环境变量
暂时不配置，先部署前端。

### Step 4: 点击 Deploy
等待 1-2 分钟。

### Step 5: 测试前端
部署成功后，点击访问 URL，确认：
- ✅ 首页能正常显示
- ✅ 可以点击"开始分析"
- ✅ 可以进入上传页面

**前端 URL 示例**: `https://love-xxxxx.vercel.app`

---

## 📦 第二部分：部署后端

### Step 1: 再次导入同一个仓库
1. 返回 https://vercel.com/dashboard
2. 再次点击 **"Add New Project"**
3. 再次选择 **`BrucejiY/love`** 仓库（是的，同一个仓库）
4. 点击 **"Import"**

### Step 2: 配置后端（复制这些设置）

```
Project Name: love-api
```

**Root Directory:** 点击 "Edit"，输入：
```
backend
```

**Framework Preset:** 选择
```
Other
```

**Build Command:** 留空
**Output Directory:** 留空
**Install Command:**（应该自动填充）
```
npm install
```

### Step 3: 配置环境变量（重要！）

点击 **"Environment Variables"**，添加以下 3 个：

**变量 1:**
```
Name: ARK_API_KEY
Value: 342d196d-75d2-4f41-a4ed-4de63b39bd2c
```

**变量 2:**
```
Name: ARK_BASE_URL
Value: https://ark.cn-beijing.volces.com/api/v3
```

**变量 3:**
```
Name: NODE_ENV
Value: production
```

### Step 4: 点击 Deploy
等待 1-2 分钟。

### Step 5: 测试后端
部署成功后，复制后端 URL（例如：`https://love-api-xxxxx.vercel.app`）

在浏览器访问：
```
https://love-api-xxxxx.vercel.app/api/health
```

应该看到：
```json
{"status":"healthy","timestamp":"..."}
```

---

## 📦 第三部分：连接前后端

### Step 1: 进入前端项目设置
1. 在 Vercel Dashboard 找到前端项目（`love`）
2. 点击进入
3. 点击顶部的 **"Settings"** 标签
4. 左侧菜单选择 **"Environment Variables"**

### Step 2: 添加后端 URL
点击 "Add New"，填入：

```
Name: VITE_API_URL
Value: https://love-api-xxxxx.vercel.app/api
```

⚠️ **注意**：
- 将 `xxxxx` 替换为你的实际后端 URL
- 确保 URL 末尾是 `/api`

### Step 3: 重新部署前端
1. 点击顶部的 **"Deployments"** 标签
2. 找到最新的部署
3. 点击右侧的 **"..."** 菜单
4. 选择 **"Redeploy"**
5. 确认重新部署

---

## ✅ 完成！测试整个应用

### 访问前端 URL

打开你的前端 URL：`https://love-xxxxx.vercel.app`

### 完整测试流程

1. **首页** → 点击"开始分析"
2. **上传页** → 上传 5 张以上朋友圈截图
3. **分析页** → 等待 AI 分析（20-30 秒）
4. **报告页** → 查看分析结果

如果一切正常，恭喜你！🎉

---

## 📋 部署检查清单

### 前端项目
- [ ] 项目名称：`love`
- [ ] Root Directory：`frontend`
- [ ] Framework：`Vite`
- [ ] 部署成功
- [ ] 可以访问首页

### 后端项目
- [ ] 项目名称：`love-api`
- [ ] Root Directory：`backend`
- [ ] 环境变量：ARK_API_KEY, ARK_BASE_URL, NODE_ENV
- [ ] 部署成功
- [ ] `/api/health` 返回正常

### 连接配置
- [ ] 前端添加环境变量：`VITE_API_URL`
- [ ] 前端重新部署
- [ ] 完整功能测试通过

---

## ❓ 常见问题

### Q1: 后端部署失败？

可能是 Vercel 不支持某些功能。替代方案：
- 使用 Railway: https://railway.app
- 使用 Render: https://render.com

### Q2: 分析超时？

Vercel 有执行时间限制（10-60秒）。如果经常超时：
- 使用 Railway 或 Render 部署后端（无超时限制）
- 优化 AI 请求

### Q3: 图片上传失败？

Vercel 有请求大小限制（4.5MB）。前端已配置自动压缩，应该没问题。

---

## 🎯 当前进度

✅ 代码已优化：支持环境变量配置
✅ 代码已推送到 GitHub
⏳ 等待你在 Vercel 中操作

**下一步**：按照上面的步骤在 Vercel 中操作即可！

