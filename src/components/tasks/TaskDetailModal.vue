<template>
  <div class="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 modal-scrollbar">
    <div class="relative w-full max-w-6xl mx-4 bg-slate-800/95 backdrop-blur-xl rounded-2xl border border-white/30 shadow-2xl transform transition-all duration-300 modal-glow max-h-[85vh] flex flex-col">
      <!-- 头部 -->
      <div class="flex justify-between items-center p-4 border-b border-white/20 bg-slate-900/50 rounded-t-2xl flex-shrink-0">
        <h3 class="text-xl font-bold bg-gradient-to-r from-primary via-primary-light to-blue-400 bg-clip-text text-transparent">
          任务详情
        </h3>
        <button @click="$emit('close')" class="text-gray-300 hover:text-white transition-all duration-300 hover:rotate-90 w-6 h-6 flex items-center justify-center rounded-full hover:bg-white/10 hover:shadow-lg">
          <i class="fas fa-times text-lg"></i>
        </button>
      </div>

      <!-- 内容 -->
      <div v-if="task" class="p-4 space-y-4 overflow-y-auto flex-1">
        <!-- 基本信息 -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <!-- 任务信息 -->
          <div class="bg-slate-700/30 rounded-2xl p-3 border border-white/10 shadow-lg backdrop-blur-sm modal-content-glow">
            <h4 class="text-base font-semibold mb-3 flex items-center bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
              <i class="fas fa-tasks mr-2 text-primary"></i>
              任务信息
            </h4>
            <div class="grid grid-cols-1 gap-2">
              <div class="w-full px-2 py-2 bg-slate-700/50 border border-white/20 rounded-lg text-white font-medium transition-all duration-300 hover:border-white/40 hover:shadow-lg text-xs">
                <div class="text-gray-400 text-xs mb-1">任务标题</div>
                {{ task.title }}
              </div>
              <div class="h-40 w-full px-2 py-2 bg-slate-700/50 border border-white/20 rounded-lg text-white transition-all duration-300 hover:border-white/40 text-xs">
                <div class="text-gray-400  text-xs mb-1">任务描述</div>
                {{ task.description || '-' }}
              </div>
              
            </div>
          </div>

          <!-- 人员信息 -->
          <div class="bg-slate-700/30 rounded-2xl p-3 border border-white/10 shadow-lg backdrop-blur-sm modal-content-glow">
             <h4 class="text-base font-semibold mb-3 flex items-center bg-gradient-to-r from-primary via-primary-light to-blue-400 bg-clip-text text-transparent">
            <i class="fas fa-users mr-2 text-green-500"></i>
              其他信息
            </h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div class="w-full px-2 py-2 bg-slate-700/50 border border-white/20 rounded-lg text-white transition-all duration-300 hover:border-white/40 text-xs">
                <div class="text-gray-400 text-xs mb-1">创建人</div>
                {{ task.creator_name || '未知' }}
              </div>
              <div class="w-full px-2 py-2 bg-slate-700/50 border border-white/20 rounded-lg text-white transition-all duration-300 hover:border-white/40 text-xs">
                <div class="text-gray-400 text-xs mb-1">负责人</div>
                {{ task.assignee_name || '未分配' }}
              </div>
              <div class="w-full px-2 py-2 bg-slate-700/50 border border-white/20 rounded-lg text-white transition-all duration-300 hover:border-white/40 text-xs">
                <div class="text-gray-400 text-xs mb-1">优先级</div>
                <span :class="getPriorityClass(task.priority)" class="px-2 py-1 rounded-full text-xs font-medium">
                  {{ getPriorityText(task.priority) }}
                </span>
              </div>
              <div class="w-full px-2 py-2 bg-slate-700/50 border border-white/20 rounded-lg text-white transition-all duration-300 hover:border-white/40 text-xs">
                <div class="text-gray-400 text-xs mb-1">任务类型</div>
                {{ getTaskTypeText(task.task_type) }}
              </div>
              <div class="w-full px-2 py-2 bg-slate-700/50 border border-white/20 rounded-lg text-white transition-all duration-300 hover:border-white/40 text-xs">
                <div class="text-gray-400 text-xs mb-1">状态</div>
                <span :class="getStatusClass(task.status)" class="px-2 py-1 rounded-full text-xs font-medium">
                  {{ getStatusText(task.status) }}
                </span>
              </div>
              <div class="w-full px-2 py-2 bg-slate-700/50 border border-white/20 rounded-lg text-white transition-all duration-300 hover:border-white/40 text-xs">
                <div class="text-gray-400 text-xs mb-1">进度</div>
                <span class="font-medium text-blue-300 text-xs">{{ task.executionProgress }}%</span>
              </div>
            <div class="w-full px-2 py-2 bg-slate-700/50 border border-white/20 rounded-lg text-white transition-all duration-300 hover:border-white/40 text-xs">
                    <div class="text-gray-400 text-xs mb-1">创建时间</div>
                    {{ formatDate(task.createdAt) }}
                  </div>
                  <div class="w-full px-2 py-2 bg-slate-700/50 border border-white/20 rounded-lg text-white transition-all duration-300 hover:border-white/40 text-xs">
                    <div class="text-gray-400 text-xs mb-1">截止日期</div>
                    {{ formatDate(task.dueDate) }}
                    <div v-if="isOverdue(task.due_date, task.status)" class="text-xs text-red-400 mt-1 flex items-center">
                      <i class="fas fa-exclamation-circle mr-1"></i>已逾期
                    </div>
                  </div>
            </div>
              
          </div>
        </div>

        <!-- 任务进度条 -->
        <div class="bg-slate-700/30 rounded-2xl p-3 border border-white/10 shadow-lg backdrop-blur-sm modal-content-glow">
          <h4 class="text-base font-semibold mb-3 flex items-center bg-gradient-to-r from-primary via-primary-light to-blue-400 bg-clip-text text-transparent">
            <i class="fas fa-chart-line mr-2 text-primary"></i>
            执行进度
          </h4>
          <div class="relative">
            <div class="flex-1 bg-slate-700/50 border border-white/20 rounded-full h-3 overflow-hidden">
              <div 
                class="h-3 rounded-full bg-gradient-to-r from-primary via-primary-light to-blue-400 transition-all duration-1000 ease-out" 
                :style="{ width: task.executionProgress + '%' }"
              >
                <div class="h-full bg-white/20 animate-pulse"></div>
              </div>
            </div>
            <div class="flex justify-between mt-1 text-xs text-gray-300">
              <span>开始</span>
              <span v-if="task.executionProgress < 100">进行中</span>
              <span v-else>完成</span>
            </div>
          </div>
        </div>

        <!-- 附件信息 -->
        <div v-if="task.attachments && task.attachments.length > 0" class="bg-slate-700/30 rounded-2xl p-3 border border-white/10 shadow-lg backdrop-blur-sm modal-content-glow">
          <h4 class="text-base font-semibold mb-3 flex items-center bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
            <i class="fas fa-paperclip mr-2 text-yellow-500"></i>
            附件信息
          </h4>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div v-for="(attachment, index) in task.attachments" :key="index" class="flex items-center space-x-3 p-3 bg-slate-700/50 border border-white/20 rounded-lg hover:bg-slate-700/70 transition-all duration-300 cursor-pointer group text-xs">
              <div class="w-8 h-8 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <i class="fas fa-file text-white text-xs"></i>
              </div>
              <div class="flex-1 min-w-0">
                <div class="text-white font-medium truncate text-xs">{{ attachment.name }}</div>
                <div class="text-gray-400 text-xs">{{ formatFileSize(attachment.size) }}</div>
              </div>
              <i class="fas fa-download text-gray-400 group-hover:text-white transition-colors text-xs"></i>
            </div>
          </div>
        </div>

        <!-- 任务进度历史 -->
        <div class="bg-slate-700/30 rounded-2xl p-3 border border-white/10 shadow-lg backdrop-blur-sm modal-content-glow">
          <div class="flex items-center justify-between mb-3">
             <h4 class="text-base font-semibold mb-3 flex items-center bg-gradient-to-r from-primary via-primary-light to-blue-400 bg-clip-text text-transparent">
            <i class="fas fa-history mr-2 text-purple-500"></i>
              进度历史
            </h4>
            <button 
              @click="loadProgressHistory"
              class="px-3 py-1 bg-primary/20 text-primary rounded-lg hover:bg-primary/30 hover:text-white transition-all duration-300 flex items-center space-x-1 text-xs font-medium backdrop-blur-sm"
            >
              <i class="fas fa-sync-alt"></i>
              <span>刷新</span>
            </button>
          </div>
          <div v-if="progressHistory.length > 0" class="space-y-3 max-h-64 overflow-y-auto custom-scrollbar">
            <div v-for="(history, index) in progressHistory" :key="index" class="relative">
              <div class="flex items-start space-x-3 p-3 bg-slate-700/50 border border-white/20 rounded-lg hover:bg-slate-700/70 transition-all duration-300">
                <div class="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center shadow-lg">
                  <i class="fas fa-chart-line text-white text-xs"></i>
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-center justify-between mb-2">
                    <!-- 进度条 - 与时间显示在同一行，固定长度 -->
                  <div class="flex items-center space-x-2 mb-2">
                    <div class="w-120 bg-slate-600/50 rounded-full h-1.5">
                      <div 
                        class="h-1.5 rounded-full transition-all duration-300"
                        :class="getProgressBarClass(history.progress)"
                        :style="{ width: history.progress + '%' }"
                      ></div>
                    </div>
                    <span class="text-xs text-gray-300 font-medium">{{ history.progress }}%</span>
                  </div>
                    <span class="text-gray-400 text-xs">{{ formatDateTime(history.created_at) }}</span>
                  </div>
                  
                  <div v-if="history.comment" class="text-gray-200 text-xs mb-1 leading-relaxed">{{ history.comment }}</div>
                  <div class="flex items-center space-x-2 text-xs text-gray-400">
                    <i class="fas fa-user"></i>
                    <span>操作人: {{ history.operator_name || '系统' }}</span>
                  </div>
                </div>
              </div>
              <div v-if="index < progressHistory.length - 1" class="absolute left-4 top-10 w-0.5 h-3 bg-gradient-to-b from-white/20 to-transparent"></div>
            </div>
          </div>
          <div v-else class="text-center py-6">
            <i class="fas fa-history text-gray-400 text-2xl mb-2"></i>
            <p class="text-gray-400 text-xs">暂无进度历史</p>
          </div>
        </div>
      </div>

      <!-- 底部操作 -->
      <div class="flex justify-end p-4 border-t border-white/20 bg-slate-900/50 rounded-b-2xl flex-shrink-0">
        <div class="flex space-x-3">
          <button 
            v-if="task.status === '2_pending' && props.showbutton"
            @click="startExecution"
            class="px-4 py-2 bg-primary/20 text-primary border border-primary/30 rounded-lg hover:bg-primary/30 hover:border-primary/50 hover:text-white transition-all duration-300 font-medium flex items-center space-x-2 text-sm backdrop-blur-sm"
          >
            <i class="fas fa-play"></i>
            <span>开始执行</span>
          </button>
          <button 
            @click="updateProgress"
            v-if="task.status === '0_in_progress' && props.showbutton"
            class="px-4 py-2 bg-green-500/20 text-green-400 border border-green-500/30 rounded-lg hover:bg-green-500/30 hover:border-green-500/50 hover:text-white transition-all duration-300 font-medium flex items-center space-x-2 text-sm backdrop-blur-sm"
          >
            <i class="fas fa-chart-line"></i>
            <span>更新进度</span>
          </button>
          <button 
            @click="$emit('close')"
            class="px-4 py-2 bg-white/10 text-white border border-white/20 rounded-lg hover:bg-white/20 hover:border-white/40 transition-all duration-300 font-medium flex items-center space-x-2 text-sm backdrop-blur-sm"
          >
            <i class="fas fa-times"></i>
            <span>关闭</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 模态框样式 - 参考ContactRecordManagement.vue */
.modal-glow {
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1);
}

.modal-content-glow {
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
}

.modal-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.modal-scrollbar::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 3px;
}

.modal-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
}

.modal-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}

/* 渐入动画 */
.rounded-2xl {
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* 自定义滚动条 */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}

/* 悬停效果 */
.group:hover .group-hover\:scale-110 {
  transform: scale(1.1);
}

.group:hover .group-hover\:text-white {
  color: white;
}

.group:hover .group-hover\:rotate-90 {
  transform: rotate(90deg);
}

/* 脉冲动画 */
.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: .5;
  }
}

/* 按钮悬停动画 */
button:hover {
  transform: translateY(-1px);
}

/* 渐变背景定义 */
.bg-gradient-to-r {
  background-image: linear-gradient(to right, var(--tw-gradient-stops));
}

.from-primary {
  --tw-gradient-from: #3b82f6;
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to, rgba(59, 130, 246, 0));
}

.to-primary-light {
  --tw-gradient-to: #60a5fa;
}

.bg-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.bg-primary-light {
  background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
}
</style>

<script setup>
import { ref, onMounted } from 'vue'
import { taskAPI } from '../../api/tasks.js'

const props = defineProps({
  task: {
    type: Object,
    required: true
  },
  showbutton: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['close', 'start-execution', 'update-progress', 'update-status'])

const progressHistory = ref([])

// 加载进度历史
const loadProgressHistory = async () => {
  try {
    const response = await taskAPI.getTaskProgressHistory(props.task.id, {
      page: 1,
      pageSize: 20
    })
    // 适配后端返回的数据结构
    if (response.data && response.data.records) {
      progressHistory.value = response.data.records.map(record => ({
        progress: record.currentProgress || 0,
        comment: record.actionDescription || '',
        created_at: record.createdAt,
        operator_name: record.executedUser?.name || '系统'
      }))
    } else {
      progressHistory.value = []
    }
  } catch (error) {
    console.error('加载进度历史失败:', error)
    progressHistory.value = []
  }
}

// 开始执行任务
const startExecution = () => {
  emit('start-execution', props.task)
}

// 更新进度
const updateProgress = () => {
  console.log('TaskDetailModal: 更新进度按钮被点击，任务状态:', props.task.status)
  console.log('TaskDetailModal: 触发update-progress事件')
  emit('update-progress', props.task)
}

// 更新任务状态
const updateTaskStatus = (status) => {
  emit('update-status', props.task, status)
}

// 格式化函数
const formatDate = (dateString) => {
  if (!dateString) return '无'
  return new Date(dateString).toLocaleDateString('zh-CN')
}

const formatDateTime = (dateString) => {
  if (!dateString) return '无'
  return new Date(dateString).toLocaleString('zh-CN')
}

const formatFileSize = (bytes) => {
  if (!bytes) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const isOverdue = (dueDate, status) => {
  if (!dueDate || status === '3_completed' || status === '4_cancelled') return false
  return new Date(dueDate) < new Date()
}

const getStatusClass = (status) => {
  const classes = {
    '2_pending': 'bg-yellow-500/20 text-yellow-400',
    '1_wait': 'bg-orange-500/20 text-orange-400',
    '0_in_progress': 'bg-blue-500/20 text-blue-400',
    '3_completed': 'bg-green-500/20 text-green-400',
    '4_cancelled': 'bg-gray-500/20 text-gray-400',
    '5_failed': 'bg-red-500/20 text-red-400'
  }
  return classes[status] || 'bg-gray-500/20 text-gray-400'
}

const getStatusText = (status) => {
  const texts = {
    '2_pending': '待处理',
    '1_wait': '待处理',
    '0_in_progress': '进行中',
    '3_completed': '已完成',
    '4_cancelled': '已取消'
  }
  return texts[status] || status
}

const getPriorityClass = (priority) => {
  const classes = {
    '0_low': 'bg-gray-500/20 text-gray-400',
    '1_medium': 'bg-yellow-500/20 text-yellow-400',
    '2_high': 'bg-orange-500/20 text-orange-400',
    '3_urgent': 'bg-red-500/20 text-red-400'
  }
  return classes[priority] || 'bg-gray-500/20 text-gray-400'
}

const getPriorityText = (priority) => {
  const texts = {
    '0_low': '低',
    '1_medium': '中',
    '2_high': '高',
    '3_urgent': '紧急'
  }
  return texts[priority] || priority
}

const getTaskTypeText = (taskType) => {
  const texts = {
    work_execution: '工作执行',
    routine_task: '常规任务',
    project_progress: '项目推进',
    communication_coordination: '沟通协调',
    problem_solving: '问题解决',
    growth_improvement: '成长提升'
  }
  return texts[taskType] || taskType
}

const getProgressBarClass = (progress) => {
  if (progress < 30) return 'bg-red-500'
  if (progress < 60) return 'bg-yellow-500'
  if (progress < 90) return 'bg-blue-500'
  return 'bg-green-500'
}

// 生命周期
onMounted(() => {
  loadProgressHistory()
})
</script>