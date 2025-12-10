#!/bin/bash

# 朋友圈恋爱助手 - 安装脚本

echo "🚀 开始安装朋友圈恋爱助手..."
echo ""

# 检查 Node.js
if ! command -v node &> /dev/null; then
    echo "❌ 未检测到 Node.js，请先安装 Node.js 18+"
    exit 1
fi

echo "✅ Node.js 版本: $(node -v)"
echo ""

# 修复 npm 权限问题（如果需要）
echo "🔧 检查 npm 权限..."
if [ -d "$HOME/.npm" ]; then
    echo "正在修复 npm 缓存权限（可能需要输入密码）..."
    sudo chown -R $(whoami) "$HOME/.npm"
fi
echo ""

# 安装前端依赖
echo "📦 安装前端依赖..."
cd frontend
npm install
if [ $? -ne 0 ]; then
    echo "❌ 前端依赖安装失败"
    exit 1
fi
echo "✅ 前端依赖安装完成"
echo ""

# 安装后端依赖
echo "📦 安装后端依赖..."
cd ../backend
npm install
if [ $? -ne 0 ]; then
    echo "❌ 后端依赖安装失败"
    exit 1
fi
echo "✅ 后端依赖安装完成"
echo ""

# 检查 .env 配置
if [ ! -f ".env" ]; then
    echo "⚠️  未发现 .env 配置文件"
    if [ -f ".env.example" ]; then
        cp .env.example .env
        echo "✅ 已从 .env.example 创建 .env 文件"
        echo "⚠️  请编辑 backend/.env 文件，填入你的豆包 API Key"
    else
        echo "❌ 未发现 .env.example 文件"
    fi
else
    echo "✅ .env 配置文件已存在"
fi
echo ""

cd ..

echo "🎉 安装完成！"
echo ""
echo "下一步："
echo "1. 编辑 backend/.env 文件，确认 API Key 已配置"
echo "2. 运行 ./start.sh 启动项目"
echo ""

