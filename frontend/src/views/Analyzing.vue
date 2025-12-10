<template>
  <div class="analyzing-page">
    <div class="container">
      <div class="content">
        <!-- Animation -->
        <div class="animation-container">
          <div class="heart-animation">
            <div class="heart">💖</div>
            <div class="pulse-ring"></div>
            <div class="pulse-ring delay-1"></div>
            <div class="pulse-ring delay-2"></div>
          </div>
        </div>

        <!-- Title -->
        <h2 class="title">AI 正在分析中</h2>
        
        <!-- Loading Tips -->
        <div class="loading-tips">
          <p class="tip-text">{{ currentTip }}</p>
        </div>

        <!-- Progress Bar -->
        <div class="progress-container">
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: progress + '%' }"></div>
          </div>
          <p class="progress-text">{{ progress }}%</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUploadStore } from '@/stores/upload'
import axios from 'axios'

const router = useRouter()
const uploadStore = useUploadStore()

const progress = ref(0)
const currentTip = ref('')

const tips = [
  '正在读取朋友圈内容...',
  '分析 TA 的兴趣爱好...',
  '了解 TA 的性格特点...',
  '探索 TA 的生活方式...',
  '寻找共同话题...',
  '制定追求策略...',
  '生成专属报告...'
]

let tipInterval = null
let progressInterval = null

const updateTip = () => {
  const randomIndex = Math.floor(Math.random() * tips.length)
  currentTip.value = tips[randomIndex]
}

const startAnalysis = async () => {
  try {
    // 准备上传的文件
    const formData = new FormData()
    uploadStore.images.forEach((image, index) => {
      formData.append('images', image.file, image.name)
    })

    // 调用后端API
    const response = await axios.post('/api/analyze', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress: (progressEvent) => {
        const uploadProgress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
        progress.value = Math.min(uploadProgress, 80) // 上传占80%
      }
    })

    // 分析完成
    progress.value = 100
    
    // 存储分析结果
    uploadStore.setAnalysisResult(response.data)
    
    // 短暂延迟后跳转
    setTimeout(() => {
      router.push('/report')
    }, 500)
    
  } catch (error) {
    console.error('分析失败:', error)
    alert('分析失败，请重试')
    router.push('/upload')
  }
}

onMounted(() => {
  // 检查是否有上传的图片
  if (uploadStore.images.length < 5) {
    router.push('/upload')
    return
  }

  // 更新提示文本
  updateTip()
  tipInterval = setInterval(updateTip, 3000)

  // 开始分析
  startAnalysis()
})

onUnmounted(() => {
  if (tipInterval) {
    clearInterval(tipInterval)
  }
  if (progressInterval) {
    clearInterval(progressInterval)
  }
})
</script>

<style scoped>
.analyzing-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.content {
  text-align: center;
  padding: var(--spacing-xl);
}

/* Heart Animation */
.animation-container {
  margin-bottom: 60px;
}

.heart-animation {
  position: relative;
  width: 120px;
  height: 120px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
}

.heart {
  font-size: 64px;
  animation: heartbeat 1.5s ease-in-out infinite;
  z-index: 2;
}

@keyframes heartbeat {
  0%, 100% {
    transform: scale(1);
  }
  25% {
    transform: scale(1.1);
  }
  50% {
    transform: scale(1);
  }
  75% {
    transform: scale(1.15);
  }
}

.pulse-ring {
  position: absolute;
  width: 100%;
  height: 100%;
  border: 3px solid rgba(255, 255, 255, 0.6);
  border-radius: 50%;
  animation: pulse 2s ease-out infinite;
}

.pulse-ring.delay-1 {
  animation-delay: 0.7s;
}

.pulse-ring.delay-2 {
  animation-delay: 1.4s;
}

@keyframes pulse {
  0% {
    transform: scale(0.8);
    opacity: 1;
  }
  100% {
    transform: scale(1.5);
    opacity: 0;
  }
}

/* Title */
.title {
  font-size: var(--font-2xl);
  font-weight: 600;
  margin-bottom: var(--spacing-lg);
  color: white;
}

/* Loading Tips */
.loading-tips {
  min-height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: var(--spacing-xl);
}

.tip-text {
  font-size: var(--font-lg);
  color: rgba(255, 255, 255, 0.9);
  animation: fadeIn 0.5s ease-in;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Progress Bar */
.progress-container {
  max-width: 400px;
  margin: 0 auto;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: var(--spacing-md);
  backdrop-filter: blur(10px);
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #fff 0%, rgba(255, 255, 255, 0.8) 100%);
  border-radius: 4px;
  transition: width 0.3s ease;
  box-shadow: 0 0 20px rgba(255, 255, 255, 0.5);
}

.progress-text {
  font-size: var(--font-md);
  color: rgba(255, 255, 255, 0.8);
  font-weight: 500;
}
</style>

