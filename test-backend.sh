#!/bin/bash

echo "🔍 诊断后端 API 状态..."
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

BACKEND_URL="https://love-api-sand.vercel.app"

# 测试 1: 根路径
echo "1️⃣ 测试根路径"
echo "URL: $BACKEND_URL/"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
curl -s -w "\nHTTP Status: %{http_code}\n" "$BACKEND_URL/" | head -20
echo ""
echo ""

# 测试 2: 健康检查
echo "2️⃣ 测试健康检查"
echo "URL: $BACKEND_URL/api/health"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
curl -s -w "\nHTTP Status: %{http_code}\n" "$BACKEND_URL/api/health"
echo ""
echo ""

# 测试 3: 分析端点（应该返回 400 错误，因为没有上传文件）
echo "3️⃣ 测试分析端点（无文件，预期 400 错误）"
echo "URL: $BACKEND_URL/api/analyze"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
curl -s -w "\nHTTP Status: %{http_code}\n" -X POST "$BACKEND_URL/api/analyze"
echo ""
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ 测试完成"
echo ""
echo "💡 预期结果："
echo "  - 根路径: 返回 JSON，状态码 200"
echo "  - 健康检查: 返回 {\"status\":\"healthy\"...}, 状态码 200"
echo "  - 分析端点: 返回错误信息，状态码 400"
echo ""
echo "如果都是 200/400，说明后端正常运行"
echo "如果是 500，说明后端代码有问题"
echo "如果是 404，说明路由配置有问题"

