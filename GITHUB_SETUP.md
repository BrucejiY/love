# GitHub 项目设置指南

本文档帮助你将项目同步到 GitHub。

## 📋 准备工作

### 1. 创建必要的配置文件

在 `backend` 目录下创建 `.env.example` 文件（如果还没有）：

```bash
cd backend
cat > .env.example << 'EOF'
# 豆包大模型 API 配置
# 在火山引擎控制台获取: https://console.volcengine.com/ark
ARK_API_KEY=your_api_key_here

# API 基础地址（默认即可）
ARK_BASE_URL=https://ark.cn-beijing.volces.com/api/v3

# 服务器配置
PORT=3001
NODE_ENV=development

# 上传目录
UPLOAD_DIR=./uploads
EOF
```

### 2. 检查 .gitignore

确保 `.gitignore` 文件包含以下内容（已包含）：

```
.env
backend/uploads/
node_modules/
dist/
```

## 🚀 同步到 GitHub

### 步骤 1: 初始化 Git 仓库（如果还没有）

```bash
cd /Users/bruce/Desktop/demo

# 初始化 Git（如果还没有）
git init

# 添加所有文件
git add .

# 首次提交
git commit -m "feat: 初始化朋友圈恋爱助手项目

- ✨ 实现图片上传功能
- ✨ 集成豆包大模型 API
- ✨ 完成分析报告页面
- 🎨 采用 Apple 设计风格
- 📝 添加完整文档
"
```

### 步骤 2: 在 GitHub 创建仓库

1. 访问 [GitHub](https://github.com/new)
2. 创建新仓库：
   - **仓库名称**：`moments-love-assistant` 或其他你喜欢的名称
   - **描述**：朋友圈恋爱助手 - 基于 AI 的恋爱分析工具
   - **可见性**：选择 Public（公开）或 Private（私有）
   - **不要**勾选 "Initialize this repository with a README"
3. 点击 "Create repository"

### 步骤 3: 连接远程仓库并推送

```bash
# 添加远程仓库（替换为你的 GitHub 用户名）
git remote add origin https://github.com/YOUR_USERNAME/moments-love-assistant.git

# 推送到 GitHub
git branch -M main
git push -u origin main
```

### 步骤 4: 配置仓库设置

1. **添加仓库描述**：
   - 进入仓库的 Settings > General
   - 添加 Description: "💕 朋友圈恋爱助手 - 基于豆包大模型的 AI 恋爱分析工具"
   - 添加 Topics: `ai`, `love-assistant`, `vue3`, `nodejs`, `doubao`

2. **设置 GitHub Pages**（可选，用于展示）：
   - Settings > Pages
   - Source: Deploy from a branch
   - Branch: main / docs（如果你想部署静态页面）

3. **添加 LICENSE**：
   - 项目已包含 MIT License
   - 可以在 GitHub 上确认

## 📝 README 徽章（可选）

可以在 README.md 顶部添加徽章：

```markdown
![GitHub stars](https://img.shields.io/github/stars/YOUR_USERNAME/moments-love-assistant?style=social)
![GitHub forks](https://img.shields.io/github/forks/YOUR_USERNAME/moments-love-assistant?style=social)
![GitHub issues](https://img.shields.io/github/issues/YOUR_USERNAME/moments-love-assistant)
![License](https://img.shields.io/github/license/YOUR_USERNAME/moments-love-assistant)
```

## 🔐 安全提醒

### 重要：保护你的 API Key

1. **永远不要提交 `.env` 文件到 Git**
   - `.env` 已在 `.gitignore` 中
   - 只提交 `.env.example` 模板

2. **如果不小心提交了密钥**：
   ```bash
   # 从历史中移除敏感文件
   git filter-branch --force --index-filter \
     "git rm --cached --ignore-unmatch backend/.env" \
     --prune-empty --tag-name-filter cat -- --all
   
   # 强制推送（谨慎使用）
   git push origin --force --all
   
   # 立即更换 API Key
   ```

3. **检查提交内容**：
   ```bash
   # 提交前检查将要提交的内容
   git status
   git diff --staged
   ```

## 📊 项目维护

### 定期更新

```bash
# 添加更改
git add .

# 提交更改
git commit -m "feat: 添加新功能" 
# 或
git commit -m "fix: 修复某个bug"
# 或
git commit -m "docs: 更新文档"

# 推送到 GitHub
git push
```

### 提交信息规范

建议使用 Conventional Commits 规范：

- `feat:` - 新功能
- `fix:` - 修复 bug
- `docs:` - 文档更新
- `style:` - 代码格式调整
- `refactor:` - 代码重构
- `perf:` - 性能优化
- `test:` - 测试相关
- `chore:` - 构建/工具相关

## 🌟 推广项目

### 1. 添加项目主页

在 GitHub 仓库页面添加：
- Description（描述）
- Website（如果部署了在线版本）
- Topics（标签）

### 2. 创建 Release

```bash
# 创建标签
git tag -a v1.0.0 -m "Release version 1.0.0"

# 推送标签
git push origin v1.0.0
```

然后在 GitHub 上：
- 进入 Releases
- 点击 "Draft a new release"
- 选择标签 v1.0.0
- 填写 Release notes
- 发布

### 3. 分享到社区

- Product Hunt
- V2EX
- 掘金
- 知乎
- Twitter/微博

## ⚙️ GitHub Actions（可选）

可以添加自动化工作流：

创建 `.github/workflows/ci.yml`：

```yaml
name: CI

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
    
    - name: Install dependencies (Frontend)
      run: |
        cd frontend
        npm install
    
    - name: Build Frontend
      run: |
        cd frontend
        npm run build
    
    - name: Install dependencies (Backend)
      run: |
        cd backend
        npm install
```

## 📞 需要帮助？

- 提交 Issue: [项目 Issues 页面]
- 查看文档: README.md
- 联系维护者: [你的联系方式]

---

祝你的项目在 GitHub 上获得成功！⭐

