#!/bin/bash

# 测试 Vercel 后端 API
echo "🧪 测试 Vercel 后端 API..."
echo ""

# 从用户提供的 URL 推断后端地址
BACKEND_URL="https://love-api-sand.vercel.app"

echo "📍 后端地址: $BACKEND_URL"
echo ""

# 测试 1: 健康检查
echo "1️⃣ 测试健康检查端点..."
curl -s "$BACKEND_URL/api/health" | jq . || echo "❌ 健康检查失败"
echo ""
echo ""

# 测试 2: 根路径
echo "2️⃣ 测试根路径..."
curl -s "$BACKEND_URL/" | jq . || echo "❌ 根路径访问失败"
echo ""
echo ""

# 测试 3: 测试图片上传（需要真实图片）
echo "3️⃣ 测试图片上传..."
echo "⚠️  需要手动测试（需要上传至少 5 张图片）"
echo ""

echo "✅ 测试完成"
echo ""
echo "💡 如果上述测试都通过，请在前端页面测试完整流程"

