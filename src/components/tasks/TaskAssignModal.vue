<template>
  <div class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
    <div class="backdrop-blur-lg bg-white/10 rounded-2xl border border-white/20 shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden">
      <!-- 头部 -->
      <div class="p-6 border-b border-white/20">
        <div class="flex items-center justify-between">
          <h2 class="text-2xl font-bold text-white">分配任务</h2>
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
        <div class="mb-6">
          <div class="text-gray-300 text-sm mb-2">任务标题</div>
          <div class="text-white font-medium">{{ task.title }}</div>
        </div>

        <form @submit.prevent="submitForm" class="space-y-6">
          <!-- 负责人 -->
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">
              分配给谁 <span class="text-red-400">*</span>
            </label>
            <div class="relative">
              <input
                type="text"
                :value="selectedAssignee ? selectedAssignee.name : '请选择负责人'"
                readonly
                @click="showUserSelector = true"
                class="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent cursor-pointer"
                placeholder="请选择负责人"
              />
              <button
                v-if="selectedAssignee"
                @click="clearAssignee"
                class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              >
                <i class="fas fa-times"></i>
              </button>
            </div>
          </div>

          <!-- 截止日期 -->
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">
              截止日期 <span class="text-red-400">*</span>
            </label>
            <input
              v-model="formData.due_date"
              type="datetime-local"
              class="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
          </div>
        </form>
      </div>

      <!-- 底部操作 -->
      <div class="p-6 border-t border-white/20 flex justify-end space-x-3">
        <button 
          @click="$emit('close')"
          class="px-6 py-2 bg-white/10 text-white border border-white/20 rounded-xl hover:bg-white/20 transition-all duration-300"
        >
          取消
        </button>
        <button 
          @click="submitForm"
          :disabled="loading"
          class="px-6 py-2 bg-gradient-to-r from-primary to-primary-light text-white rounded-xl hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <i v-if="loading" class="fas fa-spinner fa-spin mr-2"></i>
          {{ loading ? '分配中...' : '确认分配' }}
        </button>
      </div>
    </div>
  </div>
  
  <!-- 用户选择器模态框 -->
  <UserSelectorModal
    v-model:visible="showUserSelector"
    @select="handleUserSelect"
  />
</template>

<script setup>
import { ref, reactive, watch, onMounted } from 'vue'
import { taskAPI } from '../../api/tasks.js'
import { ElMessage } from 'element-plus'
import UserSelectorModal from '../UserSelectorModal.vue'

const props = defineProps({
  task: {
    type: Object,
    required: true
  },
  users: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['close', 'success'])

const loading = ref(false)
const showUserSelector = ref(false)
const selectedAssignee = ref(null)

const formData = reactive({
  assignee_id: '',
  comment: '',
  due_date: ''
})

// 监听props变化
watch(() => props.task, (newVal) => {
  if (newVal) {
    formData.assignee_id = newVal.assignee_id || ''
    formData.due_date = newVal.due_date ? formatDateTimeLocal(newVal.due_date) : ''
    
    // 设置选中的负责人信息
    if (newVal.assignee_id && props.users && props.users.length > 0) {
      const assignee = props.users.find(user => user.id === newVal.assignee_id)
      if (assignee) {
        selectedAssignee.value = {
          id: assignee.id,
          name: assignee.name || assignee.username,
          department: assignee.department
        }
      }
    } else if (newVal.assigneeName) {
      // 如果任务对象中包含assigneeName，直接使用
      selectedAssignee.value = {
        id: newVal.assignee_id,
        name: newVal.assigneeName,
        department: newVal.assigneeDepartmentId
      }
    }
  }
}, { immediate: true })

// 格式化日期时间
const formatDateTimeLocal = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${year}-${month}-${day}T${hours}:${minutes}`
}

// 提交表单
const submitForm = async () => {
  if (!formData.assignee_id) {
    ElMessage.error('请选择负责人')
    return
  }

  if (!formData.due_date) {
    ElMessage.error('请选择截止日期')
    return
  }

  loading.value = true
  try {
    // 调用分配任务API，传递所有必需参数
    const response = await taskAPI.assignTask(
      props.task.id, 
      formData.assignee_id, 
      '', 
      selectedAssignee.value?.name || '', 
      selectedAssignee.value?.department || ''
    )

    ElMessage.success('任务分配成功')
    emit('success', response.data)
    emit('close')
  } catch (error) {
    console.error('分配任务失败:', error)
    ElMessage.error(error.response?.data?.message || '分配失败')
  } finally {
    loading.value = false
  }
}

// 处理用户选择
const handleUserSelect = (user) => {
  selectedAssignee.value = user
  formData.assignee_id = user.id
  showUserSelector.value = false
}

// 清除负责人选择
const clearAssignee = () => {
  selectedAssignee.value = null
  formData.assignee_id = ''
}

// 生命周期
onMounted(() => {
  // 设置默认截止日期为一周后
  if (!formData.due_date) {
    const nextWeek = new Date()
    nextWeek.setDate(nextWeek.getDate() + 7)
    formData.due_date = formatDateTimeLocal(nextWeek)
  }
})
</script>