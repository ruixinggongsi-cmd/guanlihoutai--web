<template>
  <div class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
    <div class="backdrop-blur-lg bg-white/10 rounded-2xl border border-white/20 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
      <!-- 头部 -->
      <div class="p-6 border-b border-white/20">
        <div class="flex items-center justify-between">
          <h2 class="text-2xl font-bold text-white">{{ isEdit ? '编辑执行记录' : '添加执行记录' }}</h2>
          <button 
            @click="$emit('close')"
            class="text-gray-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10"
          >
            <i class="fas fa-times text-xl"></i>
          </button>
        </div>
      </div>

      <!-- 内容 -->
      <div class="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
        <form @submit.prevent="submitForm" class="space-y-6">
          <!-- 进度 -->
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">
              执行进度 <span class="text-red-400">*</span>
            </label>
            <div class="flex items-center space-x-4">
              <div class="flex-1 relative">
                <div class="w-full h-2 bg-white/10 rounded-lg overflow-hidden">
                  <div 
                    class="h-full transition-all duration-300 ease-out"
                    :class="getProgressBarClass()"
                    :style="{ width: formData.progress + '%' }"
                  ></div>
                </div>
                <input
                  v-model.number="formData.progress"
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  class="absolute inset-0 w-full h-2 cursor-pointer"
                >
              </div>
              <span class="text-white font-medium w-12 text-center">{{ formData.progress }}%</span>
            </div>
          </div>

          <!-- 状态 -->
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">
              任务状态 <span class="text-red-400">*</span>
            </label>
            <div class="grid grid-cols-2 gap-3">
              <div
                v-for="status in statusOptions"
                :key="status.value"
                @click="formData.status = status.value"
                class="cursor-pointer p-3 rounded-lg border-2 transition-all duration-200 flex items-center space-x-3"
                :class="[
                  formData.status === status.value
                    ? 'border-primary bg-primary/20 text-white'
                    : 'border-white/20 bg-white/5 text-gray-300 hover:border-white/40'
                ]"
              >
                <div class="text-xl">{{ status.icon }}</div>
                <div class="flex-1 text-left">
                  <div class="text-sm font-medium">{{ status.label }}</div>
                  <div class="text-xs mt-0.5" :class="formData.status === status.value ? 'text-gray-200' : 'text-gray-400'">{{ status.desc }}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- 执行备注 -->
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">执行备注</label>
            <textarea
              v-model="formData.comment"
              rows="4"
              placeholder="请输入执行备注、遇到的问题、解决方案等..."
              class="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
            ></textarea>
          </div>

        </form>
      </div>

      <!-- 底部操作 -->
      <div class="p-6 border-t border-white/20 flex justify-end space-x-3">
        <button 
          @click="$emit('close')"
          class="px-6 py-2 bg-white/10 text-white border border-white/20 rounded-xl hover:bg-white/20 transition-all duration-300"
        >
          关闭
        </button>
        <button 
          @click="submitForm"
          :disabled="loading"
          class="px-6 py-2 bg-gradient-to-r from-primary to-primary-light text-white rounded-xl hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <i v-if="loading" class="fas fa-spinner fa-spin mr-2"></i>
          {{ loading ? '提交中...' : (isEdit ? '更新' : '保存') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch, onMounted } from 'vue'
import { taskAPI } from '../../api/tasks.js'
import { ElMessage } from 'element-plus'

const props = defineProps({
  task: {
    type: Object,
    required: true
  },
  progressData: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'success'])

const loading = ref(false)
const fileInput = ref(null)
const selectedFiles = ref([])

const formData = reactive({
  progress: 0,
  status: 'in_progress',
  comment: '',
  attachments: []
})

const isEdit = ref(false)

// 状态选项 - 只显示进行中和已完成
const statusOptions = [
  {
    value: '0_in_progress',
    label: '进行中',
    icon: '🔄',
    desc: '正在执行中'
  },
  {
    value: '3_completed',
    label: '已完成',
    icon: '✅',
    desc: '任务已完成'
  }
]

// 重置表单
const resetForm = () => {
  formData.progress = props.task.executionProgress || props.task.progress || 0
  formData.status = props.task.status || 'in_progress'
  formData.comment = ''
  formData.attachments = []
  selectedFiles.value = []
}

// 监听props变化
watch(() => props.progressData, (newVal) => {
  if (newVal) {
    isEdit.value = true
    formData.progress = newVal.progress
    formData.status = newVal.status
    formData.comment = newVal.comment || ''
  } else {
    isEdit.value = false
    resetForm()
  }
}, { immediate: true })

// 处理文件选择
const handleFileChange = (event) => {
  const files = Array.from(event.target.files)
  selectedFiles.value = [...selectedFiles.value, ...files]
}

// 移除文件
const removeFile = (index) => {
  selectedFiles.value.splice(index, 1)
}

// 格式化文件大小
const formatFileSize = (bytes) => {
  if (!bytes) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// 提交表单
const submitForm = async () => {
  if (formData.progress < 0 || formData.progress > 100) {
    ElMessage.error('进度必须在 0-100 之间')
    return
  }

  loading.value = true
  try {
    let response
    
    if (isEdit.value && props.progressData) {
      // 编辑模式 - 更新任务执行记录
      const executionData = {
        actionType: 'progress_update',
        actionDescription: `更新进度至${formData.progress}%${formData.comment ? ' - ' + formData.comment : ''}`,
        statusAfter: formData.status,
        currentProgress: formData.progress
      }
      response = await taskAPI.addTaskExecution(props.task.id, executionData)
    } else {
      // 添加模式 - 添加任务执行记录
      const executionData = {
        actionType: 'progress_update',
        actionDescription: `更新进度至${formData.progress}%${formData.comment ? ' - ' + formData.comment : ''}`,
        statusAfter: formData.status,
        currentProgress: formData.progress
      }
      response = await taskAPI.addTaskExecution(props.task.id, executionData)
    }

    ElMessage.success(isEdit.value ? '执行记录更新成功' : '执行记录添加成功')
    emit('success', response.data)
    emit('close')
  } catch (error) {
    console.error('提交执行记录失败:', error)
    ElMessage.error(error.response?.data?.message || '提交失败')
  } finally {
    loading.value = false
  }
}

// 生命周期
onMounted(() => {
  // 如果progressData存在，优先使用它；否则使用task的默认数据
  if (!props.progressData) {
    resetForm()
  }
})

// 根据进度值获取进度条颜色类名
const getProgressBarClass = () => {
  if (formData.progress === 0) return 'bg-gray-500'
  if (formData.progress <= 30) return 'bg-gradient-to-r from-red-500 to-red-400'
  if (formData.progress <= 70) return 'bg-gradient-to-r from-yellow-500 to-yellow-400'
  if (formData.progress < 100) return 'bg-gradient-to-r from-green-500 to-green-400'
  return 'bg-gradient-to-r from-primary to-primary-light'
}
</script>

<style scoped>
/* 添加primary颜色定义以确保100%进度条正确显示 */
.from-primary {
  --tw-gradient-from: #6366f1;
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to, rgba(99, 102, 241, 0));
}

.to-primary-light {
  --tw-gradient-to: #818cf8;
}

.bg-primary {
  background-color: #6366f1;
}

.bg-primary-light {
  background-color: #818cf8;
}
/* 自定义范围输入框样式 */
input[type="range"] {
  -webkit-appearance: none;
  appearance: none;
  background: transparent;
  cursor: pointer;
}

/* 进度条滑块样式 */
input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #6366f1;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(99, 102, 241, 0.3);
  transition: all 0.2s ease;
  margin-top: -6px;
}

input[type="range"]::-webkit-slider-thumb:hover {
  background: #4f46e5;
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
}

input[type="range"]::-moz-range-thumb {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #6366f1;
  cursor: pointer;
  border: none;
  box-shadow: 0 2px 8px rgba(99, 102, 241, 0.3);
  transition: all 0.2s ease;
}

input[type="range"]::-moz-range-thumb:hover {
  background: #4f46e5;
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
}

/* 添加primary颜色定义以确保100%进度条正确显示 */
.from-primary {
  --tw-gradient-from: #6366f1;
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to, rgba(99, 102, 241, 0));
}

.to-primary-light {
  --tw-gradient-to: #818cf8;
}

.bg-primary {
  background-color: #6366f1;
}

.bg-primary-light {
  background-color: #818cf8;
}
</style>