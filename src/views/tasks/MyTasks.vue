<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
    <!-- 动态背景装饰 -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full filter blur-3xl animate-float"></div>
      <div class="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-info/10 to-success/10 rounded-full filter blur-3xl animate-float" style="animation-delay: -1.5s;"></div>
      <div class="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-r from-warning/5 to-danger/5 rounded-full filter blur-2xl animate-pulse"></div>
    </div>
    
    <!-- 导航栏组件 -->
    <NavigationBar />

    <!-- 主内容区 -->
    <div class="relative z-10 max-w-1400 mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- 页面标题和操作区 -->
      <div class="mb-8 animate-fade-in">
        <div class="backdrop-blur-lg bg-white/5 rounded-2xl border border-white/10 shadow-2xl p-8 mb-8">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div class="flex items-center space-x-4">
              <div class="w-12 h-12 bg-gradient-to-br from-green-500 via-green-600 to-green-700 rounded-2xl flex items-center justify-center shadow-lg">
                <i class="fas fa-tasks text-white text-xl"></i>
              </div>
              <div class="space-y-2">
                <h1 class="text-4xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
                  我的任务
                </h1>
                <p class="text-gray-400 text-lg">查看和管理分配给我的任务</p>
              </div>
            </div>
            <div class="flex space-x-3">
              <button 
                @click="refreshTasks"
                class="px-6 py-3 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:from-blue-600 hover:via-blue-700 hover:to-blue-800 text-white font-semibold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-0.5 active:scale-95 flex items-center space-x-3 group"
              >
                <i class="fas fa-sync-alt group-hover:rotate-180 transition-transform duration-300 text-sm"></i>
                <span class="text-sm">刷新</span>
              </button>
            </div>
          </div>
        </div>
      </div>



      <!-- 搜索和筛选 -->
      <div class="backdrop-blur-lg bg-white/10 rounded-2xl border border-white/20 shadow-xl p-6 mb-8">
        <div class="flex flex-wrap gap-4 items-center">
          <div class="flex-1 min-w-64">
            <div class="relative">
              <input 
                v-model="searchKeyword" 
                type="text" 
                placeholder="搜索任务标题、描述..."
                class="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
              >
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i class="fas fa-search text-gray-400"></i>
              </div>
            </div>
          </div>
          <div class="flex gap-3">
            <select 
              v-model="statusFilter"
              class="px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
            >
              <option value="" class="bg-slate-800">所有状态</option>
              <option value="2_pending" class="bg-slate-800">待处理</option>
                      <option value="1_wait" class="bg-slate-800">待执行</option>
                      <option value="0_in_progress" class="bg-slate-800">进行中</option>
                      <option value="3_completed" class="bg-slate-800">已完成</option>
                      <option value="4_cancelled" class="bg-slate-800">已取消</option>
            </select>
            <select 
              v-model="priorityFilter"
              class="px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
            >
              <option value="" class="bg-slate-800">所有优先级</option>
              <option value="0_low" class="bg-slate-800">低</option>
                      <option value="1_medium" class="bg-slate-800">中</option>
                      <option value="2_high" class="bg-slate-800">高</option>
              <option value="3_urgent" class="bg-slate-800">紧急</option>
            </select>
            <button 
              @click="searchTasks"
              class="px-6 py-3 bg-gradient-to-r from-primary to-primary-light text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <i class="fas fa-search mr-2"></i>
              搜索
            </button>
            <button 
              @click="resetFilter"
              class="px-6 py-3 bg-white/10 text-white border border-white/20 rounded-xl hover:bg-white/20 transition-all duration-300"
            >
              <i class="fas fa-redo mr-2"></i>
              重置
            </button>
          </div>
        </div>
      </div>

      <!-- 任务列表 -->
      <div class="backdrop-blur-lg bg-white/10 rounded-2xl border border-white/20 shadow-xl overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-white/5 border-b border-white/20">
              <tr>
                <th class="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">任务</th>
                <th class="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">任务类型</th>
                <th class="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">优先级</th>
                <th class="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">状态</th>
                <th class="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">进度</th>
                <th class="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">截止日期</th>
                <th class="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">操作</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-white/10">
              <tr v-for="task in tasks" :key="task.id" class="hover:bg-white/5 transition-colors duration-200">
                <td class="px-6 py-4">
                  <div class="space-y-1">
                    <div class="text-sm font-medium text-white">{{ task.title }}</div>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <span :class="getTaskTypeClass(task.taskType)" class="px-3 py-1 text-xs font-medium rounded-full">
                    {{ getTaskTypeText(task.taskType) }}
                  </span>
                </td>
                <td class="px-6 py-4">
                  <span :class="getPriorityClass(task.priority)" class="px-3 py-1 text-xs font-medium rounded-full">
                    {{ getPriorityText(task.priority) }}
                  </span>
                </td>
                <td class="px-6 py-4">
                  <span :class="getStatusClass(task.status)" class="px-3 py-1 text-xs font-medium rounded-full">
                    {{ getStatusText(task.status) }}
                  </span>
                </td>
               
                <td class="px-6 py-4">
                  <div class="flex items-center space-x-2">
                    <div class="w-32 bg-white/10 rounded-full h-2">
                      <div 
                        class="h-2 rounded-full transition-all duration-300" 
                        :class="getProgressBarClass(task.executionProgress)"
                        :style="{ width: task.executionProgress + '%' }"
                      ></div>
                    </div>
                    <span class="text-sm text-white">{{ task.executionProgress }}%</span>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <div class="text-sm text-white">{{ formatDate(task.dueDate) }}</div>
                  <div v-if="isOverdue(task.dueDate, task.status)" class="text-xs text-red-400">已逾期</div>
                </td>
                <td class="px-6 py-4">
                  <div class="flex space-x-1">
                    <button 
                      @click="viewTask(task)"
                      class="w-8 h-8 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors flex items-center justify-center"
                      title="查看"
                    >
                      <i class="fas fa-eye text-sm"></i>
                    </button>
                    <button 
                      @click="startTask(task)"
                      v-if="task.status === '1_wait'"
                      class="w-8 h-8 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors flex items-center justify-center"
                      title="开始任务"
                    >
                      <i class="fas fa-play text-sm"></i>
                    </button>
                    <button 
                      @click="updateProgress(task)"
                      v-if="task.status === '0_in_progress'"
                      class="w-8 h-8 bg-orange-500/20 text-orange-400 rounded-lg hover:bg-orange-500/30 transition-colors flex items-center justify-center"
                      title="更新进度"
                    >
                      <i class="fas fa-chart-line text-sm"></i>
                    </button>
                   
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <!-- 分页 -->
        <div class="bg-white/5 px-6 py-4 flex items-center justify-between border-t border-white/20">
          <div class="text-sm text-gray-400">
            显示 {{ (currentPage - 1) * pageSize + 1 }} 到 {{ Math.min(currentPage * pageSize, totalTasks) }} 条，共 {{ totalTasks }} 条记录
          </div>
          <div class="flex space-x-2">
            <button 
              @click="prevPage"
              :disabled="currentPage === 1"
              class="px-4 py-2 bg-white/10 text-white border border-white/20 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/20 transition-all duration-300"
            >
              <i class="fas fa-chevron-left mr-2"></i>
              上一页
            </button>
            <span class="px-4 py-2 bg-white/10 text-white border border-white/20 rounded-xl">
              {{ currentPage }} / {{ Math.ceil(totalTasks / pageSize) }}
            </span>
            <button 
              @click="nextPage"
              :disabled="currentPage * pageSize >= totalTasks"
              class="px-4 py-2 bg-white/10 text-white border border-white/20 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/20 transition-all duration-300"
            >
              下一页
              <i class="fas fa-chevron-right ml-2"></i>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 任务详情弹窗 -->
    <TaskDetailModal
      v-if="showDetailModal"
      :task="currentTask"
      :showbutton="true"
      @close="closeDetailModal"
      @update-status="handleUpdateStatus"
      @update-progress="handleUpdateProgress"
    />

    <!-- 更新进度弹窗 -->
    <TaskProgressModal
      v-if="showProgressModal"
      :task="currentTask"
      :progressData="currentProgress"
      @close="closeProgressModal"
      @success="handleProgressSuccess"
    />
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import NavigationBar from '../../components/NavigationBar.vue'
import TaskDetailModal from '../../components/tasks/TaskDetailModal.vue'
import TaskProgressModal from '../../components/tasks/TaskProgressModal.vue'
import { taskAPI } from '../../api/tasks.js'
import { ElMessage } from 'element-plus'
import { useUserStore } from '../../stores/user'

// 响应式数据
const userStore = useUserStore()
const tasks = ref([])
const loading = ref(false)
const searchKeyword = ref('')
const statusFilter = ref('')
const priorityFilter = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const totalTasks = ref(0)
const showProgressModal = ref(false)
const currentTask = ref(null)
const showDetailModal = ref(false)
const currentProgress = ref(null)

// 任务统计数据
const taskStats = ref({
  total: 0,
  inProgress: 0,
  completed: 0,
  overdue: 0
})



// 方法定义
const loadTasks = async () => {
  loading.value = true
  try {
    const params = {
      page: currentPage.value,
      pageSize: pageSize.value,
      status: statusFilter.value || undefined,
      priority: priorityFilter.value || undefined,
      search: searchKeyword.value || undefined
    }
    
    const response = await taskAPI.getMyTasks(params)
    tasks.value = response.data
    totalTasks.value = response.pagination.total
    
    // 调试：检查任务状态
    console.log('任务数据:', response.data)
    if (response.data && response.data.length > 0) {
      console.log('第一个任务的状态:', response.data[0].status)
    }
    
    // 更新统计数据
    updateTaskStats()
  } catch (error) {
    console.error('加载任务失败:', error)
  } finally {
    loading.value = false
  }
}

const updateTaskStats = () => {
  const allTasks = tasks.value
  taskStats.value = {
    total: allTasks.length,
    inProgress: allTasks.filter(t => t.status === '0_in_progress').length,
      completed: allTasks.filter(t => t.status === '3_completed').length,
    overdue: allTasks.filter(t => isOverdue(t.due_date, t.status)).length
  }
}



const searchTasks = () => {
  currentPage.value = 1
  loadTasks()
}

const resetFilter = () => {
  searchKeyword.value = ''
  statusFilter.value = ''
  priorityFilter.value = ''
  currentPage.value = 1
  loadTasks()
}

const refreshTasks = () => {
  loadTasks()
}

const viewTask = (task) => {
  currentTask.value = task
  showDetailModal.value = true
}

const startTask = async (task) => {
  try {
    await taskAPI.updateTaskStatus(task.id, 'in_progress')
    ElMessage.success('任务已开始执行')
    loadTasks() // 重新加载任务列表
  } catch (error) {
    console.error('开始任务失败:', error)
    ElMessage.error('开始任务失败')
  }
}

const updateProgress = (task) => {
  currentTask.value = task
  currentProgress.value = {
    progress: task.executionProgress || 0,
    status: task.status || 'in_progress',
    comment: ''
  }
  showProgressModal.value = true
}

const manageExecutions = (task) => {
  currentTask.value = task
  // 直接打开任务详情模态框，在详情中查看进度历史
  viewTask(task)
}

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
    loadTasks()
  }
}

const nextPage = () => {
  if (currentPage.value * pageSize.value < totalTasks.value) {
    currentPage.value++
    loadTasks()
  }
}

// 格式化函数
const formatDate = (dateString) => {
  if (!dateString) return '无截止日期'
  return new Date(dateString).toLocaleDateString('zh-CN')+' '+new Date(dateString).toLocaleTimeString('zh-CN')
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
    '1_wait': '待执行',
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

const getTaskTypeClass = (taskType) => {
  const classes = {
    work_execution: 'bg-purple-500/20 text-purple-400',
    routine_task: 'bg-gray-500/20 text-gray-400',
    project_progress: 'bg-blue-500/20 text-blue-400',
    communication_coordination: 'bg-green-500/20 text-green-400',
    problem_solving: 'bg-orange-500/20 text-orange-400',
    growth_improvement: 'bg-pink-500/20 text-pink-400'
  }
  return classes[taskType] || 'bg-gray-500/20 text-gray-400'
}

const getProgressBarClass = (progress) => {
  if (progress < 30) return 'bg-gradient-to-r from-red-500 to-red-400'
  if (progress < 60) return 'bg-gradient-to-r from-yellow-500 to-yellow-400'
  if (progress < 90) return 'bg-gradient-to-r from-blue-500 to-blue-400'
  return 'bg-gradient-to-r from-green-500 to-green-400'
}

// 生命周期
onMounted(() => {
  loadTasks()
})
// 关闭弹窗
const closeDetailModal = () => {
  showDetailModal.value = false
  currentTask.value = null
}

const closeProgressModal = () => {
  showProgressModal.value = false
  currentTask.value = null
  currentProgress.value = null
}

// 执行记录成功提交
const handleProgressSuccess = () => {
  closeProgressModal()
  loadTasks()
}

// 处理状态更新
const handleUpdateStatus = (task) => {
  closeDetailModal()
  // 直接打开进度更新模态框，用户可以在那里修改状态
  updateProgress(task)
}

// 处理进度更新
const handleUpdateProgress = (task) => {
  console.log('handleUpdateProgress被调用，任务:', task)
  closeDetailModal()
  console.log('详情模态框已关闭，准备打开进度模态框')
  updateProgress(task)
  console.log('进度模态框应该已打开，showProgressModal:', showProgressModal.value)
}

</script>