# 🔍 部署检查清单

## ✅ 后端状态
- 后端 `love-api` 已部署成功（2分钟前）
- Status: Ready ✅

## ⚠️ 需要检查

### 1. 查看后端 Runtime Logs

在 Vercel 后端项目页面：
1. 点击 **"Runtime Logs"** 按钮
2. 保持页面打开
3. 在前端上传图片触发分析
4. 查看实时日志输出

**应该看到：**
```
📸 收到 X 张图片
🔑 检查 API Key...
📤 发送请求到豆包 API...
✅ 检测到 output 数组格式，长度: 1
✅ 从 reasoning.summary 中提取文本
```

**如果看到错误，请复制给我！**

---

### 2. 测试后端 API

在浏览器访问：
```
https://love-api-sand.vercel.app/api/health
```

应该显示：
```json
{
  "status": "healthy",
  "env": {
    "hasApiKey": true,
    "apiKeyPrefix": "342d196d..."
  }
}
```

---

### 3. 检查前端环境变量

前端项目 `love-r7cq` 必须配置环境变量：

1. 进入 Vercel Dashboard → `love-r7cq` 项目
2. Settings → Environment Variables
3. 确认是否有：
   - `VITE_API_URL` = `https://love-api-sand.vercel.app`

**如果没有这个环境变量，请添加后重新部署前端！**

---

### 4. 清除浏览器缓存

前端可能使用了旧代码：
- 按 **Ctrl+Shift+R**（Mac: Cmd+Shift+R）硬刷新
- 或者在开发者工具（F12）中，右键刷新按钮 → "清空缓存并硬性重新加载"

---

## 🎯 快速诊断

请按顺序告诉我：

1. **Runtime Logs 显示什么错误？**（最重要）
2. **后端健康检查是否显示 `hasApiKey: true`？**
3. **前端是否配置了 `VITE_API_URL` 环境变量？**
4. **浏览器开发者工具 Console 显示什么错误？**

有了这些信息，我就能精准定位问题！

