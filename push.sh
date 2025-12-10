#!/bin/bash

# 朋友圈恋爱助手 - 推送到 GitHub 脚本

echo "🚀 准备推送到 GitHub..."
echo ""

# 检查是否已配置远程仓库
if ! git remote get-url origin > /dev/null 2>&1; then
    echo "❌ 未配置远程仓库"
    echo "正在添加远程仓库..."
    git remote add origin https://github.com/BrucejiY/love.git
fi

echo "📍 远程仓库: $(git remote get-url origin)"
echo ""

# 检查是否有未提交的更改
if [ -n "$(git status --porcelain)" ]; then
    echo "⚠️  检测到未提交的更改"
    read -p "是否先提交这些更改? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        git add .
        git commit -m "chore: 更新项目文件"
    fi
fi

# 检查当前分支
CURRENT_BRANCH=$(git branch --show-current)
echo "📌 当前分支: $CURRENT_BRANCH"
echo ""

# 尝试推送
echo "📤 开始推送..."
echo ""

# 方法1: 尝试直接推送（如果已配置凭证）
if git push -u origin $CURRENT_BRANCH 2>&1; then
    echo ""
    echo "✅ 推送成功！"
    echo "🌐 查看仓库: https://github.com/BrucejiY/love"
    exit 0
fi

echo ""
echo "⚠️  推送失败，需要身份验证"
echo ""
echo "请选择身份验证方式："
echo ""
echo "方案 1: 使用 Personal Access Token（推荐）"
echo "  1. 访问: https://github.com/settings/tokens"
echo "  2. 生成新 token (classic)"
echo "  3. 勾选 'repo' 权限"
echo "  4. 复制 token"
echo "  5. 运行以下命令："
echo "     git remote set-url origin https://YOUR_TOKEN@github.com/BrucejiY/love.git"
echo "     git push -u origin $CURRENT_BRANCH"
echo ""
echo "方案 2: 使用 SSH"
echo "  1. 生成 SSH key: ssh-keygen -t ed25519 -C 'your_email@example.com'"
echo "  2. 添加公钥到 GitHub: https://github.com/settings/keys"
echo "  3. 运行以下命令："
echo "     git remote set-url origin git@github.com:BrucejiY/love.git"
echo "     git push -u origin $CURRENT_BRANCH"
echo ""
echo "方案 3: 使用 GitHub CLI"
echo "  1. 安装: brew install gh"
echo "  2. 登录: gh auth login"
echo "  3. 推送: git push -u origin $CURRENT_BRANCH"
echo ""

