# 🧪 本地测试指南

## ✅ 服务已启动

- ✅ 后端运行在: http://localhost:3001
- ✅ 前端运行在: http://localhost:5173

---

## 📝 测试步骤

### 1. 访问前端

在浏览器打开：
```
http://localhost:5173
```

### 2. 上传图片

- 点击"开始分析"
- 上传至少 5 张图片（朋友圈截图）
- 点击"开始分析"

### 3. 查看后端日志

在后端终端查看实时日志输出，应该会看到：

```
📸 收到 X 张图片
🔑 检查 API Key... { hasKey: true, keyPrefix: '342d196d...' }
📤 发送请求到豆包 API... { url: ..., model: ..., imageCount: X }
📦 请求体大小: XXXXX bytes
```

**如果出现错误，会显示：**
```
❌ 调用豆包 API 失败
错误类型: ...
错误消息: ...
响应状态: ...
响应数据: ...
```

### 4. 复制错误信息

**请把后端终端中显示的完整错误信息复制给我！**

---

## 🔍 查看后端日志的方法

### 方法 1: 查看终端文件
```bash
tail -f /Users/bruce/.cursor/projects/Users-bruce-Desktop-demo/terminals/5.txt
```

### 方法 2: 直接查看后端进程输出
后端日志会实时显示在运行 `node server.js` 的终端中

---

## 🛑 如果需要重启

### 停止所有服务
```bash
# 停止后端
lsof -ti:3001 | xargs kill -9

# 停止前端
lsof -ti:5173 | xargs kill -9
```

### 重新启动
```bash
# 启动后端
cd /Users/bruce/Desktop/demo/backend
node server.js &

# 启动前端
cd /Users/bruce/Desktop/demo/frontend
npm run dev
```

---

## 🎯 我需要的信息

上传图片测试后，**请提供后端终端显示的完整错误日志**，包括：

1. `📸 收到 X 张图片` - 确认收到图片
2. `🔑 检查 API Key...` - 确认 API Key 状态
3. `📤 发送请求到豆包 API...` - 确认发送请求
4. `❌ 调用豆包 API 失败` - **这是关键！**
5. 下面的所有错误详情

有了这些信息，我就能精准修复问题！

