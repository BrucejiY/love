import multer from 'multer'
import path from 'path'
import { fileURLToPath } from 'url'

// ES Module 中获取 __dirname
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 上传目录 - Vercel Serverless 环境使用 /tmp
export const uploadDir = process.env.VERCEL 
  ? '/tmp/uploads'
  : path.join(__dirname, '../uploads')

// 配置 multer 文件上传
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    // 确保目录存在（Vercel 需要动态创建 /tmp 子目录）
    const fs = await import('fs/promises')
    try {
      await fs.access(uploadDir)
    } catch {
      await fs.mkdir(uploadDir, { recursive: true })
    }
    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, uniqueSuffix + path.extname(file.originalname))
  }
})

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error('不支持的文件类型'), false)
  }
}

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
    files: 20
  }
})

