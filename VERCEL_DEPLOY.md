# Vercel 部署指南

## 🚀 快速部署

### 方法 1: 通过 GitHub 自动部署（推荐）

1. **连接 GitHub 仓库**
   - 访问 [Vercel Dashboard](https://vercel.com/dashboard)
   - 点击 "Add New Project"
   - 选择你的 GitHub 仓库：`BrucejiY/love`
   - 点击 "Import"

2. **配置项目设置**
   - **Framework Preset**: 选择 `Vite`
   - **Root Directory**: 设置为 `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

3. **环境变量**（如果需要）
   - 如果前端需要访问后端 API，添加环境变量：
     - `VITE_API_URL`: 你的后端 API 地址

4. **部署**
   - 点击 "Deploy"
   - 等待构建完成

### 方法 2: 使用 Vercel CLI

```bash
# 安装 Vercel CLI
npm i -g vercel

# 进入前端目录
cd frontend

# 部署
vercel

# 生产环境部署
vercel --prod
```

---

## ⚠️ 常见问题解决

### 问题 1: 404 NOT_FOUND 错误

**原因**: Vue Router 使用 History 模式，需要配置重写规则

**解决方案**:
1. 确保 `frontend/vercel.json` 文件存在
2. 检查 `rewrites` 配置是否正确
3. 如果使用子目录部署，更新 `base` 配置

### 问题 2: 构建失败

**检查项**:
- ✅ Node.js 版本（Vercel 默认使用 18.x）
- ✅ 依赖安装是否成功
- ✅ 构建命令是否正确

**解决方案**:
在 `package.json` 中添加：
```json
{
  "engines": {
    "node": ">=18.0.0"
  }
}
```

### 问题 3: API 请求失败

**原因**: 前端需要访问后端 API，但后端未部署

**解决方案**:
1. **部署后端到 Vercel**（推荐）:
   - 创建新的 Vercel 项目
   - Root Directory: `backend`
   - Build Command: 留空（Node.js 项目）
   - Output Directory: 留空

2. **或使用其他服务**:
   - Railway
   - Render
   - 阿里云/腾讯云服务器

3. **配置环境变量**:
   - 在 Vercel 项目设置中添加 `VITE_API_URL`

### 问题 4: 路由不工作

**解决方案**:
确保 `frontend/vercel.json` 包含：
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

---

## 📋 部署检查清单

### 部署前

- [ ] 确保代码已推送到 GitHub
- [ ] 检查 `frontend/vercel.json` 存在
- [ ] 确认 `package.json` 中有 `build` 脚本
- [ ] 测试本地构建：`cd frontend && npm run build`

### 部署时

- [ ] Root Directory 设置为 `frontend`
- [ ] Framework Preset 选择 `Vite`
- [ ] Build Command: `npm run build`
- [ ] Output Directory: `dist`
- [ ] 配置环境变量（如需要）

### 部署后

- [ ] 访问部署 URL 测试
- [ ] 检查浏览器控制台是否有错误
- [ ] 测试所有路由是否正常
- [ ] 检查 API 请求是否正常

---

## 🔧 高级配置

### 自定义域名

1. 在 Vercel 项目设置中添加域名
2. 按照提示配置 DNS 记录
3. 等待 SSL 证书自动配置

### 环境变量

在 Vercel 项目设置 > Environment Variables 中添加：

```
VITE_API_URL=https://your-backend.vercel.app
```

### 构建优化

在 `vite.config.js` 中：
```javascript
export default defineConfig({
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false, // 生产环境关闭 sourcemap
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['vue', 'vue-router', 'pinia']
        }
      }
    }
  }
})
```

---

## 📞 获取帮助

- Vercel 文档: https://vercel.com/docs
- 错误排查: https://vercel.com/docs/errors
- 社区支持: https://github.com/vercel/vercel/discussions

---

## 🎯 快速修复 404 错误

如果遇到 404 错误，立即检查：

1. ✅ `frontend/vercel.json` 文件是否存在
2. ✅ `rewrites` 配置是否正确
3. ✅ Root Directory 是否设置为 `frontend`
4. ✅ 构建是否成功完成

如果以上都正确，尝试：
- 清除 Vercel 缓存
- 重新部署
- 检查部署日志

