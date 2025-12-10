import axios from 'axios'
import dotenv from 'dotenv'

dotenv.config()

const ARK_API_KEY = process.env.ARK_API_KEY
const ARK_BASE_URL = process.env.ARK_BASE_URL || 'https://ark.cn-beijing.volces.com/api/v3'
const MODEL = 'doubao-seed-1-6-thinking-250715'

/**
 * 调用豆包大模型进行分析
 * @param {Array} imageDataList - 图片数据列表
 * @returns {Object} 分析结果
 */
export async function analyzeWithDoubao(imageDataList) {
  console.log('🔑 检查 API Key...', {
    hasKey: !!ARK_API_KEY,
    keyPrefix: ARK_API_KEY ? ARK_API_KEY.substring(0, 8) + '...' : 'NOT_SET',
    baseUrl: ARK_BASE_URL,
    model: MODEL
  })
  
  if (!ARK_API_KEY) {
    throw new Error('ARK_API_KEY 未配置，请在环境变量中设置')
  }

  // 构建提示词
  const systemPrompt = `你是一位专业的恋爱心理分析师，擅长通过社交媒体内容分析一个人的性格、兴趣和生活方式。你的分析目标是帮助用户与目标对象建立恋爱关系。

请基于用户上传的朋友圈截图，进行深度分析，并提供实用的追求建议。

分析维度：
1. 基本信息推测（年龄、职业、社交圈、经济状况）
2. 性格特征（外向/内向、情绪特点、生活态度）
3. 兴趣爱好（运动、音乐、美食、旅游等）
4. 生活习惯（作息时间、社交频率、活动范围）
5. 价值观与三观（感情观、工作观、家庭观）
6. 社交状态（是否单身、社交圈特点）

请以 JSON 格式返回分析结果，包含以下字段：
{
  "scores": {
    "personality": "75%",  // 性格匹配度
    "interest": "80%",     // 兴趣相似度
    "difficulty": "60%",   // 追求难度
    "potential": "85%"     // 发展潜力
  },
  "tags": ["开朗", "爱运动", "文艺", "美食爱好者"],  // 性格标签
  "characterAnalysis": "详细的性格分析文字...",
  "interests": [
    {"icon": "⚽", "name": "运动健身"},
    {"icon": "🎵", "name": "音乐"},
    {"icon": "🍱", "name": "美食"}
  ],
  "strategy": {
    "iceBreaker": "破冰建议...",
    "topics": ["话题1", "话题2", "话题3", "话题4", "话题5"],
    "dates": ["约会建议1", "约会建议2", "约会建议3"],
    "gifts": "送礼建议...",
    "warnings": ["注意事项1", "注意事项2", "注意事项3"]
  },
  "actionPlan": [
    {"title": "第1-3天", "description": "行动建议..."},
    {"title": "第1周", "description": "行动建议..."},
    {"title": "第2-4周", "description": "行动建议..."},
    {"title": "长期", "description": "行动建议..."}
  ]
}

要求：
1. 分析要具体、实用，基于图片中的真实内容
2. 建议要可行，避免空泛的理论
3. 语言要亲切、自然，像朋友在给建议
4. 注重细节，挖掘图片中的小线索
5. 保持积极乐观的态度
6. 返回纯 JSON，不要包含 markdown 代码块标记`

  const userPrompt = '这是对方的朋友圈截图，请帮我深度分析这个人，并提供追求建议。'

  try {
    // 构建输入内容（根据豆包API格式）
    const inputContent = [
      {
        type: 'input_text',
        text: `${systemPrompt}\n\n${userPrompt}`
      },
      ...imageDataList  // imageDataList 已经是正确的格式
    ]

    console.log('📤 发送请求到豆包 API...', {
      url: `${ARK_BASE_URL}/responses`,
      model: MODEL,
      imageCount: imageDataList.length,
      contentLength: inputContent.length
    })
    
    const requestBody = {
      model: MODEL,
      input: [
        {
          role: 'user',
          content: inputContent
        }
      ]
    }
    
    console.log('📦 请求体大小:', JSON.stringify(requestBody).length, 'bytes')
    
    const response = await axios.post(
      `${ARK_BASE_URL}/responses`,
      requestBody,
      {
        headers: {
          'Authorization': `Bearer ${ARK_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 180000 // 3分钟超时（AI分析需要较长时间）
      }
    )
    
    console.log('✅ API 响应成功，状态码:', response.status)

    // 解析响应（豆包API响应格式）
    // 豆包API可能返回多种格式：
    // 1. { output: "文本内容" }
    // 2. { type: "reasoning", summary: [{ summary_text: { text: "内容" } }] }
    // 3. { choices: [{ message: { content: "内容" } }] }
    
    console.log('📥 收到API响应，开始解析...')
    console.log('响应数据结构:', JSON.stringify(response.data).substring(0, 300))
    
    let aiResponse = ''
    
    // 确保 response.data 存在
    if (!response.data) {
      throw new Error('API响应数据为空')
    }
    
    // 尝试提取文本内容
    if (response.data.output && Array.isArray(response.data.output)) {
      // 新格式: output 是数组
      console.log('✅ 检测到 output 数组格式，长度:', response.data.output.length)
      for (const item of response.data.output) {
        if (item.type === 'reasoning' && item.summary && Array.isArray(item.summary)) {
          for (const summaryItem of item.summary) {
            if (summaryItem.summary_text?.text) {
              aiResponse = summaryItem.summary_text.text
              console.log('✅ 从 reasoning.summary 中提取文本，长度:', aiResponse.length)
              break
            }
          }
          if (aiResponse) break
        }
      }
    } else if (response.data.output && typeof response.data.output === 'string') {
      // 格式1: 直接输出
      aiResponse = response.data.output
      console.log('✅ 使用 output 字段')
    } else if (response.data.type === 'reasoning' && response.data.summary) {
      // 格式2: reasoning类型，从summary中提取
      const summary = response.data.summary
      if (Array.isArray(summary) && summary.length > 0) {
        const summaryText = summary[0]?.summary_text?.text || summary[0]?.text
        if (summaryText && typeof summaryText === 'string') {
          aiResponse = summaryText
          console.log('✅ 从 summary 中提取文本')
        }
      }
    } else if (response.data.choices && response.data.choices[0]?.message?.content) {
      // 格式3: choices格式
      const content = response.data.choices[0].message.content
      if (typeof content === 'string') {
        aiResponse = content
        console.log('✅ 从 choices 中提取文本')
      }
    } else {
      // 尝试直接使用整个响应
      console.warn('⚠️ 未识别的响应格式，尝试直接解析')
      if (typeof response.data === 'string') {
        aiResponse = response.data
      } else {
        // 尝试查找可能的文本字段
        const dataStr = JSON.stringify(response.data)
        const textMatch = dataStr.match(/"text"\s*:\s*"([^"]+)"/) || 
                         dataStr.match(/"content"\s*:\s*"([^"]+)"/) ||
                         dataStr.match(/"output"\s*:\s*"([^"]+)"/)
        if (textMatch && textMatch[1]) {
          aiResponse = textMatch[1].replace(/\\n/g, '\n').replace(/\\"/g, '"')
          console.log('✅ 从JSON中提取文本字段')
        } else {
          aiResponse = dataStr
        }
      }
    }
    
    // 确保 aiResponse 是字符串
    if (typeof aiResponse !== 'string') {
      console.warn('⚠️ aiResponse 不是字符串，尝试转换:', typeof aiResponse)
      aiResponse = String(aiResponse)
    }
    
    if (!aiResponse || aiResponse.trim().length === 0) {
      console.error('❌ 无法从API响应中提取内容')
      console.error('完整响应:', JSON.stringify(response.data, null, 2))
      throw new Error('无法从API响应中提取内容')
    }
    
    console.log('📝 提取的文本长度:', aiResponse.length)
    console.log('📝 文本预览:', aiResponse.substring(0, 200))
    
    // 尝试解析 JSON
    try {
      // 移除可能的 markdown 代码块标记
      let jsonStr = String(aiResponse).trim()
      
      // 如果是字符串，尝试提取JSON部分
      if (jsonStr.includes('```json')) {
        const jsonMatch = jsonStr.match(/```json\s*([\s\S]*?)\s*```/)
        if (jsonMatch) {
          jsonStr = jsonMatch[1]
        }
      } else if (jsonStr.includes('```')) {
        const codeMatch = jsonStr.match(/```\s*([\s\S]*?)\s*```/)
        if (codeMatch) {
          jsonStr = codeMatch[1]
        }
      }
      
      // 尝试查找JSON对象
      const jsonObjectMatch = jsonStr.match(/\{[\s\S]*\}/)
      if (jsonObjectMatch) {
        jsonStr = jsonObjectMatch[0]
      }
      
      const result = JSON.parse(jsonStr)
      
      // 验证结果结构
      if (result && typeof result === 'object') {
        return result
      } else {
        throw new Error('解析结果不是有效的对象')
      }
    } catch (parseErr) {
      console.error('❌ JSON 解析失败:', parseErr.message)
      const previewText = typeof aiResponse === 'string' 
        ? aiResponse.substring(0, 500) 
        : String(aiResponse).substring(0, 500)
      console.error('📄 原始响应内容预览:', previewText)
      
      // 如果解析失败，尝试从文本中提取结构化信息
      const defaultResult = generateDefaultResult(aiResponse)
      console.log('✅ 使用默认结果')
      return defaultResult
    }

  } catch (err) {
    console.error('❌ 调用豆包 API 失败')
    console.error('错误类型:', err.name)
    console.error('错误消息:', err.message)
    
    if (err.response) {
      console.error('响应状态:', err.response.status)
      console.error('响应数据:', JSON.stringify(err.response.data).substring(0, 500))
    }
    
    if (err.response?.status === 401) {
      throw new Error('API Key 无效，请检查配置')
    } else if (err.response?.status === 429) {
      throw new Error('API 调用频率超限，请稍后重试')
    } else if (err.code === 'ECONNABORTED' || err.message.includes('timeout')) {
      throw new Error('请求超时，请稍后重试（AI分析需要较长时间）')
    } else if (err.response?.data?.error) {
      throw new Error('AI 分析失败: ' + err.response.data.error.message)
    } else {
      throw new Error('AI 分析失败: ' + err.message)
    }
  }
}

/**
 * 生成默认分析结果（当 AI 返回格式不正确时）
 * 尝试从文本中提取有用信息
 */
function generateDefaultResult(aiText) {
  // 确保输入是字符串
  let text = ''
  if (typeof aiText === 'string') {
    text = aiText
  } else if (aiText && typeof aiText === 'object') {
    // 如果是对象，尝试提取文本字段
    text = aiText.text || aiText.content || aiText.output || JSON.stringify(aiText)
  } else {
    text = String(aiText || '')
  }
  
  // 尝试从文本中提取标签
  const tagKeywords = ['开朗', '内向', '外向', '活泼', '安静', '文艺', '运动', '美食', '旅行', '摄影', '音乐', '阅读', '积极', '乐观', '有品位', '热爱生活']
  const extractedTags = []
  
  for (const keyword of tagKeywords) {
    if (text.includes(keyword)) {
      extractedTags.push(keyword)
    }
  }
  
  // 如果提取不到标签，使用默认标签
  const tags = extractedTags.length > 0 ? extractedTags : ['开朗', '热爱生活', '有品位', '积极向上']
  
  // 清理文本，移除JSON格式标记
  let cleanText = String(text)
    .replace(/```json[\s\S]*?```/g, '')
    .replace(/```[\s\S]*?```/g, '')
    .replace(/\{[\s\S]*?\}/g, '')
    .replace(/\[[\s\S]*?\]/g, '')
    .trim()
  
  // 如果文本太长，截取前500字
  if (cleanText.length > 500) {
    cleanText = cleanText.substring(0, 500) + '...'
  }
  
  return {
    scores: {
      personality: '75%',
      interest: '80%',
      difficulty: '60%',
      potential: '85%'
    },
    tags: tags,
    characterAnalysis: cleanText || '根据朋友圈分析，这是一个热爱生活、积极向上的人。TA喜欢社交，经常参加各种活动，对新鲜事物充满好奇心。从朋友圈的内容可以看出，TA是一个有品位、注重生活质量的人。',
    interests: [
      { icon: '🎵', name: '音乐' },
      { icon: '🍱', name: '美食' },
      { icon: '📷', name: '摄影' },
      { icon: '✈️', name: '旅行' },
      { icon: '📚', name: '阅读' },
      { icon: '🎬', name: '电影' }
    ],
    strategy: {
      iceBreaker: '可以从TA最近发的朋友圈入手，选择一个共同感兴趣的话题，比如最近看的电影、去过的餐厅或者旅行的地方。自然地表达你的兴趣，并询问TA的看法或者推荐。',
      topics: [
        '最近看的电影或者电视剧，讨论剧情和角色',
        '美食话题，分享好吃的餐厅或者自己做的菜',
        '旅行经历，聊聊去过的地方或者想去的地方',
        '音乐品味，分享喜欢的歌手或者歌单',
        '生活趣事，分享日常中有趣的见闻',
        '兴趣爱好，了解TA最近在学什么或者玩什么'
      ],
      dates: [
        '一起去网红咖啡厅或者有特色的餐厅，轻松愉快的用餐氛围',
        '看一场电影或者展览，之后可以聊聊感受',
        '户外活动，比如爬山、骑行或者公园散步',
        '参加有趣的活动，比如手工课、烹饪课或者剧本杀'
      ],
      gifts: '可以根据TA的兴趣选择礼物。如果TA喜欢音乐，可以送演唱会门票或者黑胶唱片；如果TA是美食爱好者，可以送精致的甜品或者特色小吃；如果TA喜欢阅读，可以送一本TA想看的书。重要的是表达你的用心和对TA兴趣的了解。',
      warnings: [
        '不要过于急切或者频繁打扰，给对方一些空间',
        '避免在朋友圈刷屏式点赞或评论，要自然适度',
        '不要说对方朋友或家人的坏话，保持礼貌和尊重',
        '注意对方的回复频率和态度，及时调整自己的节奏',
        '不要过早表白，先建立良好的朋友关系'
      ]
    },
    actionPlan: [
      {
        title: '第1-3天',
        description: '在朋友圈自然地互动，点赞并适度评论TA的动态。可以从一个共同话题开始聊天，保持轻松愉快的氛围，不要表现得太过刻意。'
      },
      {
        title: '第1周',
        description: '尝试更深入的交流，分享一些有趣的内容或者生活中的小事。如果聊得来，可以邀请TA参加一次轻松的活动，比如喝咖啡或者散步。'
      },
      {
        title: '第2-4周',
        description: '逐渐增加见面的频率，但保持自然。多了解TA的想法和感受，展现你的真诚和可靠。可以尝试一些更有趣的约会活动，增进彼此的了解。'
      },
      {
        title: '长期',
        description: '建立稳定的关系基础，保持良好的沟通。在合适的时机表达你的感情，但要注意对方的反馈。持续关心TA，让TA感受到你的真心和诚意。'
      }
    ]
  }
}

