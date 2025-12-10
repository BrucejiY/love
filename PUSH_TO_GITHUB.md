# 推送到 GitHub 指南

## 方案 1: 使用 Personal Access Token（推荐）

### 步骤 1: 创建 GitHub Token

1. 访问 GitHub: https://github.com/settings/tokens
2. 点击 "Generate new token" > "Generate new token (classic)"
3. 设置：
   - **Note**: `love项目推送`
   - **Expiration**: 选择过期时间（建议 90 天或 No expiration）
   - **Scopes**: 勾选 `repo`（完整仓库权限）
4. 点击 "Generate token"
5. **重要**: 立即复制 token（只显示一次！）

### 步骤 2: 使用 Token 推送

```bash
cd /Users/bruce/Desktop/demo

# 更新远程仓库 URL，使用 token
git remote set-url origin https://YOUR_TOKEN@github.com/BrucejiY/love.git

# 推送代码
git push -u origin main
```

**或者**在推送时输入 token：

```bash
# 当提示输入用户名时，输入你的 GitHub 用户名
# 当提示输入密码时，粘贴你的 token（不是密码！）
git push -u origin main
```

---

## 方案 2: 配置 SSH（长期使用）

### 步骤 1: 生成 SSH 密钥

```bash
# 生成 SSH 密钥（如果还没有）
ssh-keygen -t ed25519 -C "your_email@example.com"

# 按 Enter 使用默认路径
# 可以设置密码或直接按 Enter（无密码）
```

### 步骤 2: 添加 SSH 密钥到 GitHub

```bash
# 复制公钥
cat ~/.ssh/id_ed25519.pub

# 复制输出的内容，然后：
# 1. 访问 https://github.com/settings/keys
# 2. 点击 "New SSH key"
# 3. Title: 输入描述（如 "MacBook"）
# 4. Key: 粘贴刚才复制的公钥
# 5. 点击 "Add SSH key"
```

### 步骤 3: 更新远程仓库为 SSH

```bash
cd /Users/bruce/Desktop/demo

# 改为 SSH URL
git remote set-url origin git@github.com:BrucejiY/love.git

# 测试连接
ssh -T git@github.com

# 推送
git push -u origin main
```

---

## 方案 3: 使用 GitHub CLI（最简单）

```bash
# 安装 GitHub CLI（如果还没有）
brew install gh

# 登录
gh auth login

# 选择 GitHub.com
# 选择 HTTPS
# 选择浏览器登录或 token

# 推送
git push -u origin main
```

---

## 当前状态

✅ Git 仓库已初始化
✅ 所有文件已提交
✅ 远程仓库已添加: https://github.com/BrucejiY/love.git
⏳ 等待身份验证后推送

## 快速推送命令

选择一种方案后，运行：

```bash
cd /Users/bruce/Desktop/demo
git push -u origin main
```

---

## 验证推送成功

推送成功后，访问：
https://github.com/BrucejiY/love

你应该能看到所有项目文件。

