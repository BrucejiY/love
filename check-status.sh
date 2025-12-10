#!/bin/bash

echo "🔍 检查项目状态..."
echo ""

# 检查端口
echo "📡 检查端口占用："
if lsof -ti:3000 > /dev/null 2>&1; then
    echo "  ✅ 端口 3000 (前端) - 已占用"
else
    echo "  ❌ 端口 3000 (前端) - 未占用"
fi

if lsof -ti:3001 > /dev/null 2>&1; then
    echo "  ✅ 端口 3001 (后端) - 已占用"
else
    echo "  ❌ 端口 3001 (后端) - 未占用"
fi
echo ""

# 检查进程
echo "🔧 检查进程："
FRONTEND_PID=$(lsof -ti:3000 2>/dev/null)
BACKEND_PID=$(lsof -ti:3001 2>/dev/null)

if [ -n "$FRONTEND_PID" ]; then
    echo "  前端进程 PID: $FRONTEND_PID"
    ps -p $FRONTEND_PID -o command= | head -1
fi

if [ -n "$BACKEND_PID" ]; then
    echo "  后端进程 PID: $BACKEND_PID"
    ps -p $BACKEND_PID -o command= | head -1
fi
echo ""

# 测试连接
echo "🌐 测试服务连接："

# 测试前端
if curl -s http://localhost:3000 > /dev/null 2>&1; then
    echo "  ✅ 前端 (http://localhost:3000) - 可访问"
else
    echo "  ❌ 前端 (http://localhost:3000) - 无法访问"
fi

# 测试后端
if curl -s http://localhost:3001 > /dev/null 2>&1; then
    echo "  ✅ 后端 (http://localhost:3001) - 可访问"
else
    echo "  ❌ 后端 (http://localhost:3001) - 无法访问"
fi
echo ""

# 检查配置文件
echo "📝 检查配置："
if [ -f "backend/.env" ]; then
    if grep -q "ARK_API_KEY=" backend/.env && ! grep -q "ARK_API_KEY=your_api_key" backend/.env; then
        echo "  ✅ .env 文件已配置"
    else
        echo "  ⚠️  .env 文件存在但 API Key 未配置"
    fi
else
    echo "  ❌ .env 文件不存在"
fi
echo ""

# 提供建议
echo "💡 建议："
if ! lsof -ti:3000 > /dev/null 2>&1; then
    echo "  1. 启动前端: cd frontend && npm run dev"
fi
if ! lsof -ti:3001 > /dev/null 2>&1; then
    echo "  2. 启动后端: cd backend && npm run dev"
fi
echo ""
echo "  或者使用启动脚本: ./start.sh"
echo ""

