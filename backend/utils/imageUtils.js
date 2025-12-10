import fs from 'fs/promises'

/**
 * 将图片转换为 base64 编码
 * @param {string} imagePath - 图片路径
 * @returns {Promise<string>} base64 编码的图片
 */
export async function convertImageToBase64(imagePath) {
  try {
    const imageBuffer = await fs.readFile(imagePath)
    return imageBuffer.toString('base64')
  } catch (err) {
    console.error('读取图片失败:', err)
    throw new Error('图片处理失败')
  }
}

/**
 * 检查文件是否存在
 * @param {string} filePath - 文件路径
 * @returns {Promise<boolean>}
 */
export async function fileExists(filePath) {
  try {
    await fs.access(filePath)
    return true
  } catch {
    return false
  }
}

