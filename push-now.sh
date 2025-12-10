#!/bin/bash

# 推送代码到 GitHub

cd /Users/bruce/Desktop/demo

echo "🚀 开始推送到 GitHub..."
echo ""

# 检查是否已配置远程仓库
if ! git remote get-url origin > /dev/null 2>&1; then
    echo "配置远程仓库..."
    git remote add origin https://github.com/BrucejiY/love.git
fi

echo "✅ 远程仓库已配置"
echo ""

# 推送代码
echo "📤 正在推送..."
if git push -u origin main; then
    echo ""
    echo "✅ 推送成功！"
    echo "🌐 查看仓库: https://github.com/BrucejiY/love"
    echo ""
    echo "💡 提示: 推送完成后，建议撤销这个 token 或设置过期时间"
    echo "   访问: https://github.com/settings/tokens"
else
    echo ""
    echo "❌ 推送失败"
    echo ""
    echo "可能的原因："
    echo "1. 网络连接问题 - 请检查网络后重试"
    echo "2. Token 已过期 - 请生成新的 token"
    echo "3. Token 权限不足 - 确保勾选了 'repo' 权限"
    echo ""
    echo "重试命令: ./push-now.sh"
fi

