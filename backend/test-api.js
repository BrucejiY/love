// 测试豆包API调用
import axios from 'axios'
import dotenv from 'dotenv'

dotenv.config()

const ARK_API_KEY = process.env.ARK_API_KEY
const ARK_BASE_URL = process.env.ARK_BASE_URL || 'https://ark.cn-beijing.volces.com/api/v3'
const MODEL = 'doubao-seed-1-6-thinking-250715'

async function testAPI() {
  console.log('🧪 测试豆包API调用...')
  console.log('API Key:', ARK_API_KEY ? ARK_API_KEY.substring(0, 10) + '...' : '未配置')
  console.log('模型:', MODEL)
  console.log('')

  try {
    const response = await axios.post(
      `${ARK_BASE_URL}/responses`,
      {
        model: MODEL,
        input: [
          {
            role: 'user',
            content: [
              {
                type: 'input_text',
                text: '你好，请简单介绍一下你自己。'
              }
            ]
          }
        ]
      },
      {
        headers: {
          'Authorization': `Bearer ${ARK_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000
      }
    )

    console.log('✅ API调用成功！')
    console.log('响应状态:', response.status)
    console.log('响应数据结构:')
    console.log(JSON.stringify(response.data, null, 2).substring(0, 1000))
    console.log('')
    
    // 尝试提取文本
    let text = ''
    if (response.data.output) {
      text = response.data.output
    } else if (response.data.type === 'reasoning' && response.data.summary) {
      text = response.data.summary[0]?.summary_text?.text || response.data.summary[0]?.text || ''
    } else if (response.data.choices) {
      text = response.data.choices[0]?.message?.content || ''
    }
    
    console.log('提取的文本:', text.substring(0, 200))
    
  } catch (error) {
    console.error('❌ API调用失败')
    console.error('错误:', error.message)
    if (error.response) {
      console.error('状态码:', error.response.status)
      console.error('响应数据:', JSON.stringify(error.response.data, null, 2))
    }
  }
}

testAPI()

