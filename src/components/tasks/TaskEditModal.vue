<template>
  <div class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
    <div class="backdrop-blur-lg bg-white/10 rounded-2xl border border-white/20 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
      <!-- 头部 -->
      <div class="p-6 border-b border-white/20">
        <div class="flex items-center justify-between">
          <h2 class="text-2xl font-bold text-white">{{ isEdit ? '编辑任务' : '添加任务' }}</h2>
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
          <!-- 任务标题 -->
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">
              任务标题 <span class="text-red-400">*</span>
            </label>
            <input
              v-model="formData.title"
              type="text"
              placeholder="请输入任务标题"
              class="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
          </div>

          <!-- 任务描述 -->
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">任务描述</label>
            <textarea
              v-model="formData.description"
              rows="3"
              placeholder="请输入任务描述"
              class="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
            ></textarea>
          </div>

          <!-- 任务类型 -->
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">
              任务类型 <span class="text-red-400">*</span>
            </label>
            <div class="grid grid-cols-3 gap-2">
              <div
                v-for="taskType in taskTypeOptions"
                :key="taskType.value"
                @click="formData.task_type = taskType.value"
                class="cursor-pointer p-3 rounded-lg border-2 transition-all duration-200 flex items-center space-x-3"
                :class="[
                  formData.task_type === taskType.value
                    ? 'border-primary bg-primary/20 text-white'
                    : 'border-white/20 bg-white/5 text-gray-300 hover:border-white/40'
                ]"
              >
                <div class="text-xl">{{ taskType.icon }}</div>
                <div class="flex-1 text-left">
                  <div class="text-sm font-medium">{{ taskType.label }}</div>
                  <div class="text-xs mt-0.5" :class="formData.task_type === taskType.value ? 'text-gray-200' : 'text-gray-400'">{{ taskType.desc }}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- 优先级 -->
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">
              优先级 <span class="text-red-400">*</span>
            </label>
            <div class="grid grid-cols-4 gap-2">
              <div
                v-for="priority in priorityOptions"
                :key="priority.value"
                @click="formData.priority = priority.value"
                class="cursor-pointer p-3 rounded-lg border-2 transition-all duration-200 flex items-center space-x-3"
                :class="[
                  formData.priority === priority.value
                    ? 'border-primary bg-primary/20 text-white'
                    : 'border-white/20 bg-white/5 text-gray-300 hover:border-white/40'
                ]"
              >
                <div class="text-xl">{{ priority.icon }}</div>
                <div class="flex-1 text-left">
                  <div class="text-sm font-medium">{{ priority.label }}</div>
                  <div class="text-xs mt-0.5" :class="formData.priority === priority.value ? 'text-gray-200' : 'text-gray-400'">{{ priority.desc }}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- 截止日期和负责人 -->
          <div class="grid grid-cols-2 gap-4">
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
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">负责人</label>
              <div class="relative">
                <input
                  type="text"
                  :value="selectedAssignee ? selectedAssignee.name : '请选择负责人'"
                  readonly
                  @click="handleAssigneeClick"
                  :class="[
                    'w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent',
                    userStore.hasPersonalDataPermission() ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
                  ]"
                  placeholder="请选择负责人"
                />
                <button
                  v-if="selectedAssignee && !userStore.hasPersonalDataPermission()"
                  @click="clearAssignee"
                  class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  <i class="fas fa-times"></i>
                </button>
              </div>
            </div>
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
          {{ loading ? '提交中...' : (isEdit ? '更新' : '添加') }}
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
import { useUserStore } from '../../stores/user'

const props = defineProps({
  task: {
    type: Object,
    default: null
  },
  users: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['close', 'success'])

const userStore = useUserStore()
const loading = ref(false)
const showUserSelector = ref(false)
const selectedAssignee = ref(null)

const formData = reactive({
  title: '',
  description: '',
  priority: 'medium',
  task_type: 'work_execution',
  due_date: '',
  assignee_id: ''
})

const isEdit = ref(false)

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

// 获取默认日期（当前日期+1天）
const getDefaultDueDate = () => {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  tomorrow.setHours(18, 0, 0, 0) // 默认设置为下午6点
  return formatDateTimeLocal(tomorrow.toISOString())
}

// 任务类型选项
const taskTypeOptions = [
  {
    value: 'work_execution',
    label: '工作执行',
    icon: '🎯',
    desc: '日常工作执行'
  },
  {
    value: 'routine_task',
    label: '常规任务',
    icon: '📋',
    desc: '常规性工作任务'
  },
  {
    value: 'project_progress',
    label: '项目推进',
    icon: '🚀',
    desc: '项目进度推进'
  },
  {
    value: 'communication_coordination',
    label: '沟通协调',
    icon: '🤝',
    desc: '部门间沟通协调'
  },
  {
    value: 'problem_solving',
    label: '问题解决',
    icon: '🔧',
    desc: '技术问题解决'
  },
  {
    value: 'growth_improvement',
    label: '成长提升',
    icon: '📈',
    desc: '个人成长提升'
  }
]

// 优先级选项
const priorityOptions = [
  {
    value: '0_low',
    label: '低',
    icon: '🟢',
    desc: '普通'
  },
  {
    value: '1_medium',
    label: '中',
    icon: '🟡',
    desc: '重要'
  },
  {
    value: '2_high',
    label: '高',
    icon: '🟠',
    desc: '紧急'
  },
  {
    value: '3_urgent',
    label: '紧急',
    icon: '🔴',
    desc: '非常紧急'
  }
]

// 重置表单
const resetForm = () => {
  // 检查数据权限
  const hasPersonalPermission = userStore.hasPersonalDataPermission()
  
  // 默认设置当前登录用户为负责人
  const currentUser = userStore.userInfo
  if (currentUser) {
    if (hasPersonalPermission) {
      // 个人数据权限：只能分配给自己
      Object.assign(formData, {
        title: '',
        description: '',
        priority: 'medium',
        task_type: 'work_execution',
        due_date: getDefaultDueDate(),
        assignee_id: currentUser.id
      })
      selectedAssignee.value = {
        id: currentUser.id,
        name: currentUser.name || currentUser.username,
        email: currentUser.email,
        department: currentUser.department
      }
    } else {
      // 其他权限：默认分配给自己，但允许更改
      Object.assign(formData, {
        title: '',
        description: '',
        priority: 'medium',
        task_type: 'work_execution',
        due_date: getDefaultDueDate(),
        assignee_id: currentUser.id
      })
      selectedAssignee.value = {
        id: currentUser.id,
        name: currentUser.name || currentUser.username,
        email: currentUser.email,
        department: currentUser.department
      }
    }
  } else {
    Object.assign(formData, {
      title: '',
      description: '',
      priority: 'medium',
      task_type: 'work_execution',
      due_date: getDefaultDueDate(),
      assignee_id: ''
    })
    selectedAssignee.value = null
  }
}

// 监听props变化
watch(() => props.task, (newVal) => {
  if (newVal) {
    isEdit.value = true
    Object.assign(formData, {
      title: newVal.title,
      description: newVal.description || '',
      priority: newVal.priority,
      task_type: newVal.task_type || 'work_execution',
      due_date: newVal.due_date ? formatDateTimeLocal(newVal.due_date) : getDefaultDueDate(),
      assignee_id: newVal.assignee_id || ''
    })
    // 设置选中的负责人信息
    if (newVal.assignee_id && props.users && props.users.length > 0) {
      const assignee = props.users.find(user => user.id === newVal.assignee_id)
      if (assignee) {
        selectedAssignee.value = {
          id: assignee.id,
          name: assignee.name || assignee.username,
          email: assignee.email,
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
  } else {
    isEdit.value = false
    selectedAssignee.value = null
    resetForm()
  }
}, { immediate: true })

// 提交表单
const submitForm = async () => {
  if (!formData.title.trim()) {
    ElMessage.error('请输入任务标题')
    return
  }

  if (!formData.task_type) {
    ElMessage.error('请选择任务类型')
    return
  }

  if (!formData.due_date) {
    ElMessage.error('请选择截止日期')
    return
  }

  loading.value = true
  try {
    let response
    
    const submitData = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      taskType: formData.task_type,
      priority: formData.priority,
      dueDate: formData.due_date, // 将due_date映射为dueDate
      assignedTo: formData.assignee_id, // 将assignee_id映射为assignedTo
      status: 'pending' // 默认状态为待处理
    }
    
    // 如果选择了负责人，添加执行人名称和部门ID
    if (selectedAssignee.value) {
      submitData.assigneeName = selectedAssignee.value.name || selectedAssignee.value.username
      submitData.assigneeDepartmentId = selectedAssignee.value.department || null
    }
    
    // 只有在编辑模式下才包含执行进度字段
    if (isEdit.value && props.task && props.task.execution_progress !== undefined) {
      submitData.executionProgress = props.task.execution_progress
    }

    if (isEdit.value && props.task) {
      // 编辑模式
      response = await taskAPI.updateTask(props.task.id, submitData)
    } else {
      // 添加模式
      response = await taskAPI.createTask(submitData)
    }

    ElMessage.success(isEdit.value ? '任务更新成功' : '任务添加成功')
    emit('success', response.data)
    emit('close')
  } catch (error) {
    console.error('提交任务失败:', error)
    ElMessage.error(error.response?.data?.message || '提交失败')
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

// 处理负责人点击事件
const handleAssigneeClick = () => {
  // 检查数据权限
  if (userStore.hasPersonalDataPermission()) {
    ElMessage.warning('您只有个人数据权限，无法选择其他用户')
    return
  }
  showUserSelector.value = true
}

// 清除负责人选择
const clearAssignee = () => {
  // 个人数据权限不允许清除负责人
  if (userStore.hasPersonalDataPermission()) {
    ElMessage.warning('您只有个人数据权限，无法清除负责人')
    return
  }
  selectedAssignee.value = null
  formData.assignee_id = ''
}

// 生命周期
onMounted(() => {
  if (!isEdit.value) {
    resetForm()
  }
})
</script>