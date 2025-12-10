<template>
  <div class="home-page">
    <!-- 背景装饰元素 -->
    <div class="bg-decoration">
      <div class="decoration-circle circle-1"></div>
      <div class="decoration-circle circle-2"></div>
      <div class="decoration-circle circle-3"></div>
    </div>

    <div class="container">
      <!-- Hero Section -->
      <div class="hero">
        <div class="hero-icons">
          <div class="hero-icon icon-1">💕</div>
          <div class="hero-icon icon-2">💖</div>
        </div>
        <h1 class="hero-title">朋友圈恋爱助手</h1>
        <p class="hero-subtitle">AI 帮你读懂 TA 的心</p>
      </div>

      <!-- Features -->
      <div class="features">
        <div class="feature-card card-1">
          <div class="feature-icon-wrapper">
            <div class="feature-icon">🔍</div>
          </div>
          <h3 class="feature-title">深度分析</h3>
          <p class="feature-desc">通过朋友圈了解性格、兴趣和生活方式</p>
        </div>
        
        <div class="feature-card card-2">
          <div class="feature-icon-wrapper">
            <div class="feature-icon">💡</div>
          </div>
          <h3 class="feature-title">精准建议</h3>
          <p class="feature-desc">量身定制的追求策略和话题推荐</p>
        </div>
        
        <div class="feature-card card-3">
          <div class="feature-icon-wrapper">
            <div class="feature-icon">❤️</div>
          </div>
          <h3 class="feature-title">提升成功率</h3>
          <p class="feature-desc">科学的方法帮你赢得 TA 的好感</p>
        </div>
      </div>

      <!-- How it works -->
      <div class="steps">
        <h2 class="steps-title">如何使用</h2>
        <div class="step-list">
          <div class="step-item">
            <div class="step-number">1</div>
            <div class="step-content">
              <h4>上传截图</h4>
              <p>上传 5-20 张 TA 的朋友圈截图</p>
            </div>
          </div>
          
          <div class="step-item">
            <div class="step-number">2</div>
            <div class="step-content">
              <h4>AI 分析</h4>
              <p>大模型深度分析性格和兴趣</p>
            </div>
          </div>
          
          <div class="step-item">
            <div class="step-number">3</div>
            <div class="step-content">
              <h4>获得建议</h4>
              <p>查看详细报告和追求策略</p>
            </div>
          </div>
        </div>
      </div>

      <!-- CTA Button -->
      <div class="cta-section">
        <button class="btn btn-primary btn-large" @click="startAnalysis">
          开始分析
        </button>
        <p class="privacy-note">
          🔒 我们重视隐私，上传的图片将在 24 小时后自动删除
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useUploadStore } from '@/stores/upload'

const router = useRouter()
const uploadStore = useUploadStore()

const startAnalysis = () => {
  uploadStore.reset()
  router.push('/upload')
}
</script>

<style scoped>
.home-page {
  min-height: 100vh;
  padding: var(--spacing-xl) 0;
  position: relative;
  overflow: hidden;
}

.container {
  position: relative;
  z-index: 1;
}

/* 背景装饰元素 */
.bg-decoration {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
}

.decoration-circle {
  position: absolute;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(255, 45, 85, 0.1) 0%, rgba(255, 107, 138, 0.05) 100%);
  filter: blur(60px);
  animation: float-circle 20s ease-in-out infinite;
}

.circle-1 {
  width: 400px;
  height: 400px;
  top: -100px;
  left: -100px;
  animation-delay: 0s;
}

.circle-2 {
  width: 300px;
  height: 300px;
  top: 50%;
  right: -50px;
  animation-delay: 5s;
}

.circle-3 {
  width: 350px;
  height: 350px;
  bottom: -100px;
  left: 50%;
  animation-delay: 10s;
}

@keyframes float-circle {
  0%, 100% {
    transform: translate(0, 0) scale(1);
  }
  33% {
    transform: translate(30px, -30px) scale(1.1);
  }
  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }
}

/* Hero Section */
.hero {
  text-align: center;
  padding: 60px 0 80px;
  position: relative;
  z-index: 1;
}

.hero-icons {
  position: relative;
  display: inline-block;
  margin-bottom: var(--spacing-lg);
  height: 100px;
}

.hero-icon {
  position: absolute;
  font-size: 80px;
  animation: float 3s ease-in-out infinite;
}

.hero-icon.icon-1 {
  left: -20px;
  animation-delay: 0s;
}

.hero-icon.icon-2 {
  right: -20px;
  top: 10px;
  font-size: 60px;
  animation-delay: 1.5s;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-15px) rotate(5deg);
  }
}

.hero-title {
  font-size: var(--font-3xl);
  margin-bottom: var(--spacing-md);
  background: var(--primary-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  position: relative;
  z-index: 1;
}

.hero-subtitle {
  font-size: var(--font-xl);
  color: var(--text-secondary);
  font-weight: 400;
  position: relative;
  z-index: 1;
}

/* Features */
.features {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--spacing-lg);
  margin-bottom: 80px;
  position: relative;
  z-index: 1;
  max-width: 1000px;
  margin-left: auto;
  margin-right: auto;
}

.feature-card {
  background: var(--bg-primary);
  border-radius: var(--border-radius-large);
  padding: var(--spacing-xl);
  text-align: center;
  box-shadow: var(--shadow-sm);
  transition: all var(--transition-normal);
  position: relative;
  overflow: hidden;
}

.feature-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: var(--primary-gradient);
  transform: scaleX(0);
  transition: transform var(--transition-normal);
}

.feature-card:hover::before {
  transform: scaleX(1);
}

.feature-card:hover {
  transform: translateY(-8px);
  box-shadow: var(--shadow-lg);
}

.feature-card.card-1:hover {
  background: linear-gradient(135deg, rgba(255, 45, 85, 0.02) 0%, rgba(255, 45, 85, 0) 100%);
}

.feature-card.card-2:hover {
  background: linear-gradient(135deg, rgba(94, 92, 230, 0.02) 0%, rgba(94, 92, 230, 0) 100%);
}

.feature-card.card-3:hover {
  background: linear-gradient(135deg, rgba(255, 45, 85, 0.02) 0%, rgba(255, 45, 85, 0) 100%);
}

.feature-icon-wrapper {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(255, 45, 85, 0.1) 0%, rgba(255, 107, 138, 0.05) 100%);
  margin-bottom: var(--spacing-md);
  transition: all var(--transition-normal);
}

.feature-card:hover .feature-icon-wrapper {
  transform: scale(1.1) rotate(5deg);
  background: linear-gradient(135deg, rgba(255, 45, 85, 0.15) 0%, rgba(255, 107, 138, 0.1) 100%);
}

.feature-icon {
  font-size: 48px;
  display: block;
}

.feature-title {
  font-size: var(--font-lg);
  margin-bottom: var(--spacing-sm);
  color: var(--text-primary);
  font-weight: 600;
}

.feature-desc {
  font-size: var(--font-sm);
  color: var(--text-secondary);
  line-height: 1.6;
}

/* Steps */
.steps {
  margin-bottom: 80px;
  position: relative;
  z-index: 1;
}

.steps-title {
  text-align: center;
  margin-bottom: var(--spacing-xl);
  color: var(--text-primary);
  font-size: var(--font-2xl);
  font-weight: 700;
}

.step-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
  max-width: 500px;
  margin: 0 auto;
}

.step-item {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-lg);
  background: var(--bg-primary);
  padding: var(--spacing-lg);
  border-radius: var(--border-radius-large);
  box-shadow: var(--shadow-sm);
  transition: all var(--transition-normal);
}

.step-item:hover {
  box-shadow: var(--shadow-md);
}

.step-number {
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  background: var(--primary-gradient);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--font-lg);
  font-weight: 600;
}

.step-content h4 {
  font-size: var(--font-md);
  margin-bottom: var(--spacing-xs);
  color: var(--text-primary);
}

.step-content p {
  font-size: var(--font-sm);
  color: var(--text-secondary);
  line-height: 1.5;
}

/* CTA Section */
.cta-section {
  text-align: center;
  padding: 40px 0;
  position: relative;
  z-index: 1;
}

.cta-section .btn {
  margin-bottom: var(--spacing-lg);
  min-width: 200px;
  position: relative;
  overflow: hidden;
}

.cta-section .btn::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  transform: translate(-50%, -50%);
  transition: width 0.6s, height 0.6s;
}

.cta-section .btn:hover::before {
  width: 300px;
  height: 300px;
}

.privacy-note {
  font-size: var(--font-sm);
  color: var(--text-tertiary);
  max-width: 400px;
  margin: 0 auto;
  line-height: 1.6;
  position: relative;
  z-index: 1;
}

/* 响应式 */
@media (max-width: 968px) {
  .features {
    grid-template-columns: 1fr;
    max-width: 400px;
  }
  
  .feature-card {
    max-width: 100%;
  }
}

@media (max-width: 768px) {
  .hero-title {
    font-size: var(--font-2xl);
  }
  
  .hero-subtitle {
    font-size: var(--font-lg);
  }
  
  .hero-icon.icon-1 {
    font-size: 60px;
    left: -10px;
  }
  
  .hero-icon.icon-2 {
    font-size: 45px;
    right: -10px;
  }
  
  .hero-icons {
    height: 80px;
  }
  
  .decoration-circle {
    filter: blur(40px);
  }
  
  .circle-1 {
    width: 300px;
    height: 300px;
  }
  
  .circle-2 {
    width: 200px;
    height: 200px;
  }
  
  .circle-3 {
    width: 250px;
    height: 250px;
  }
  
  .step-item {
    padding: var(--spacing-md);
  }
}
</style>

