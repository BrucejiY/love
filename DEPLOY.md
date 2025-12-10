# 部署文档 🚀

本文档详细说明如何将「朋友圈恋爱助手」部署到生产环境。

## 目录

- [前端部署](#前端部署)
  - [Vercel 部署](#vercel-部署)
  - [Netlify 部署](#netlify-部署)
- [后端部署](#后端部署)
  - [云服务器部署](#云服务器部署)
  - [Docker 部署](#docker-部署)
- [域名配置](#域名配置)
- [HTTPS 配置](#https-配置)
- [性能优化](#性能优化)

---

## 前端部署

### Vercel 部署

Vercel 是推荐的前端部署平台，部署简单且免费。

#### 步骤 1：准备工作

1. 将代码推送到 GitHub
2. 注册 [Vercel 账号](https://vercel.com)
3. 连接 GitHub 账号

#### 步骤 2：导入项目

1. 在 Vercel 控制台点击「New Project」
2. 选择你的 GitHub 仓库
3. 配置项目：
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

#### 步骤 3：环境变量配置

在 Vercel 项目设置中添加环境变量：

```
VITE_API_BASE_URL=https://your-backend-domain.com
```

#### 步骤 4：部署

点击「Deploy」，等待部署完成。

#### 步骤 5：自定义域名（可选）

在 Vercel 项目设置 → Domains 中添加自定义域名。

---

### Netlify 部署

#### 步骤 1：登录 Netlify

1. 访问 [Netlify](https://netlify.com)
2. 连接 GitHub 账号

#### 步骤 2：导入项目

1. 点击「Add new site」→「Import an existing project」
2. 选择 GitHub 仓库
3. 配置构建设置：
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/dist`

#### 步骤 3：环境变量

在 Site settings → Environment variables 中添加：

```
VITE_API_BASE_URL=https://your-backend-domain.com
```

#### 步骤 4：部署

点击「Deploy site」完成部署。

---

## 后端部署

### 云服务器部署

推荐使用阿里云、腾讯云或 AWS 等云服务商。

#### 步骤 1：购买云服务器

- **配置建议**：2核 4GB 内存，5M 带宽
- **操作系统**：Ubuntu 22.04 LTS
- **地域**：选择离用户最近的地域

#### 步骤 2：安装环境

```bash
# 更新系统
sudo apt update && sudo apt upgrade -y

# 安装 Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# 验证安装
node -v  # 应显示 v18.x.x
npm -v

# 安装 PM2（进程管理器）
sudo npm install -g pm2

# 安装 Git
sudo apt install -y git
```

#### 步骤 3：克隆项目

```bash
# 克隆代码
cd /var/www
sudo git clone https://github.com/yourusername/moments-love-assistant.git
cd moments-love-assistant/backend

# 设置权限
sudo chown -R $USER:$USER /var/www/moments-love-assistant
```

#### 步骤 4：配置环境

```bash
# 安装依赖
npm install --production

# 配置环境变量
nano .env
```

填写以下内容：

```env
ARK_API_KEY=your_actual_api_key
ARK_BASE_URL=https://ark.cn-beijing.volces.com/api/v3
PORT=3001
NODE_ENV=production
UPLOAD_DIR=./uploads
```

#### 步骤 5：启动服务

```bash
# 使用 PM2 启动
pm2 start server.js --name moments-backend

# 设置开机自启
pm2 startup
pm2 save

# 查看日志
pm2 logs moments-backend

# 查看状态
pm2 status
```

#### 步骤 6：配置 Nginx

```bash
# 安装 Nginx
sudo apt install -y nginx

# 创建配置文件
sudo nano /etc/nginx/sites-available/moments-backend
```

配置内容：

```nginx
server {
    listen 80;
    server_name api.yourdomain.com;

    # 文件上传大小限制
    client_max_body_size 50M;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # 超时设置
        proxy_connect_timeout 300s;
        proxy_send_timeout 300s;
        proxy_read_timeout 300s;
    }
}
```

启用配置：

```bash
# 创建软链接
sudo ln -s /etc/nginx/sites-available/moments-backend /etc/nginx/sites-enabled/

# 测试配置
sudo nginx -t

# 重启 Nginx
sudo systemctl restart nginx

# 设置开机自启
sudo systemctl enable nginx
```

#### 步骤 7：配置防火墙

```bash
# 允许 HTTP 和 HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 22/tcp  # SSH

# 启用防火墙
sudo ufw enable

# 查看状态
sudo ufw status
```

---

### Docker 部署

#### 步骤 1：创建 Dockerfile

**前端 Dockerfile** (`frontend/Dockerfile`)：

```dockerfile
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**后端 Dockerfile** (`backend/Dockerfile`)：

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --production

COPY . .

RUN mkdir -p uploads

EXPOSE 3001

CMD ["node", "server.js"]
```

#### 步骤 2：创建 docker-compose.yml

```yaml
version: '3.8'

services:
  backend:
    build: ./backend
    container_name: moments-backend
    ports:
      - "3001:3001"
    environment:
      - ARK_API_KEY=${ARK_API_KEY}
      - ARK_BASE_URL=${ARK_BASE_URL}
      - NODE_ENV=production
    volumes:
      - ./backend/uploads:/app/uploads
    restart: unless-stopped

  frontend:
    build: ./frontend
    container_name: moments-frontend
    ports:
      - "80:80"
    depends_on:
      - backend
    restart: unless-stopped
```

#### 步骤 3：部署

```bash
# 创建 .env 文件
echo "ARK_API_KEY=your_key" > .env
echo "ARK_BASE_URL=https://ark.cn-beijing.volces.com/api/v3" >> .env

# 构建并启动
docker-compose up -d

# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down
```

---

## 域名配置

### 1. 购买域名

在阿里云、腾讯云或 GoDaddy 等平台购买域名。

### 2. 配置 DNS 解析

添加 A 记录：

| 类型 | 主机记录 | 记录值 | TTL |
|------|---------|--------|-----|
| A | @ | 服务器IP | 600 |
| A | www | 服务器IP | 600 |
| A | api | 服务器IP | 600 |

### 3. 备案（中国大陆服务器）

如果服务器在中国大陆，需要进行 ICP 备案。

---

## HTTPS 配置

使用 Let's Encrypt 免费 SSL 证书。

### 安装 Certbot

```bash
sudo apt install -y certbot python3-certbot-nginx
```

### 获取证书

```bash
# 为域名申请证书
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com -d api.yourdomain.com

# 按提示输入邮箱并同意协议
```

### 自动续期

```bash
# 测试续期
sudo certbot renew --dry-run

# Certbot 会自动配置定时任务
```

### 验证 HTTPS

访问 `https://yourdomain.com` 确认 HTTPS 正常工作。

---

## 性能优化

### 1. 启用 Gzip 压缩

编辑 Nginx 配置：

```nginx
gzip on;
gzip_vary on;
gzip_proxied any;
gzip_comp_level 6;
gzip_types text/plain text/css text/xml text/javascript 
           application/json application/javascript application/xml+rss 
           application/rss+xml font/truetype font/opentype 
           application/vnd.ms-fontobject image/svg+xml;
```

### 2. 配置缓存

```nginx
location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

### 3. CDN 加速

使用阿里云 CDN 或 CloudFlare 加速静态资源。

### 4. 数据库优化（如果使用）

- 添加适当的索引
- 使用连接池
- 启用查询缓存

### 5. PM2 集群模式

```bash
pm2 start server.js -i max --name moments-backend
```

---

## 监控与维护

### 1. PM2 监控

```bash
# 查看状态
pm2 status

# 查看日志
pm2 logs

# 监控面板
pm2 monit
```

### 2. 日志管理

```bash
# PM2 日志轮转
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
```

### 3. 定期备份

```bash
# 创建备份脚本
nano backup.sh
```

```bash
#!/bin/bash
BACKUP_DIR="/var/backups/moments"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

# 备份代码
tar -czf $BACKUP_DIR/code_$DATE.tar.gz /var/www/moments-love-assistant

# 备份环境变量
cp /var/www/moments-love-assistant/backend/.env $BACKUP_DIR/env_$DATE

# 删除 30 天前的备份
find $BACKUP_DIR -mtime +30 -delete

echo "备份完成: $DATE"
```

```bash
# 设置定时任务
chmod +x backup.sh
crontab -e

# 每天凌晨 2 点备份
0 2 * * * /path/to/backup.sh
```

### 4. 更新部署

```bash
# 拉取最新代码
cd /var/www/moments-love-assistant
git pull origin main

# 后端更新
cd backend
npm install --production
pm2 restart moments-backend

# 前端更新（如果需要）
cd ../frontend
npm install
npm run build
# 将 dist 目录内容部署到静态服务器
```

---

## 故障排查

### 问题 1：后端无法启动

```bash
# 查看日志
pm2 logs moments-backend

# 检查端口占用
sudo netstat -tlnp | grep 3001

# 检查环境变量
cat backend/.env
```

### 问题 2：Nginx 502 错误

```bash
# 检查后端服务是否运行
pm2 status

# 查看 Nginx 错误日志
sudo tail -f /var/log/nginx/error.log

# 重启服务
pm2 restart moments-backend
sudo systemctl restart nginx
```

### 问题 3：上传文件失败

```bash
# 检查上传目录权限
ls -la backend/uploads

# 修改权限
chmod 755 backend/uploads

# 检查 Nginx 上传大小限制
grep client_max_body_size /etc/nginx/nginx.conf
```

---

## 安全建议

1. ✅ 定期更新系统和依赖包
2. ✅ 使用强密码和 SSH 密钥登录
3. ✅ 禁用 root 直接登录
4. ✅ 配置防火墙规则
5. ✅ 启用 HTTPS
6. ✅ 定期备份数据
7. ✅ 监控异常访问
8. ✅ 限制 API 调用频率

---

## 成本估算

### 基础配置（个人/小型项目）

- 云服务器：¥100-200/月（2核4G）
- 域名：¥50-100/年
- 豆包 API：按调用量计费，预估 ¥100-500/月
- **总计**：约 ¥250-750/月

### 优化建议

- 使用 Vercel/Netlify 免费托管前端
- 使用按量付费的 Serverless 服务
- 合理控制 API 调用频率

---

如有问题，欢迎提交 Issue 或联系技术支持。

祝部署顺利！🎉

