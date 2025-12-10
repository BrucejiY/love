<template>
  <div class="upload-page">
    <div class="container">
      <!-- Header -->
      <div class="header">
        <button class="back-btn" @click="goBack">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
        <h2 class="header-title">上传朋友圈截图</h2>
        <div style="width: 24px;"></div>
      </div>

      <!-- Upload Area -->
      <div class="upload-section">
        <div class="upload-tip">
          <p>上传 5-20 张 TA 的朋友圈截图</p>
          <p class="tip-secondary">支持 JPG、PNG、WebP 格式，单张最大 10MB</p>
        </div>

        <!-- Upload Box -->
        <div 
          class="upload-box"
          :class="{ 'drag-over': isDragOver }"
          @click="triggerFileInput"
          @drop.prevent="handleDrop"
          @dragover.prevent="isDragOver = true"
          @dragleave.prevent="isDragOver = false"
        >
          <div class="upload-icon">📸</div>
          <p class="upload-text">点击或拖拽上传图片</p>
          <p class="upload-hint">{{ images.length }}/20 张</p>
        </div>

        <input 
          ref="fileInput"
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          multiple
          @change="handleFileSelect"
        />

        <!-- Image Preview Grid -->
        <div v-if="images.length > 0" class="image-grid">
          <div 
            v-for="(image, index) in images" 
            :key="index"
            class="image-item"
          >
            <img :src="image.preview" :alt="`截图 ${index + 1}`" />
            <button class="remove-btn" @click.stop="removeImage(index)">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- Error Message -->
        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>

        <!-- Submit Button -->
        <button 
          class="btn btn-primary btn-large submit-btn"
          :disabled="images.length < 5 || isUploading"
          @click="startAnalysis"
        >
          {{ isUploading ? '上传中...' : `开始分析 (${images.length}/5)` }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUploadStore } from '@/stores/upload'
import Compressor from 'compressorjs'

const router = useRouter()
const uploadStore = useUploadStore()

const fileInput = ref(null)
const images = ref([])
const isDragOver = ref(false)
const isUploading = ref(false)
const errorMessage = ref('')

const goBack = () => {
  router.push('/')
}

const triggerFileInput = () => {
  fileInput.value.click()
}

const validateFile = (file) => {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
  const maxSize = 10 * 1024 * 1024 // 10MB

  if (!validTypes.includes(file.type)) {
    return '请上传 JPG、PNG 或 WebP 格式的图片'
  }

  if (file.size > maxSize) {
    return '图片大小不能超过 10MB'
  }

  return null
}

const compressImage = (file) => {
  return new Promise((resolve, reject) => {
    new Compressor(file, {
      quality: 0.8,
      maxWidth: 1920,
      maxHeight: 1920,
      success: resolve,
      error: reject
    })
  })
}

const handleFiles = async (files) => {
  errorMessage.value = ''

  if (images.value.length + files.length > 20) {
    errorMessage.value = '最多只能上传 20 张图片'
    return
  }

  const fileArray = Array.from(files)

  for (const file of fileArray) {
    const error = validateFile(file)
    if (error) {
      errorMessage.value = error
      continue
    }

    try {
      // 压缩图片
      const compressedFile = await compressImage(file)
      
      // 创建预览
      const preview = URL.createObjectURL(compressedFile)
      
      images.value.push({
        file: compressedFile,
        preview,
        name: file.name
      })
    } catch (err) {
      console.error('图片压缩失败:', err)
      errorMessage.value = '图片处理失败，请重试'
    }
  }
}

const handleFileSelect = (event) => {
  const files = event.target.files
  if (files.length > 0) {
    handleFiles(files)
  }
  event.target.value = '' // 重置input
}

const handleDrop = (event) => {
  isDragOver.value = false
  const files = event.dataTransfer.files
  if (files.length > 0) {
    handleFiles(files)
  }
}

const removeImage = (index) => {
  URL.revokeObjectURL(images.value[index].preview)
  images.value.splice(index, 1)
  errorMessage.value = ''
}

const startAnalysis = async () => {
  if (images.value.length < 5) {
    errorMessage.value = '请至少上传 5 张图片'
    return
  }

  isUploading.value = true
  
  try {
    // 将图片数据存储到 store
    uploadStore.clearImages()
    uploadStore.addImages(images.value)
    
    // 跳转到分析页面
    router.push('/analyzing')
  } catch (err) {
    console.error('上传失败:', err)
    errorMessage.value = '上传失败，请重试'
    isUploading.value = false
  }
}
</script>

<style scoped>
.upload-page {
  min-height: 100vh;
  padding: var(--spacing-md) 0;
}

/* Header */
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-md) var(--spacing-md) var(--spacing-xl);
}

.back-btn {
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

.back-btn:hover {
  background: var(--bg-tertiary);
}

.header-title {
  font-size: var(--font-lg);
  font-weight: 600;
  color: var(--text-primary);
}

/* Upload Section */
.upload-section {
  padding: 0 var(--spacing-md);
}

.upload-tip {
  text-align: center;
  margin-bottom: var(--spacing-lg);
}

.upload-tip p {
  font-size: var(--font-md);
  color: var(--text-primary);
  margin-bottom: var(--spacing-xs);
}

.tip-secondary {
  font-size: var(--font-sm);
  color: var(--text-secondary) !important;
}

/* Upload Box */
.upload-box {
  background: var(--bg-primary);
  border: 2px dashed var(--border-color);
  border-radius: var(--border-radius-large);
  padding: 60px var(--spacing-lg);
  text-align: center;
  cursor: pointer;
  transition: all var(--transition-normal);
  margin-bottom: var(--spacing-lg);
}

.upload-box:hover,
.upload-box.drag-over {
  border-color: var(--primary-color);
  background: rgba(255, 45, 85, 0.05);
}

.upload-icon {
  font-size: 64px;
  margin-bottom: var(--spacing-md);
}

.upload-text {
  font-size: var(--font-md);
  color: var(--text-primary);
  margin-bottom: var(--spacing-xs);
  font-weight: 500;
}

.upload-hint {
  font-size: var(--font-sm);
  color: var(--text-secondary);
}

/* Image Grid */
.image-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
}

.image-item {
  position: relative;
  aspect-ratio: 1;
  border-radius: var(--border-radius);
  overflow: hidden;
  background: var(--bg-secondary);
}

.image-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.remove-btn {
  position: absolute;
  top: 6px;
  right: 6px;
  width: 28px;
  height: 28px;
  border: none;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(10px);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: white;
  transition: all var(--transition-fast);
  opacity: 0;
}

.image-item:hover .remove-btn {
  opacity: 1;
}

.remove-btn:hover {
  background: rgba(255, 45, 85, 0.9);
}

/* Error Message */
.error-message {
  background: rgba(255, 45, 85, 0.1);
  color: var(--primary-color);
  padding: var(--spacing-md);
  border-radius: var(--border-radius);
  text-align: center;
  margin-bottom: var(--spacing-lg);
  font-size: var(--font-sm);
}

/* Submit Button */
.submit-btn {
  width: 100%;
  max-width: 400px;
  display: block;
  margin: 0 auto;
}

/* 响应式 */
@media (max-width: 768px) {
  .image-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: var(--spacing-sm);
  }
}
</style>

