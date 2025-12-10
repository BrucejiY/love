import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs/promises'
import dotenv from 'dotenv'
import analyzeRouter from './routes/analyze.js'
import { uploadDir } from './config/upload.js'

// ES Module 中获取 __dirname
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 加载环境变量
dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

// 创建上传目录
try {
  await fs.access(uploadDir)
} catch {
  await fs.mkdir(uploadDir, { recursive: true })
}

// 中间件
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// 静态文件服务
app.use('/uploads', express.static(uploadDir))

// 路由
app.get('/', (req, res) => {
  res.json({
    message: '朋友圈恋爱助手 API',
    version: '1.0.0',
    status: 'running'
  })
})

app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString()
  })
})

app.use('/api', analyzeRouter)

// 错误处理
app.use((err, req, res, next) => {
  console.error('Error:', err)
  res.status(err.status || 500).json({
    error: err.message || '服务器内部错误',
    status: err.status || 500
  })
})

// 启动服务器
app.listen(PORT, () => {
  console.log(`🚀 服务器运行在 http://localhost:${PORT}`)
  console.log(`📁 上传目录: ${uploadDir}`)
  console.log(`🤖 豆包 API: ${process.env.ARK_API_KEY ? '已配置' : '未配置 (请设置 ARK_API_KEY)'}`)
})

// 定期清理旧文件（24小时后删除）
const cleanupOldFiles = async () => {
  try {
    const files = await fs.readdir(uploadDir)
    const now = Date.now()
    const twentyFourHours = 24 * 60 * 60 * 1000

    for (const file of files) {
      const filePath = path.join(uploadDir, file)
      const stats = await fs.stat(filePath)
      
      if (now - stats.mtimeMs > twentyFourHours) {
        await fs.unlink(filePath)
        console.log(`🗑️  已删除过期文件: ${file}`)
      }
    }
  } catch (err) {
    console.error('清理文件失败:', err)
  }
}

// 每小时清理一次
setInterval(cleanupOldFiles, 60 * 60 * 1000)

