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
      <!-- 欢迎区域 -->
      <div class="mb-8 animate-fade-in">
        <div class="backdrop-blur-lg bg-white/5 rounded-2xl border border-white/10 p-8 shadow-2xl">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-6">
              <div class="w-16 h-16 bg-gradient-to-br from-primary to-primary-light rounded-2xl flex items-center justify-center shadow-lg">
                <i class="fas fa-user text-white text-2xl"></i>
              </div>
              <div>
                <h1 class="text-4xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent mb-2">
                  欢迎回来，{{ userStore.userInfo?.username }}！
                </h1>
                <p class="text-gray-300 text-lg">这是您的管理仪表板</p>
              </div>
            </div>
            <div class="text-right space-y-3">
              <div class="flex items-center justify-end space-x-2 text-sm">
                <span class="flex items-center text-emerald-400">
                  <i class="fas fa-circle text-emerald-400 text-xs mr-1 animate-pulse"></i>
                  在线状态
                </span>
              </div>
              <div class="text-gray-400 text-sm">
                {{ new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' }) }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 统计卡片 - 玻璃拟态效果 -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <!-- 费用已审批金额 -->
        <div class="backdrop-blur-lg bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 rounded-2xl border border-emerald-400/30 p-6 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 animate-fade-in" style="animation-delay: 0.1s">
          <div class="flex items-center">
            <div class="p-3 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl shadow-lg">
              <i class="fas fa-check-circle text-white text-xl"></i>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-emerald-200 opacity-90">费用已审批金额</p>
              <p class="text-2xl font-bold text-gray-50 tracking-tight">{{ userStats.approved_expense_amount?.toLocaleString() || 0 }}</p>
            </div>
          </div>
        </div>
        
        <!-- 费用待审批数量 -->
        <div class="backdrop-blur-lg bg-gradient-to-br from-amber-500/20 to-amber-600/10 rounded-2xl border border-amber-400/30 p-6 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 animate-fade-in" style="animation-delay: 0.2s">
          <div class="flex items-center">
            <div class="p-3 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl shadow-lg">
              <i class="fas fa-clock text-white text-xl"></i>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-amber-200 opacity-90">费用待审批数量</p>
              <p class="text-2xl font-bold text-gray-50 tracking-tight">{{ userStats.pending_expense_count || 0 }}</p>
            </div>
          </div>
        </div>
        
        <!-- 设备申请已批准总数 -->
        <div class="backdrop-blur-lg bg-gradient-to-br from-blue-500/20 to-blue-600/10 rounded-2xl border border-blue-400/30 p-6 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 animate-fade-in" style="animation-delay: 0.3s">
          <div class="flex items-center">
            <div class="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
              <i class="fas fa-laptop text-white text-xl"></i>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-blue-200 opacity-90">设备已批准总数</p>
              <p class="text-2xl font-bold text-gray-50 tracking-tight">{{ userStats.approved_equipment_quantity || 0 }}</p>
            </div>
          </div>
        </div>
        
        <!-- 设备待审批数量 -->
        <div class="backdrop-blur-lg bg-gradient-to-br from-rose-500/20 to-rose-600/10 rounded-2xl border border-rose-400/30 p-6 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 animate-fade-in" style="animation-delay: 0.4s">
          <div class="flex items-center">
            <div class="p-3 bg-gradient-to-br from-rose-500 to-rose-600 rounded-xl shadow-lg">
              <i class="fas fa-hourglass-half text-white text-xl"></i>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-rose-200 opacity-90">设备待审批数量</p>
              <p class="text-2xl font-bold text-gray-50 tracking-tight">{{ userStats.pending_equipment_count || 0 }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 主要内容区域 - 重新布局 -->
      <div class="grid grid-cols-1 xl:grid-cols-12 gap-8">
        <!-- 左侧主要内容区 -->
        <div class="xl:col-span-8 space-y-8">
          <!-- 最近申请 -->
          <div class="backdrop-blur-lg bg-white/10 rounded-2xl border border-white/20 p-6 shadow-xl animate-slide-up" style="animation-delay: 0.6s">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-xl font-semibold text-gray-200 flex items-center">
                <div class="w-3 h-3 bg-primary rounded-full mr-3 animate-pulse"></div>
                最近费用申请记录
              </h2>
              <button 
                @click="$router.push('/business/expenses')"
                class="text-primary hover:text-primary-light transition-colors text-sm font-medium"
              >
                查看全部
              </button>
            </div>
            <div class="space-y-3">
              <div v-for="(application, index) in recentApplications" :key="application.id" 
                   class="application-card p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-300 border border-white/10 hover:border-white/20"
                   :style="{ animationDelay: (index * 0.1) + 's' }">
                <div class="flex items-center justify-between mb-2">
                  <div class="flex items-center min-w-0 flex-1">
                    <div class="w-6 h-6 rounded-md flex items-center justify-center mr-2 flex-shrink-0" 
                         :class="getStatusColor(application.status).bg">
                      <i class="fas text-white text-xs" :class="getStatusColor(application.status).icon"></i>
                    </div>
                    <div class="min-w-0 flex-1">
                      <h4 class="text-gray-100 font-medium text-sm truncate">{{ application.name }}</h4>
                      <div class="flex items-center space-x-3 text-xs text-gray-400 mt-0.5">
                        <span class="flex items-center flex-shrink-0">
                          <i class="fas fa-user mr-1"></i>
                          {{ application.applicant_name }}
                        </span>
                        <span class="flex items-center flex-shrink-0">
                          <i class="fas fa-calendar mr-1"></i>
                          {{ new Date(application.application_date).toLocaleDateString('zh-CN') }}
                        </span>
                      </div>
                    </div>
                  </div>
                  <span class="status-badge px-2 py-0.5 rounded-full text-xs font-medium border flex-shrink-0 ml-2" 
                        :class="getStatusColor(application.status).badge">
                    {{ getStatusText(application.status) }}
                  </span>
                </div>
                
                <div class="flex items-center justify-between">
                  <div class="flex items-center space-x-3 text-sm">
                    <span class="flex items-center text-gray-200 text-xs">
                      {{ getMainCategoryName(application.main_category_id) }}
                    </span>
                    <span class="text-gray-500">•</span>
                    <span class="flex items-center text-gray-200 text-xs">
                      {{ getSubCategoryName(application.sub_category_id) }}
                    </span>
                  </div>
                  <div class="text-emerald-400 text-sm font-semibold">
                    {{ application.amount?.toLocaleString() }}
                  </div>
                </div>
              </div>
              
              <div v-if="recentApplications.length === 0" class="text-center py-8 text-gray-400">
                <i class="fas fa-inbox text-4xl mb-3 opacity-30"></i>
                <p class="text-base">暂无最近申请记录</p>
                <p class="text-xs mt-1">暂无数据可显示</p>
              </div>
            </div>
          </div>

          <!-- 最近设备申请记录 -->
          <div class="backdrop-blur-lg bg-white/10 rounded-2xl border border-white/20 p-6 shadow-xl animate-slide-up" style="animation-delay: 0.8s">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-xl font-semibold text-gray-200 flex items-center">
                <div class="w-3 h-3 bg-success rounded-full mr-3 animate-pulse"></div>
                最近设备申请记录
              </h2>
              <button 
                @click="$router.push('/business/equipment')"
                class="text-success hover:text-success-light transition-colors text-sm font-medium"
              >
                查看全部
              </button>
            </div>
            <div class="space-y-3">
              <div v-for="(application, index) in recentEquipmentApplications" :key="application.id" 
                   class="application-card p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-300 border border-white/10 hover:border-white/20"
                   :style="{ animationDelay: (index * 0.1) + 's' }">
                <div class="flex items-center justify-between mb-2">
                  <div class="flex items-center min-w-0 flex-1">
                    <div class="w-6 h-6 rounded-md flex items-center justify-center mr-2 flex-shrink-0" 
                         :class="getStatusColor(application.status).bg">
                      <i class="fas text-white text-xs" :class="getStatusColor(application.status).icon"></i>
                    </div>
                    <div class="min-w-0 flex-1">
                      <h4 class="text-gray-100 font-medium text-sm truncate">{{ application.name || '未知设备' }}</h4>
                      <div class="flex items-center space-x-3 text-xs text-gray-400 mt-0.5">
                        <span class="flex items-center flex-shrink-0">
                          <i class="fas fa-user mr-1"></i>
                          {{ application.applicant_name }}
                        </span>
                        <span class="flex items-center flex-shrink-0">
                          <i class="fas fa-calendar mr-1"></i>
                          {{ new Date(application.created_at).toLocaleDateString('zh-CN') }}
                        </span>
                      </div>
                    </div>
                  </div>
                  <span class="status-badge px-2 py-0.5 rounded-full text-xs font-medium border flex-shrink-0 ml-2" 
                        :class="getStatusColor(application.status).badge">
                    {{ getStatusText(application.status) }}
                  </span>
                </div>
                
                <div class="flex items-center justify-between">
                  <div class="flex items-center space-x-3 text-sm">
                    <span class="flex items-center text-gray-200 text-xs">
                      <i class="fas fa-folder mr-1"></i>
                      {{ getEquipmentMainCategoryName(application.main_category_id) }}
                    </span>
                    <span class="text-gray-500">•</span>
                    <span class="flex items-center text-gray-200 text-xs" v-if="application.sub_category_id">
                      {{ getEquipmentSubCategoryName(application.sub_category_id) }}
                    </span>
                  </div>
                  <div class="text-blue-400 text-sm font-semibold">
                    <i class="fas fa-hashtag mr-1"></i>{{ application.quantity || 0 }}
                  </div>
                </div>
              </div>
              
              <div v-if="recentEquipmentApplications.length === 0" class="text-center py-8 text-gray-400">
                <i class="fas fa-inbox text-4xl mb-3 opacity-30"></i>
                <p class="text-base">暂无最近设备申请记录</p>
                <p class="text-xs mt-1">暂无数据可显示</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 右侧边栏 -->
        <div class="xl:col-span-4 space-y-8">
          <!-- 快速操作 -->
          <div class="backdrop-blur-lg bg-white/10 rounded-2xl border border-white/20 p-6 shadow-xl animate-slide-up">
            <h2 class="text-xl font-semibold text-gray-200 mb-6 flex items-center">
              <div class="w-3 h-3 bg-warning rounded-full mr-3"></div>
              快速操作
            </h2>
            <div class="grid grid-cols-2 gap-3">
              <button 
                @click="$router.push('/business/expenses')"
                class="flex flex-col items-center p-4 bg-primary/20 hover:bg-primary/30 rounded-xl transition-all duration-300 transform hover:-translate-y-1 group card-hover-enhanced"
              >
                <i class="fas fa-money-bill-wave text-gray-400 text-xl mb-2 group-hover:scale-110 transition-transform icon-bounce"></i>
                <span class="text-sm font-medium text-white">费用申请</span>
              </button>
              <button 
                @click="$router.push('/business/equipment')"
                class="flex flex-col items-center p-4 bg-success/20 hover:bg-success/30 rounded-xl transition-all duration-300 transform hover:-translate-y-1 group card-hover-enhanced"
              >
                <i class="fas fa-laptop text-gray-400 text-xl mb-2 group-hover:scale-110 transition-transform icon-bounce"></i>
                <span class="text-sm font-medium text-white">设备申请</span>
              </button>
              <button 
                @click="$router.push('/business/customers')"
                class="flex flex-col items-center p-4 bg-warning/20 hover:bg-warning/30 rounded-xl transition-all duration-300 transform hover:-translate-y-1 group card-hover-enhanced"
              >
                <i class="fas fa-users text-gray-400 text-xl mb-2 group-hover:scale-110 transition-transform icon-bounce"></i>
                <span class="text-sm font-medium text-white">客户管理</span>
              </button>
              <button 
                @click="fetchUserStats"
                class="flex flex-col items-center p-4 bg-danger/20 hover:bg-danger/30 rounded-xl transition-all duration-300 transform hover:-translate-y-1 group card-hover-enhanced"
                :disabled="loading"
              >
                <i class="fas fa-sync text-gray-400 text-xl mb-2 group-hover:scale-110 transition-transform icon-bounce" :class="{ 'fa-spin': loading }"></i>
                <span class="text-sm font-medium text-white">刷新数据</span>
              </button>
            </div>
          </div>
           <!-- 任务统计 -->
          <div class="backdrop-blur-lg bg-white/10 rounded-2xl border border-white/20 p-6 shadow-xl animate-slide-up">
            <h2 class="text-xl font-semibold text-gray-200 mb-6 flex items-center">
              <div class="w-3 h-3 bg-info rounded-full mr-3"></div>
              任务统计
            </h2>
            
            <!-- 任务完成度进度条 -->
            <div class="mb-6 bg-white/5 rounded-xl p-4 border border-white/10">
              <div class="flex justify-between items-center mb-3">
                <h3 class="text-sm font-semibold text-gray-200 flex items-center">
                  <i class="fas fa-chart-line mr-2 text-gray-400"></i>
                  任务完成度
                </h3>
                <span class="text-lg font-bold text-emerald-400">
                  {{ taskStats.total_tasks > 0 ? Math.round((taskStats.completed_tasks / taskStats.total_tasks) * 100) : 0 }}%
                </span>
              </div>
              <div class="w-full bg-gray-700/40 rounded-full h-3 overflow-hidden">
                <div 
                  class="h-full rounded-full transition-all duration-1500 ease-out progress-fill"
                  :style="{ 
                    width: (taskStats.total_tasks > 0 ? (taskStats.completed_tasks / taskStats.total_tasks) * 100 : 0) + '%',
                    backgroundColor: '#10b981',
                    boxShadow: '0 0 12px #10b98160',
                    '--progress-width': (taskStats.total_tasks > 0 ? (taskStats.completed_tasks / taskStats.total_tasks) * 100 : 0) + '%'
                  }"
                ></div>
              </div>
              <div class="flex justify-between text-xs text-gray-400 mt-2">
                <span>已完成: {{ taskStats.completed_tasks || 0 }}</span>
                <span>总任务: {{ taskStats.total_tasks || 0 }}</span>
              </div>
            </div>
            
            <!-- 基本任务统计 -->
            <div class="grid grid-cols-2 gap-4 mb-6">
              <div class="bg-white/5 rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all duration-300">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-gray-300 text-sm font-medium opacity-80">总任务数</p>
                    <p class="text-2xl font-bold text-gray-50 tracking-tight">{{ taskStats.total_tasks || 0 }}</p>
                  </div>
                  <div class="w-10 h-10 bg-gradient-to-br from-primary/30 to-primary/10 rounded-lg flex items-center justify-center shadow-lg">
                    <i class="fas fa-tasks text-primary text-sm"></i>
                  </div>
                </div>
              </div>
              
              <div class="bg-white/5 rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all duration-300">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-gray-300 text-sm font-medium opacity-80">进行中</p>
                    <p class="text-2xl font-bold text-amber-400 tracking-tight">{{ taskStats.in_progress_tasks || 0 }}</p>
                  </div>
                  <div class="w-10 h-10 bg-gradient-to-br from-amber-500/30 to-amber-500/10 rounded-lg flex items-center justify-center shadow-lg">
                    <i class="fas fa-play text-amber-400 text-sm"></i>
                  </div>
                </div>
              </div>
              
              <div class="bg-white/5 rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all duration-300">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-gray-300 text-sm font-medium opacity-80">已完成</p>
                    <p class="text-2xl font-bold text-emerald-400 tracking-tight">{{ taskStats.completed_tasks || 0 }}</p>
                  </div>
                  <div class="w-10 h-10 bg-gradient-to-br from-emerald-500/30 to-emerald-500/10 rounded-lg flex items-center justify-center shadow-lg">
                    <i class="fas fa-check text-emerald-400 text-sm"></i>
                  </div>
                </div>
              </div>
              
              <div class="bg-white/5 rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all duration-300">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-gray-300 text-sm font-medium opacity-80">待处理</p>
                    <p class="text-2xl font-bold text-sky-400 tracking-tight">{{ taskStats.wait_tasks || 0 }}</p>
                  </div>
                  <div class="w-10 h-10 bg-gradient-to-br from-sky-500/30 to-sky-500/10 rounded-lg flex items-center justify-center shadow-lg">
                    <i class="fas fa-clock text-sky-400 text-sm"></i>
                  </div>
                </div>
              </div>
            </div>

            <!-- 任务优先级统计 -->
            <div class="bg-white/5 rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all duration-300">
              <h3 class="text-sm font-semibold text-gray-200 mb-4 flex items-center">
                <i class="fas fa-layer-group mr-2 text-gray-400"></i>
                优先级分布
              </h3>
              <div v-if="taskPriorityStats.length > 0" class="space-y-4">
                <div v-for="stat in taskPriorityStats" :key="stat.priority" class="space-y-2">
                  <div class="flex justify-between items-center">
                    <div class="flex items-center">
                      <span class="w-2 h-2 rounded-full mr-3 flex-shrink-0" :style="{ backgroundColor: getPriorityStyle(stat.priority).color }"></span>
                      <span class="text-gray-200 text-sm font-medium">{{ getPriorityName(stat.priority) }}</span>
                    </div>
                    <div class="flex items-center space-x-3">
                      <span class="text-gray-50 font-semibold text-sm">{{ stat.task_count || 0 }}</span>
                      <span class="text-gray-400 text-xs font-mono">{{ stat.percentage || 0 }}%</span>
                    </div>
                  </div>
                  <div class="w-full bg-gray-700/40 rounded-full h-2 overflow-hidden">
                    <div 
                      class="h-full rounded-full transition-all duration-1000 ease-out progress-fill"
                      :style="{ 
                        width: (stat.percentage || 0) + '%',
                        backgroundColor: getPriorityStyle(stat.priority).color,
                        boxShadow: '0 0 8px ' + getPriorityStyle(stat.priority).color + '40',
                        '--progress-width': (stat.percentage || 0) + '%'
                      }"
                    ></div>
                  </div>
                </div>
              </div>
              <div v-else class="text-center py-6 text-gray-400">
                <i class="fas fa-chart-bar text-3xl mb-3 opacity-20"></i>
                <p class="text-sm text-gray-500">暂无优先级数据</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useUserStore } from '../stores'
import { useRouter } from 'vue-router'
import { getCurrentUserStats } from '../api/statistics.js'
import { expenseApplicationsAPI } from '../api/expenseApplications.js'
import { expenseCategoryAPI } from '../api/expenseCategory.js'
import { equipmentApplicationsAPI } from '../api/equipmentApplications.js'
import { equipmentCategoryAPI } from '../api/equipmentCategory.js'
import { taskAPI } from '../api/tasks.js'
import NavigationBar from '../components/NavigationBar.vue'

const userStore = useUserStore()
const router = useRouter()

// 用户统计数据 - 与manageapi返回格式保持一致
const userStats = ref({
  total_expense_amount: 0,
  pending_expense_amount: 0,
  approved_expense_amount: 0,
  rejected_expense_amount: 0,
  total_expense_count: 0,
  pending_expense_count: 0,
  approving_expense_count: 0,
  approving_expense_amount: 0,
  total_equipment_quantity: 0,
  pending_equipment_quantity: 0,
  approved_equipment_quantity: 0,
  rejected_equipment_quantity: 0,
  total_equipment_count: 0,
  pending_equipment_count: 0,
  approving_equipment_count: 0,
  approving_equipment_quantity: 0,
  total_application_value: 0,
  pending_application_value: 0,
  // 计算属性
  total_applications: 0,
  pending_applications: 0,
  approved_applications: 0,
  rejected_applications: 0,
  approving_applications: 0
})

const loading = ref(false)
const recentApplications = ref([])
const recentEquipmentApplications = ref([])
const mainCategories = ref([])
const subCategories = ref([])
const equipmentMainCategories = ref([])
const equipmentSubCategories = ref([])

// 任务统计数据
const taskStats = ref({
  total_tasks: 0,
  in_progress_tasks: 0,
  completed_tasks: 0,
  wait_tasks: 0,
  pending_tasks: 0,
  cancelled_tasks: 0,
  overdue_tasks: 0
})

// 任务优先级统计
const taskPriorityStats = ref([])

    // 获取最近申请记录
    const fetchRecentApplications = async () => {
      try {
        const response = await expenseApplicationsAPI.getExpenseApplicationsList({
          page: 1,
          pageSize: 3,
          sortBy: 'created_at',
          sortOrder: 'desc'
        })
        if (response.success) {
          recentApplications.value = response.data || []
        } else {
          console.error('获取最近申请记录失败:', response.message)
          recentApplications.value = []
        }
      } catch (error) {
        console.error('获取最近申请记录错误:', error)
        recentApplications.value = []
      }
    }

    // 获取最近设备申请记录
    const fetchRecentEquipmentApplications = async () => {
      try {
        const response = await equipmentApplicationsAPI.getEquipmentApplicationsList({
          page: 1,
          pageSize: 3,
          sortBy: 'created_at',
          sortOrder: 'desc'
        })
        if (response.success) {
          recentEquipmentApplications.value = response.data || []
        } else {
          console.error('获取最近设备申请记录失败:', response.message)
          recentEquipmentApplications.value = []
        }
      } catch (error) {
        console.error('获取最近设备申请记录错误:', error)
        recentEquipmentApplications.value = []
      }
    }

    // 加载费用分类数据
    const loadExpenseCategories = async () => {
      try {
        const response = await expenseCategoryAPI.getExpenseCategories()
        if (response.success) {
          const categories = response.data || []
          const mainCats = []
          const subCats = []
          
          // 递归处理树形结构，提取主分类和子分类
          const processCategories = (categoryList, parentId = null) => {
            categoryList.forEach(category => {
              if (!category.parent_id) {
                // 主分类
                mainCats.push({
                  id: category.id,
                  name: category.category_name,
                  icon: category.icon || 'fas fa-folder',
                  children: category.children || []
                })
              } else {
                // 子分类
                subCats.push({
                  id: category.id,
                  name: category.category_name,
                  parentId: category.parent_id,
                  icon: category.icon || 'fas fa-folder-open'
                })
              }
              
              // 递归处理子分类
              if (category.children && category.children.length > 0) {
                processCategories(category.children, category.id)
              }
            })
          }
          
          processCategories(categories)
          mainCategories.value = mainCats
          subCategories.value = subCats
        } else {
          console.error('获取费用分类失败:', response.message)
          mainCategories.value = []
          subCategories.value = []
        }
      } catch (error) {
        console.error('获取费用分类错误:', error)
        mainCategories.value = []
        subCategories.value = []
      }
    }

    // 加载设备分类数据
    const loadEquipmentCategories = async () => {
      try {
        const response = await equipmentCategoryAPI.getEquipmentCategories()
        if (response.success) {
          const categories = response.data || []
          const mainCats = []
          const subCats = []
          
          // 递归处理树形结构，提取主分类和子分类
          const processCategories = (categoryList, parentId = null) => {
            categoryList.forEach(category => {
              if (!category.parent_id) {
                // 主分类
                mainCats.push({
                  id: category.id,
                  name: category.category_name,
                  icon: category.icon || 'fas fa-folder',
                  children: category.children || []
                })
              } else {
                // 子分类
                subCats.push({
                  id: category.id,
                  name: category.category_name,
                  parentId: category.parent_id,
                  icon: category.icon || 'fas fa-folder-open'
                })
              }
              
              // 递归处理子分类
              if (category.children && category.children.length > 0) {
                processCategories(category.children, category.id)
              }
            })
          }
          
          processCategories(categories)
          equipmentMainCategories.value = mainCats
          equipmentSubCategories.value = subCats
        } else {
          console.error('获取设备分类失败:', response.message)
          equipmentMainCategories.value = []
          equipmentSubCategories.value = []
        }
      } catch (error) {
        console.error('获取设备分类错误:', error)
        equipmentMainCategories.value = []
        equipmentSubCategories.value = []
      }
    }

    // 获取主分类名称
    const getMainCategoryName = (id) => {
      const category = mainCategories.value.find(cat => cat.id === id)
      return category ? category.name : '-'
    }

    // 获取子分类名称
    const getSubCategoryName = (id) => {
      const category = subCategories.value.find(cat => cat.id === id)
      return category ? category.name : '-'
    }

    // 获取设备主分类名称
    const getEquipmentMainCategoryName = (id) => {
      const category = equipmentMainCategories.value.find(cat => cat.id === id)
      return category ? category.name : '-'
    }

    // 获取设备子分类名称
    const getEquipmentSubCategoryName = (id) => {
      const category = equipmentSubCategories.value.find(cat => cat.id === id)
      return category ? category.name : '-'
    }

    // 获取状态颜色配置
    const getStatusColor = (status) => {
      const statusMap = {
        'pending': {
          bg: 'bg-gradient-to-r from-yellow-500 to-orange-500',
          icon: 'fa-clock',
          badge: 'bg-yellow-500/20 text-yellow-100 border border-yellow-400/50'
        },
        'approving': {
          bg: 'bg-gradient-to-r from-blue-500 to-cyan-500',
          icon: 'fa-spinner',
          badge: 'bg-blue-500/20 text-blue-100 border border-blue-400/50'
        },
        'approved': {
          bg: 'bg-gradient-to-r from-emerald-500 to-green-500',
          icon: 'fa-check-circle',
          badge: 'bg-emerald-500/20 text-emerald-100 border border-emerald-400/50'
        },
        'rejected': {
          bg: 'bg-gradient-to-r from-red-500 to-rose-500',
          icon: 'fa-times-circle',
          badge: 'bg-red-500/20 text-red-100 border border-red-400/50'
        },
        'cancelled': {
          bg: 'bg-gradient-to-r from-gray-600 to-slate-600',
          icon: 'fa-ban',
          badge: 'bg-gray-500/20 text-gray-100 border border-gray-400/50'
        }
      }
      return statusMap[status] || statusMap['pending']
    }

    // 获取状态文本
    const getStatusText = (status) => {
      const statusMap = {
        'pending': '待审批',
        'approving': '审批中',
        'approved': '已通过',
        'rejected': '已拒绝',
        'cancelled': '已取消'
      }
      return statusMap[status] || status
    }

// 退出登录
const handleLogout = () => {
  userStore.logout()
  router.push('/login')
}

// 获取当前用户统计数据
const fetchUserStats = async () => {
  loading.value = true
  try {
    const response = await getCurrentUserStats()
    if (response.success && response.data) {
      // 更新统计数据并计算汇总值
      const stats = response.data
      userStats.value = {
        ...stats,
        // 计算汇总值
        total_applications: stats.total_expense_count + stats.total_equipment_count,
        pending_applications: stats.pending_expense_count + stats.pending_equipment_count,
        approved_applications: stats.approved_expense_count + stats.approved_equipment_quantity,
        rejected_applications: stats.rejected_expense_count + stats.rejected_equipment_quantity,
        approving_applications: stats.approving_expense_count + stats.approving_equipment_count
      }
    }
    // 同时刷新最近申请记录
    fetchRecentApplications()
  } catch (error) {
    console.error('获取用户统计数据失败:', error)
  } finally {
    loading.value = false
  }
}

// 格式化货币
const formatCurrency = (amount) => {
  if (typeof amount !== 'number') return '0'
  return `${amount.toLocaleString()}`
}

// 刷新数据
const refreshData = async () => {
  await fetchUserStats()
  await fetchTaskStats()
  await fetchTaskPriorityStats()
}

// 获取任务基本统计
const fetchTaskStats = async () => {
  try {
    const response = await taskAPI.getTaskBasicStats({ 
      role_type: 'assignee',
      user_id: userStore.userInfo?.id || userStore.userInfo?.userId 
    })
    if (response.success && response.data) {
      taskStats.value = response.data
    } else {
      console.error('获取任务统计失败:', response.message)
      // 保持默认值
    }
  } catch (error) {
    console.error('获取任务统计错误:', error)
  }
}

// 获取任务优先级统计
const fetchTaskPriorityStats = async () => {
  try {
    const response = await taskAPI.getTaskPriorityStats({ 
      role_type: 'assignee',
      user_id: userStore.userInfo?.id || userStore.userInfo?.userId 
    })
    if (response.success && response.data) {
      taskPriorityStats.value = response.data
    } else {
      console.error('获取任务优先级统计失败:', response.message)
      taskPriorityStats.value = []
    }
  } catch (error) {
    console.error('获取任务优先级统计错误:', error)
    taskPriorityStats.value = []
  }
}

// 获取优先级中文名称
const getPriorityName = (priority) => {
  const names = {
    '3_urgent': '紧急',
    '2_high': '高',
    '1_medium': '中',
    '0_low': '低'
  }
  return names[priority] || priority
}

// 获取优先级样式配置
const getPriorityStyle = (priority) => {
  const styleMap = {
    'urgent': {
      color: '#ef4444', // red-500
      bg: 'bg-red-500/20',
      text: 'text-red-400',
      border: 'border-red-400/50'
    },
    'high': {
      color: '#f97316', // orange-500
      bg: 'bg-orange-500/20',
      text: 'text-orange-400',
      border: 'border-orange-400/50'
    },
    'medium': {
      color: '#eab308', // yellow-500
      bg: 'bg-yellow-500/20',
      text: 'text-yellow-400',
      border: 'border-yellow-400/50'
    },
    'low': {
      color: '#22c55e', // green-500
      bg: 'bg-green-500/20',
      text: 'text-green-400',
      border: 'border-green-400/50'
    }
  }
  return styleMap[priority] || styleMap['medium']
}

onMounted(async () => {
  loading.value = true
  try {
    // 用户信息已通过 store 的 loadUserFromStorage 方法加载
    // 并行加载所有数据
    await Promise.all([
      fetchUserStats(),
      fetchRecentApplications(),
      fetchRecentEquipmentApplications(),
      loadExpenseCategories(),
      loadEquipmentCategories(),
      fetchTaskStats(),
      fetchTaskPriorityStats()
    ])
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
/* 引入Font Awesome图标 */
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');

/* 卡片悬停效果增强 */
.card-hover-enhanced {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.card-hover-enhanced:hover {
  transform: translateY(-4px) scale(1.02);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

/* 图标动画效果 */
.icon-bounce {
  transition: transform 0.3s ease;
}

.icon-bounce:hover {
  transform: scale(1.2) rotate(5deg);
}

/* 进度条动画 */
.progress-bar {
  transition: width 0.8s ease-out;
  background: linear-gradient(90deg, var(--el-color-primary), var(--el-color-primary-light));
}

/* 图表柱状图动画 */
.chart-bar {
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  animation: barGrow 0.8s ease-out forwards;
  animation-delay: var(--bar-delay, 0s);
  transform-origin: bottom;
}

@keyframes barGrow {
  from {
    height: 0;
    opacity: 0;
  }
  to {
    height: var(--bar-height, 100%);
    opacity: 1;
  }
}

/* 进度条动画 */
.progress-fill {
  animation: progressGrow 1s ease-out forwards;
  transform-origin: left;
}

@keyframes progressGrow {
  from {
    width: 0;
    opacity: 0;
  }
  to {
    width: var(--progress-width, 100%);
    opacity: 1;
  }
}

/* 浮动动画 */
@keyframes float {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
  }
  33% {
    transform: translateY(-20px) rotate(2deg);
  }
  66% {
    transform: translateY(-10px) rotate(-2deg);
  }
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}

/* 滑入动画 */
@keyframes slide-up {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-slide-up {
  animation: slide-up 0.6s ease-out forwards;
}

/* 淡入动画 */
@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.animate-fade-in {
  animation: fade-in 0.8s ease-out forwards;
}

/* 申请记录卡片特殊效果 */
.application-card {
  position: relative;
  overflow: hidden;
  min-height: 80px;
}

.application-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
  transition: left 0.8s ease;
}

.application-card:hover::before {
  left: 100%;
}

/* 状态标签增强 */
.status-badge {
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

/* 金额显示增强 */
.amount-display {
  color: #34d399;
  font-weight: 600;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

/* 分类标签 */
.category-tag {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(5px);
}

/* 响应式优化 */
@media (max-width: 768px) {
  .application-card {
    padding: 0.75rem;
    min-height: auto;
  }
  
  .application-card .flex.items-center.space-x-3 {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.25rem;
  }
  
  .application-card .flex.items-center.space-x-4 {
    gap: 0.5rem;
  }
  
  .application-card .text-lg {
    font-size: 1rem;
  }
  
  .application-card h4 {
    font-size: 0.875rem;
  }
}
</style>