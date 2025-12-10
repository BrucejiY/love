# 🧪 部署测试指南

## ✅ 当前状态

- ✅ 前端已部署: https://love-r7cq.vercel.app
- ✅ 后端已部署: https://love-api-sand.vercel.app
- ✅ Multer 安全漏洞已修复（升级到 2.x）
- ⏳ 等待 Vercel 自动重新部署

---

## 📋 测试步骤

### 1️⃣ 测试后端 API

在浏览器中访问以下 URL：

**健康检查端点:**
```
https://love-api-sand.vercel.app/api/health
```

**预期响应:**
```json
{
  "status": "healthy",
  "timestamp": "2025-12-10T..."
}
```

**根路径:**
```
https://love-api-sand.vercel.app/
```

**预期响应:**
```json
{
  "message": "朋友圈恋爱助手 API",
  "version": "1.0.0",
  "status": "running"
}
```

---

### 2️⃣ 测试前端应用

1. 访问: https://love-r7cq.vercel.app
2. 点击 **"开始分析"**
3. 上传至少 **5 张图片**（朋友圈截图）
4. 点击 **"开始分析"**
5. 等待 AI 分析（约 30-60 秒）
6. 查看分析报告

---

### 3️⃣ 检查部署状态

访问 [Vercel Dashboard](https://vercel.com/dashboard) 查看：

- **love-api** 项目的最新部署状态
- **love-r7cq** 项目的运行状态

---

## 🔧 如果遇到问题

### 问题 1: 后端 API 返回 500 错误

**可能原因:**
- 环境变量 `ARK_API_KEY` 未配置

**解决方案:**
1. 进入 Vercel Dashboard → `love-api` 项目
2. Settings → Environment Variables
3. 确认 `ARK_API_KEY` 已设置为: `342d196d-75d2-4f41-a4ed-4de63b39bd2c`
4. 重新部署

---

### 问题 2: 前端显示"分析失败，请重试"

**可能原因:**
- 前端的 `VITE_API_URL` 未配置

**解决方案:**
1. 进入 Vercel Dashboard → `love-r7cq` 项目
2. Settings → Environment Variables
3. 添加:
   - Name: `VITE_API_URL`
   - Value: `https://love-api-sand.vercel.app`
4. 重新部署

---

### 问题 3: 图片上传失败

**可能原因:**
- 图片格式不支持
- 图片大小超过 10MB
- 上传数量少于 5 张

**解决方案:**
- 确保上传 **5-20 张** 图片
- 支持格式: JPG, PNG, WebP
- 单张图片不超过 10MB

---

## 🎯 完整测试清单

- [ ] 后端健康检查正常
- [ ] 前端页面可以访问
- [ ] 可以上传图片
- [ ] AI 分析正常工作
- [ ] 分析报告正常显示
- [ ] 没有控制台错误

---

## 📞 需要帮助？

如果测试中遇到任何问题，请提供：
1. 具体的错误信息
2. 浏览器控制台的错误日志
3. Vercel 部署日志截图

---

**最后更新:** 2025-12-10

