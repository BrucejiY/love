# 🚀 快速推送到 GitHub

## 最简单的方法：使用 Personal Access Token

### 步骤 1: 获取 Token（1分钟）

1. 打开浏览器访问：**https://github.com/settings/tokens**
2. 点击 **"Generate new token"** > **"Generate new token (classic)"**
3. 填写：
   - **Note**: `love项目`
   - **Expiration**: 选择 `No expiration` 或 `90 days`
   - **Select scopes**: ✅ 勾选 **`repo`**（完整仓库权限）
4. 点击 **"Generate token"**
5. **立即复制 token**（类似：`ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`）

### 步骤 2: 推送代码（复制粘贴以下命令）

```bash
cd /Users/bruce/Desktop/demo

# 将 YOUR_TOKEN 替换为你刚才复制的 token
git remote set-url origin https://YOUR_TOKEN@github.com/BrucejiY/love.git

# 推送
git push -u origin main
```

**示例**（假设你的 token 是 `ghp_abc123...`）：
```bash
git remote set-url origin https://ghp_abc123...@github.com/BrucejiY/love.git
git push -u origin main
```

---

## ✅ 推送成功后

访问：**https://github.com/BrucejiY/love**

你应该能看到所有项目文件！

---

## 🔒 安全提示

- Token 只显示一次，请妥善保存
- 不要将 token 分享给他人
- 如果 token 泄露，立即在 GitHub 设置中撤销

---

## ❓ 遇到问题？

如果推送失败，检查：
1. Token 是否正确复制（没有多余空格）
2. Token 是否有 `repo` 权限
3. 网络连接是否正常

