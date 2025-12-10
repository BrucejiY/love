// API 配置

// 根据环境变量或默认值设置 API URL
export const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'

// 是否使用本地 API（开发模式）
export const IS_LOCAL = !import.meta.env.VITE_API_URL

console.log('🔗 API Base URL:', API_BASE_URL)
console.log('🏠 Is Local:', IS_LOCAL)

