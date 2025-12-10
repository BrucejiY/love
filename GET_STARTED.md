# 🚀 立即开始使用

欢迎使用朋友圈恋爱助手！只需 3 步即可开始。

---

## ⚡ 3 步快速开始

### 第 1 步：安装依赖（2 分钟）

```bash
# 安装前端依赖
cd frontend
npm install

# 安装后端依赖
cd ../backend
npm install
```

### 第 2 步：配置 API Key（1 分钟）

1. **获取 API Key**：访问 [火山引擎控制台](https://console.volcengine.com/ark) 获取

2. **创建配置文件**：

```bash
cd backend
cp .env.example .env
```

3. **填入 API Key**：

编辑 `backend/.env` 文件：

```env
ARK_API_KEY=你的API_Key（粘贴在这里）
```

> 💡 详细教程请查看：[API_CONFIG.md](./API_CONFIG.md)

### 第 3 步：启动项目（1 分钟）

**使用便捷脚本（推荐）**：

```bash
./start.sh
```

**或者手动启动**：

```bash
# 终端 1 - 启动后端
cd backend
npm run dev

# 终端 2 - 启动前端
cd frontend  
npm run dev
```

🎉 打开浏览器访问：**http://localhost:5173**

---

## 📱 使用流程

1. **首页** → 点击"开始分析"按钮
2. **上传** → 上传 5-20 张朋友圈截图
3. **等待** → AI 分析约需 20-30 秒
4. **查看** → 获得详细的分析报告和追求建议

---

## 🎯 核心功能

### ✨ 已完成的功能

✅ **智能图片上传**
- 拖拽/点击上传
- 自动压缩
- 实时预览

✅ **AI 深度分析**
- 性格特征分析
- 兴趣爱好识别
- 价值观评估
- 社交状态判断

✅ **可视化报告**
- 4 维度评分
- 性格标签云
- 追求策略建议
- 行动计划时间线

✅ **隐私保护**
- 无需注册登录
- 图片 24h 自动删除
- 数据安全加密

---

## 🛠️ 技术栈

- **前端**：Vue 3 + Vite + Pinia
- **后端**：Node.js + Express
- **AI**：豆包大模型 (doubao-seed-1-6-thinking-250715)
- **设计**：Apple Design System

---

## 📚 文档导航

| 文档 | 说明 |
|------|------|
| **README.md** | 完整的项目说明 |
| **QUICKSTART.md** | 详细的启动指南 |
| **API_CONFIG.md** | API Key 配置教程 |
| **PRD.md** | 产品需求文档 |
| **GITHUB_SETUP.md** | GitHub 同步指南 |
| **PROJECT_SUMMARY.md** | 项目总结 |
| **CHECKLIST.md** | 验收清单 |

---

## ❓ 常见问题

### Q: 没有豆包 API Key 怎么办？

**A**: 访问 [火山引擎官网](https://console.volcengine.com/ark) 注册账号，新用户通常有免费试用额度。

### Q: npm install 很慢？

**A**: 使用淘宝镜像：

```bash
npm config set registry https://registry.npmmirror.com
```

### Q: 分析失败？

**A**: 检查：
1. API Key 是否正确配置
2. 网络是否正常
3. 查看后端终端的错误日志

### Q: 如何停止项目？

**A**: 
- 使用脚本：`./stop.sh`
- 或手动：在两个终端按 `Ctrl+C`

---

## 💡 使用技巧

### 上传技巧

- ✅ 上传 10+ 张截图，分析更准确
- ✅ 截图内容要多样化（不同时间、不同话题）
- ✅ 确保截图清晰可读
- ❌ 避免重复截图

### 分析优化

- 💰 单次分析约消耗 ¥0.1-0.3
- ⏱️ 分析时间 20-30 秒
- 🔄 可以多次分析同一个人（补充新截图）

---

## 🎨 界面预览

项目采用 **Apple 设计风格**：

- 🎨 简洁优雅的界面
- 🌈 温暖的粉紫色系
- ✨ 流畅的动画效果
- 📱 完美的移动端适配

---

## 🔄 更新记录

### v1.0.0 (2025-12-10)

- ✅ 完成基础功能开发
- ✅ 集成豆包大模型 API
- ✅ 实现 Apple 设计风格
- ✅ 完善文档体系

---

## 🤝 贡献与反馈

### 发现 Bug？

请在 [GitHub Issues](https://github.com/yourusername/moments-love-assistant/issues) 提交

### 有建议？

欢迎在 [GitHub Discussions](https://github.com/yourusername/moments-love-assistant/discussions) 讨论

### 想贡献代码？

请查看 [README.md](./README.md) 中的贡献指南

---

## 📞 需要帮助？

- 📖 查看完整文档：`README.md`
- 🔧 配置问题：`API_CONFIG.md`
- 💬 技术讨论：GitHub Discussions
- 🐛 Bug 报告：GitHub Issues

---

## 🌟 项目特色

### 🆓 完全免费

- 初期无需付费
- 无需注册账号
- 开源代码

### 🎨 精美设计

- Apple 设计规范
- 响应式布局
- 流畅动画

### 🤖 AI 驱动

- 最新豆包模型
- 多维度分析
- 实用建议

### 🔒 隐私保护

- 本地分析
- 自动删除
- 数据加密

---

## 🎯 下一步

项目已完成开发，可以：

1. ✅ **本地测试**：确保所有功能正常
2. ✅ **配置 API**：获取并配置豆包 API Key
3. ✅ **开始使用**：上传截图，获取分析
4. 🔄 **同步 GitHub**：按照 GITHUB_SETUP.md 操作
5. 🚀 **在线部署**：按照 DEPLOY.md 部署到服务器

---

**准备好了吗？让我们开始吧！** 🚀

```bash
# 一键启动
./start.sh
```

访问 http://localhost:5173 开始你的恋爱助手之旅！

---

Made with ❤️ | 2025

