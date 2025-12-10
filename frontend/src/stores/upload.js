import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUploadStore = defineStore('upload', () => {
  const images = ref([])
  const analysisResult = ref(null)
  const isAnalyzing = ref(false)

  // 添加图片
  const addImages = (newImages) => {
    images.value = [...images.value, ...newImages]
  }

  // 删除图片
  const removeImage = (index) => {
    images.value.splice(index, 1)
  }

  // 清空图片
  const clearImages = () => {
    images.value = []
  }

  // 设置分析结果
  const setAnalysisResult = (result) => {
    analysisResult.value = result
  }

  // 重置所有数据
  const reset = () => {
    images.value = []
    analysisResult.value = null
    isAnalyzing.value = false
  }

  return {
    images,
    analysisResult,
    isAnalyzing,
    addImages,
    removeImage,
    clearImages,
    setAnalysisResult,
    reset
  }
})

