# 🔧 修复前端 API 调用问题

## 🎯 问题原因

前端部署到 Vercel 后，**没有配置 `VITE_API_URL` 环境变量**，导致：
- 前端使用默认值 `/api`
- API 请求发送到前端域名 `love-r7cq.vercel.app/api` ❌
- 实际应该发送到后端域名 `love-api-sand.vercel.app` ✅

---

## ✅ 解决方案：配置前端环境变量

### 步骤 1: 进入前端项目设置

1. 访问 [Vercel Dashboard](https://vercel.com/dashboard)
2. 找到并点击 **`love-r7cq`** 项目（前端）
3. 点击顶部的 **"Settings"** 标签

---

### 步骤 2: 添加环境变量

1. 在左侧菜单中点击 **"Environment Variables"**
2. 点击 **"Add New"** 按钮
3. 填写以下信息：

   | 字段 | 值 |
   |------|-----|
   | **Name** | `VITE_API_URL` |
   | **Value** | `https://love-api-sand.vercel.app` |
   | **Environment** | ✅ Production<br>✅ Preview<br>✅ Development |

4. 点击 **"Save"** 按钮

---

### 步骤 3: 重新部署前端

配置保存后，需要重新部署前端：

#### 方式 1: 自动触发（推荐）
1. 在项目页面点击 **"Deployments"** 标签
2. 找到最新的部署
3. 点击右侧的 **"..."** 菜单
4. 选择 **"Redeploy"**
5. 勾选 **"Use existing Build Cache"**（可选）
6. 点击 **"Redeploy"**

#### 方式 2: 推送代码触发
```bash
cd /Users/bruce/Desktop/demo
git commit --allow-empty -m "chore: 触发重新部署"
git push
```

---

### 步骤 4: 验证配置

重新部署完成后（约 1-2 分钟），测试：

1. 访问 https://love-r7cq.vercel.app
2. 打开浏览器开发者工具（F12）
3. 切换到 **Console** 标签
4. 刷新页面
5. 应该看到：
   ```
   🔗 API Base URL: https://love-api-sand.vercel.app
   🏠 Is Local: false
   ```

6. 上传至少 5 张图片并开始分析
7. 切换到 **Network** 标签
8. 应该看到请求发送到：
   ```
   https://love-api-sand.vercel.app/api/analyze
   ```

---

## 📸 配置截图参考

### Environment Variables 页面应该显示：

```
Name                Value                                  Environment
────────────────────────────────────────────────────────────────────────
VITE_API_URL       https://love-api-sand.vercel.app      Production, Preview, Development
```

---

## 🆘 如果还是失败

### 检查后端 API Key

确保后端也配置了豆包 API Key：

1. 进入 **`love-api`** 项目（后端）
2. Settings → Environment Variables
3. 确认存在：

   | Name | Value |
   |------|-------|
   | `ARK_API_KEY` | `342d196d-75d2-4f41-a4ed-4de63b39bd2c` |
   | `ARK_BASE_URL` | `https://ark.cn-beijing.volces.com/api/v3` |

---

## 🧪 测试清单

- [ ] 前端环境变量已配置
- [ ] 后端环境变量已配置
- [ ] 前端已重新部署
- [ ] 浏览器控制台显示正确的 API URL
- [ ] 可以上传图片
- [ ] AI 分析正常工作

---

**完成配置后，应用就能正常工作了！** 🎉

