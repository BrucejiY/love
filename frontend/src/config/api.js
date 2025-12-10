// API 配置

// 生产环境直接使用后端 URL
const isDev = import.meta.env.DEV
const prodBackendUrl = 'https://love-api-sand.vercel.app'

// 优先使用环境变量，其次使用硬编码的生产 URL
export const API_BASE_URL = import.meta.env.VITE_API_URL || (isDev ? 'http://localhost:3001/api' : prodBackendUrl)

// 是否使用本地 API（开发模式）
export const IS_LOCAL = isDev && !import.meta.env.VITE_API_URL

console.log('🔗 API Base URL:', API_BASE_URL)
console.log('🏠 Is Local:', IS_LOCAL)
console.log('🌍 Environment:', isDev ? 'Development' : 'Production')

