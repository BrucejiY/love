# 🔍 调试检查清单

## 请提供以下信息帮助诊断问题：

### 1️⃣ 浏览器控制台错误（最重要）

请按 **F12** 打开开发者工具，然后：

#### Console 标签
截图或复制所有**红色错误信息**，例如：
```
❌ POST https://... 404 (Not Found)
❌ Network Error
❌ CORS policy error
```

#### Network 标签
1. 刷新页面并上传图片
2. 找到 **失败的请求**（红色）
3. 点击该请求
4. 查看：
   - **Request URL**: 请求发送到哪里？
   - **Status Code**: 状态码是什么？
   - **Response**: 服务器返回了什么错误信息？

---

### 2️⃣ 检查环境变量是否生效

在浏览器 Console 中，应该看到：
```
🔗 API Base URL: https://love-api-sand.vercel.app
🏠 Is Local: false
```

**实际显示的是什么？** 请复制这两行。

---

### 3️⃣ 测试后端 API

在浏览器新标签页打开：
```
https://love-api-sand.vercel.app/api/health
```

**显示什么？**
- ✅ 正常: `{"status":"healthy","timestamp":"..."}`
- ❌ 错误: 显示错误页面或 500 错误

---

### 4️⃣ Vercel 部署状态

1. 前端 (`love-r7cq`) 最新部署状态：
   - [ ] Ready (绿色)
   - [ ] Error (红色)
   - [ ] Building (黄色)

2. 后端 (`love-api`) 最新部署状态：
   - [ ] Ready (绿色)
   - [ ] Error (红色)
   - [ ] Building (黄色)

---

### 5️⃣ 环境变量配置确认

#### 前端项目 (`love-r7cq`)
- [ ] 已添加 `VITE_API_URL` = `https://love-api-sand.vercel.app`
- [ ] 添加后已重新部署

#### 后端项目 (`love-api`)
- [ ] 已添加 `ARK_API_KEY` = `342d196d-75d2-4f41-a4ed-4de63b39bd2c`
- [ ] 已添加 `ARK_BASE_URL` = `https://ark.cn-beijing.volces.com/api/v3`

---

## 🎯 快速诊断命令

如果可以访问命令行，运行：

```bash
# 测试后端健康检查
curl -v https://love-api-sand.vercel.app/api/health

# 测试后端根路径
curl -v https://love-api-sand.vercel.app/
```

把输出结果发给我。

---

## 💡 常见问题自查

### 问题 A: 前端还在调用 `/api` 而不是完整 URL
**症状**: Network 标签显示请求发送到 `love-r7cq.vercel.app/api/...`
**原因**: 环境变量没生效
**解决**: 
1. 确认环境变量已保存
2. 必须重新部署（Redeploy）才能生效
3. 清除浏览器缓存，硬刷新（Ctrl+Shift+R）

### 问题 B: 后端返回 500 错误
**症状**: 请求到达后端，但返回 500 Internal Server Error
**原因**: 
- 豆包 API Key 未配置或错误
- 后端代码在 Serverless 环境中崩溃
**解决**: 查看 Vercel 后端项目的 "Functions" 日志

### 问题 C: CORS 错误
**症状**: Console 显示 "blocked by CORS policy"
**原因**: 后端 CORS 配置问题
**解决**: 检查后端 `server.js` 的 CORS 设置

### 问题 D: 超时错误
**症状**: 请求等待很久后失败
**原因**: 
- 豆包 API 调用时间过长
- 图片太大
**解决**: 确保单张图片 < 10MB，总共 5-10 张

---

**请提供上述信息，我会帮你精准定位问题！**

