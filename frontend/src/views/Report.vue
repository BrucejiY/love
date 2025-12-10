<template>
  <div class="report-page">
    <div class="container">
      <!-- Header -->
      <div class="header">
        <button class="back-btn" @click="goHome">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
        <h2 class="header-title">分析报告</h2>
        <button class="share-btn" @click="shareReport">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M4 12v5a2 2 0 002 2h8a2 2 0 002-2v-5M14 5l-4-4m0 0L6 5m4-4v13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>

      <div class="report-content" v-if="result">
        <!-- Summary Card -->
        <div class="card summary-card">
          <div class="card-header">
            <h3>综合评估</h3>
          </div>
          <div class="scores">
            <div class="score-item">
              <div class="score-label">性格匹配</div>
              <div class="score-bar">
                <div class="score-fill" :style="{ width: result.scores?.personality || '75%' }"></div>
              </div>
              <div class="score-value">{{ result.scores?.personality || '75%' }}</div>
            </div>
            <div class="score-item">
              <div class="score-label">兴趣相似</div>
              <div class="score-bar">
                <div class="score-fill" :style="{ width: result.scores?.interest || '80%' }"></div>
              </div>
              <div class="score-value">{{ result.scores?.interest || '80%' }}</div>
            </div>
            <div class="score-item">
              <div class="score-label">追求难度</div>
              <div class="score-bar difficulty">
                <div class="score-fill" :style="{ width: result.scores?.difficulty || '60%' }"></div>
              </div>
              <div class="score-value">{{ result.scores?.difficulty || '60%' }}</div>
            </div>
            <div class="score-item">
              <div class="score-label">发展潜力</div>
              <div class="score-bar">
                <div class="score-fill" :style="{ width: result.scores?.potential || '85%' }"></div>
              </div>
              <div class="score-value">{{ result.scores?.potential || '85%' }}</div>
            </div>
          </div>
        </div>

        <!-- Character Analysis -->
        <div class="card">
          <div class="card-header">
            <h3>🎭 对方画像</h3>
          </div>
          <div class="card-body">
            <div class="tags" v-if="result.tags">
              <span v-for="tag in result.tags" :key="tag" class="tag">{{ tag }}</span>
            </div>
            <p class="analysis-text">{{ formatAnalysisText(result.characterAnalysis) }}</p>
          </div>
        </div>

        <!-- Interests -->
        <div class="card">
          <div class="card-header">
            <h3>💝 兴趣爱好</h3>
          </div>
          <div class="card-body">
            <div class="interest-list" v-if="result.interests && result.interests.length > 0">
              <div v-for="interest in result.interests" :key="interest.name || interest" class="interest-item">
                <span class="interest-icon">{{ interest.icon || '💝' }}</span>
                <span class="interest-name">{{ interest.name || interest }}</span>
              </div>
            </div>
            <p v-else class="text-secondary">暂无兴趣爱好信息</p>
          </div>
        </div>

        <!-- Pursuit Strategy -->
        <div class="card highlight-card">
          <div class="card-header">
            <h3>🎯 追求策略</h3>
          </div>
          <div class="card-body">
            <div class="strategy-section">
              <h4>💬 破冰建议</h4>
              <p>{{ result.strategy?.iceBreaker || '可以从共同兴趣入手，比如最近看的电影或者去过的地方，自然地开启话题。' }}</p>
            </div>
            
            <div class="strategy-section">
              <h4>💡 话题推荐</h4>
              <ul class="topic-list" v-if="result.strategy?.topics && result.strategy.topics.length > 0">
                <li v-for="(topic, index) in result.strategy.topics" :key="index">{{ topic }}</li>
              </ul>
              <p v-else>暂无话题推荐</p>
            </div>

            <div class="strategy-section">
              <h4>📅 约会建议</h4>
              <ul class="date-list" v-if="result.strategy?.dates && result.strategy.dates.length > 0">
                <li v-for="(date, index) in result.strategy.dates" :key="index">{{ date }}</li>
              </ul>
              <p v-else>暂无约会建议</p>
            </div>

            <div class="strategy-section">
              <h4>🎁 送礼建议</h4>
              <p>{{ result.strategy?.gifts || '可以考虑送一些与TA兴趣相关的小礼物，表达你的用心。' }}</p>
            </div>

            <div class="strategy-section warning">
              <h4>⚠️ 注意事项</h4>
              <ul class="warning-list" v-if="result.strategy?.warnings && result.strategy.warnings.length > 0">
                <li v-for="(warning, index) in result.strategy.warnings" :key="index">{{ warning }}</li>
              </ul>
              <p v-else>暂无特别注意事项</p>
            </div>
          </div>
        </div>

        <!-- Action Plan -->
        <div class="card">
          <div class="card-header">
            <h3>📋 行动计划</h3>
          </div>
          <div class="card-body">
            <div class="timeline" v-if="result.actionPlan && result.actionPlan.length > 0">
              <div class="timeline-item" v-for="(plan, index) in result.actionPlan" :key="index">
                <div class="timeline-dot"></div>
                <div class="timeline-content">
                  <h4>{{ plan.title || `阶段 ${index + 1}` }}</h4>
                  <p>{{ plan.description || plan }}</p>
                </div>
              </div>
            </div>
            <p v-else class="text-secondary">暂无行动计划</p>
          </div>
        </div>

        <!-- Actions -->
        <div class="actions">
          <button class="btn btn-primary btn-large" @click="goHome">
            重新分析
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div v-else class="loading-state">
        <p>加载报告中...</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUploadStore } from '@/stores/upload'

const router = useRouter()
const uploadStore = useUploadStore()

const result = ref(null)

onMounted(() => {
  // 检查是否有分析结果
  if (!uploadStore.analysisResult) {
    router.push('/')
    return
  }

  result.value = uploadStore.analysisResult
})

const goHome = () => {
  uploadStore.reset()
  router.push('/')
}

const shareReport = () => {
  if (navigator.share) {
    navigator.share({
      title: '朋友圈恋爱助手 - 分析报告',
      text: '查看我的恋爱分析报告',
      url: window.location.href
    })
  } else {
    alert('分享功能暂不支持，请手动复制链接分享')
  }
}

// 格式化分析文本，移除JSON格式标记
const formatAnalysisText = (text) => {
  if (!text) {
    return '根据朋友圈分析，这是一个性格开朗、热爱生活的人。TA喜欢社交，经常参加各种活动，对新鲜事物充满好奇心。'
  }
  
  // 如果是对象，转换为字符串
  if (typeof text === 'object') {
    text = JSON.stringify(text, null, 2)
  }
  
  // 移除JSON代码块标记
  let formatted = String(text)
    .replace(/```json[\s\S]*?```/g, '')
    .replace(/```[\s\S]*?```/g, '')
    .trim()
  
  // 如果包含JSON对象，尝试提取文本内容
  if (formatted.includes('"text"') || formatted.includes('"summary_text"')) {
    try {
      const jsonMatch = formatted.match(/"text"\s*:\s*"([^"]+)"/) || 
                       formatted.match(/"summary_text"\s*:\s*\{\s*"text"\s*:\s*"([^"]+)"/)
      if (jsonMatch && jsonMatch[1]) {
        formatted = jsonMatch[1].replace(/\\n/g, '\n').replace(/\\"/g, '"')
      }
    } catch (e) {
      // 如果提取失败，继续使用原文本
    }
  }
  
  // 移除多余的JSON结构标记
  formatted = formatted
    .replace(/\{[^}]*"id"[^}]*\}/g, '')
    .replace(/\{[^}]*"type"[^}]*\}/g, '')
    .replace(/^\s*\{[\s\S]*?"text"\s*:\s*"([^"]+)"[\s\S]*\}\s*$/g, '$1')
    .replace(/\\n/g, '\n')
    .replace(/\\"/g, '"')
    .trim()
  
  // 如果文本仍然包含大量JSON，只取前500字
  if (formatted.length > 1000 && formatted.includes('{')) {
    const textMatch = formatted.match(/"text"\s*:\s*"([^"]{1,500})/)
    if (textMatch) {
      formatted = textMatch[1]
    } else {
      formatted = formatted.substring(0, 500) + '...'
    }
  }
  
  return formatted || '根据朋友圈分析，这是一个性格开朗、热爱生活的人。TA喜欢社交，经常参加各种活动，对新鲜事物充满好奇心。'
}
</script>

<style scoped>
.report-page {
  min-height: 100vh;
  padding: var(--spacing-md) 0 var(--spacing-xl);
}

/* Header */
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-md) var(--spacing-md) var(--spacing-xl);
  position: sticky;
  top: 0;
  background: var(--bg-secondary);
  z-index: 10;
}

.back-btn,
.share-btn {
  width: 40px;
  height: 40px;
  border: none;
  background: var(--bg-primary);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all var(--transition-fast);
  color: var(--text-primary);
}

.back-btn:hover,
.share-btn:hover {
  background: var(--bg-tertiary);
}

.header-title {
  font-size: var(--font-lg);
  font-weight: 600;
  color: var(--text-primary);
}

/* Report Content */
.report-content {
  padding: 0 var(--spacing-md);
}

.card {
  background: var(--bg-primary);
  border-radius: var(--border-radius-large);
  padding: var(--spacing-lg);
  margin-bottom: var(--spacing-lg);
  box-shadow: var(--shadow-sm);
}

.card-header {
  margin-bottom: var(--spacing-lg);
}

.card-header h3 {
  font-size: var(--font-lg);
  font-weight: 600;
  color: var(--text-primary);
}

.card-body {
  color: var(--text-primary);
}

/* Summary Card */
.summary-card {
  background: var(--primary-gradient);
  color: white;
}

.summary-card .card-header h3 {
  color: white;
}

.scores {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.score-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.score-label {
  flex-shrink: 0;
  width: 80px;
  font-size: var(--font-sm);
  font-weight: 500;
  color: rgba(255, 255, 255, 0.9);
}

.score-bar {
  flex: 1;
  height: 8px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  overflow: hidden;
}

.score-fill {
  height: 100%;
  background: white;
  border-radius: 4px;
  transition: width 0.5s ease;
}

.score-bar.difficulty .score-fill {
  background: #FFC107;
}

.score-value {
  flex-shrink: 0;
  width: 50px;
  text-align: right;
  font-size: var(--font-sm);
  font-weight: 600;
  color: white;
}

/* Tags */
.tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-md);
}

.tag {
  padding: 6px 14px;
  background: rgba(255, 45, 85, 0.1);
  color: var(--primary-color);
  border-radius: 20px;
  font-size: var(--font-sm);
  font-weight: 500;
}

.analysis-text {
  line-height: 1.8;
  color: var(--text-secondary);
}

/* Interests */
.interest-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: var(--spacing-md);
}

.interest-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: var(--spacing-md);
  background: var(--bg-secondary);
  border-radius: var(--border-radius);
  transition: all var(--transition-fast);
}

.interest-item:hover {
  transform: translateY(-2px);
  background: var(--bg-tertiary);
}

.interest-icon {
  font-size: 32px;
  margin-bottom: var(--spacing-xs);
}

.interest-name {
  font-size: var(--font-sm);
  color: var(--text-primary);
  font-weight: 500;
}

/* Highlight Card */
.highlight-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.highlight-card .card-header h3 {
  color: white;
}

.strategy-section {
  margin-bottom: var(--spacing-xl);
}

.strategy-section:last-child {
  margin-bottom: 0;
}

.strategy-section h4 {
  font-size: var(--font-md);
  margin-bottom: var(--spacing-md);
  color: white;
}

.strategy-section p {
  line-height: 1.8;
  color: rgba(255, 255, 255, 0.9);
}

.topic-list,
.date-list,
.warning-list {
  list-style: none;
  padding: 0;
}

.topic-list li,
.date-list li,
.warning-list li {
  padding: var(--spacing-sm) 0;
  padding-left: var(--spacing-lg);
  position: relative;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.9);
}

.topic-list li:before {
  content: '💬';
  position: absolute;
  left: 0;
}

.date-list li:before {
  content: '📍';
  position: absolute;
  left: 0;
}

.warning-list li:before {
  content: '⚠️';
  position: absolute;
  left: 0;
}

.strategy-section.warning {
  background: rgba(255, 255, 255, 0.1);
  padding: var(--spacing-md);
  border-radius: var(--border-radius);
  backdrop-filter: blur(10px);
}

/* Timeline */
.timeline {
  position: relative;
  padding-left: 30px;
}

.timeline:before {
  content: '';
  position: absolute;
  left: 6px;
  top: 8px;
  bottom: 8px;
  width: 2px;
  background: var(--border-color);
}

.timeline-item {
  position: relative;
  margin-bottom: var(--spacing-lg);
}

.timeline-item:last-child {
  margin-bottom: 0;
}

.timeline-dot {
  position: absolute;
  left: -28px;
  top: 6px;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: var(--primary-color);
  border: 3px solid var(--bg-primary);
  box-shadow: 0 0 0 4px var(--bg-secondary);
}

.timeline-content h4 {
  font-size: var(--font-md);
  margin-bottom: var(--spacing-xs);
  color: var(--text-primary);
}

.timeline-content p {
  font-size: var(--font-sm);
  line-height: 1.6;
  color: var(--text-secondary);
}

/* Actions */
.actions {
  text-align: center;
  padding: var(--spacing-xl) var(--spacing-md);
}

.actions .btn {
  width: 100%;
  max-width: 400px;
}

/* Loading State */
.loading-state {
  text-align: center;
  padding: 60px var(--spacing-md);
  color: var(--text-secondary);
}

/* Empty State */
.text-secondary {
  color: var(--text-secondary);
  font-size: var(--font-sm);
  text-align: center;
  padding: var(--spacing-md);
}
</style>

