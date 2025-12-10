import express from 'express'
import { upload } from '../config/upload.js'
import { analyzeWithDoubao } from '../services/doubao.js'
import { convertImageToBase64 } from '../utils/imageUtils.js'

const router = express.Router()

// 分析接口
router.post('/analyze', upload.array('images', 20), async (req, res) => {
  try {
    // 检查上传的文件
    if (!req.files || req.files.length < 5) {
      return res.status(400).json({
        error: '请至少上传 5 张图片'
      })
    }

    console.log(`📸 收到 ${req.files.length} 张图片`)

    // 将图片转换为 base64（豆包API格式）
    const imageDataList = []
    for (const file of req.files) {
      try {
        const base64 = await convertImageToBase64(file.path)
        imageDataList.push({
          type: 'input_image',
          image_url: `data:${file.mimetype};base64,${base64}`
        })
      } catch (err) {
        console.error(`处理图片失败 ${file.filename}:`, err)
      }
    }

    if (imageDataList.length === 0) {
      return res.status(400).json({
        error: '图片处理失败'
      })
    }

    console.log('🤖 开始调用豆包 AI 分析...')

    // 调用豆包 AI 进行分析
    const analysisResult = await analyzeWithDoubao(imageDataList)

    console.log('✅ 分析完成')

    res.json(analysisResult)

  } catch (err) {
    console.error('❌ 分析失败详情:', {
      message: err.message,
      stack: err.stack,
      response: err.response?.data
    })
    res.status(500).json({
      error: err.message || '分析失败，请重试',
      details: process.env.NODE_ENV === 'development' ? err.stack : undefined
    })
  }
})

export default router

