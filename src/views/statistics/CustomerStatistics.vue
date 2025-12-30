<!-- 客户统计页面 -->
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
              <div class="w-12 h-12 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
                <i class="fas fa-users text-white text-xl"></i>
              </div>
              <div class="space-y-2">
                <h1 class="text-4xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
                  客户统计分析
                </h1>
                <p class="text-gray-400 text-lg">全面掌握客户发展情况，智能分析增长趋势</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 筛选区域 - 根据选中选项卡动态显示查询条件 -->
      <div class="backdrop-blur-lg bg-white/10 rounded-2xl border border-white/20 shadow-2xl p-8 mb-8 animate-fade-in" style="animation-delay: 0.1s">
        <!-- 基础查询条件（所有选项卡通用） -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-6">
          <!-- 日期范围选择器 - 增强版 -->
          <div class="space-y-3">
            <label class="block text-sm font-semibold text-gray-300 mb-2 flex items-center">
              <i class="fas fa-calendar-alt mr-2 text-primary"></i>
              开始日期
              <span class="ml-1 text-xs text-gray-400">(必填)</span>
            </label>
            <div class="relative">
              <input 
                v-model="queryForm.startDate"
                type="date"
                class="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary/50 transition-all duration-300 hover:bg-white/15 pl-10"
              >
              <i class="fas fa-calendar absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            </div>
          </div>
          
          <div class="space-y-3">
            <label class="block text-sm font-semibold text-gray-300 mb-2 flex items-center">
              <i class="fas fa-calendar-check mr-2 text-secondary"></i>
              结束日期
              <span class="ml-1 text-xs text-gray-400">(必填)</span>
            </label>
            <div class="relative">
              <input 
                v-model="queryForm.endDate"
                type="date"
                class="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary/50 transition-all duration-300 hover:bg-white/15 pl-10"
              >
              <i class="fas fa-calendar-check absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            </div>
          </div>

          <!-- 客户增长趋势专用条件 - 可选 -->
          <div v-if="activeTab === 'growthTrend'" class="space-y-3">
            <label class="block text-sm font-semibold text-gray-300 mb-2 flex items-center">
              <i class="fas fa-search mr-2 text-warning"></i>
              创建人姓名
              <span class="ml-1 text-xs text-gray-400">(可选)</span>
            </label>
            <div class="relative">
              <input 
                v-model="queryForm.creatorName"
                type="text"
                placeholder="请输入创建人姓名（可选）"
                class="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-warning focus:border-warning/50 transition-all duration-300 hover:bg-white/15 pl-10"
                @keyup.enter="handleQuery"
              >
              <i class="fas fa-user absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            </div>
          </div>

          <!-- 用户客户增长趋势专用条件 - 可选 -->
          <div v-if="activeTab === 'userTrend'" class="space-y-3">
            <label class="block text-sm font-semibold text-gray-300 mb-2 flex items-center">
              <i class="fas fa-user-tie mr-2 text-info"></i>
              创建人姓名
              <span class="ml-1 text-xs text-gray-400">(可选)</span>
            </label>
            <div class="relative">
              <input 
                v-model="queryForm.creatorName"
                type="text"
                placeholder="输入创建人姓名进行筛选"
                class="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-info focus:border-info/50 transition-all duration-300 hover:bg-white/15 pl-10"
                @keyup.enter="handleQuery"
              >
              <i class="fas fa-user-tie absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            </div>
          </div>

          <!-- 部门客户增长趋势专用条件 -->
          <div v-if="activeTab === 'departmentTrend'" class="space-y-3">
            <label class="block text-sm font-semibold text-gray-300 mb-2 flex items-center">
              <i class="fas fa-building mr-2 text-success"></i>
              部门名称
              <span class="ml-1 text-xs text-gray-400">(可选)</span>
            </label>
            <div class="relative">
              <input 
                v-model="queryForm.departmentName"
                type="text"
                placeholder="请输入部门名称"
                class="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-success focus:border-success/50 transition-all duration-300 hover:bg-white/15 pl-10"
                @keyup.enter="handleQuery"
              >
              <i class="fas fa-building absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            </div>
          </div>

          <!-- 客户维护趋势专用条件 -->
          <div v-if="activeTab === 'maintenanceTrend'" class="space-y-3">
            <label class="block text-sm font-semibold text-gray-300 mb-2 flex items-center">
              <i class="fas fa-user-tie mr-2 text-primary"></i>
              员工姓名筛选
              <span class="ml-1 text-xs text-gray-400">(可选)</span>
            </label>
            <div class="relative">
              <input 
                v-model="queryForm.creatorName"
                type="text"
                placeholder="请输入员工姓名"
                class="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-success focus:border-success/50 transition-all duration-300 hover:bg-white/15 pl-10"
                @keyup.enter="handleQuery"
              >
              <i class="fas fa-user-tie absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            </div>
          </div>

          <!-- 时间维度选择器 - 新增 -->
          <div class="space-y-3">
            <label class="block text-sm font-semibold text-gray-300 mb-2 flex items-center">
              <i class="fas fa-clock mr-2 text-primary"></i>
              时间维度
              <span class="ml-1 text-xs text-gray-400">(统计粒度)</span>
            </label>
            <div class="relative">
              <select 
                v-model="queryForm.timeDimension"
                class="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary/50 transition-all duration-300 hover:bg-white/15 pl-10 appearance-none"
              >
                <option value="day" class="bg-gray-800">按日统计</option>
                <option value="month" class="bg-gray-800">按月统计</option>
                <option value="year" class="bg-gray-800">按年统计</option>
              </select>
              <i class="fas fa-clock absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"></i>
              <i class="fas fa-chevron-down absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none text-xs"></i>
            </div>
          </div>
        </div>
        
        <div class="flex items-center justify-between">
          <!-- 左侧提示信息 -->
          <div class="flex items-center space-x-4">
            <div class="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-gray-300 text-sm">
              <i class="fas fa-info-circle mr-2 text-info"></i>
              <span class="font-medium">{{ getCurrentTabDescription() }}</span>
            </div>
            <div class="flex space-x-2">
              <button 
                @click="setQuickDate('today')"
                class="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-gray-300 text-xs hover:bg-white/10 transition-all duration-300"
                title="今日"
              >
                <i class="fas fa-calendar-day mr-1"></i>今日
              </button>
              <button 
                @click="setQuickDate('week')"
                class="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-gray-300 text-xs hover:bg-white/10 transition-all duration-300"
                title="本周"
              >
                <i class="fas fa-calendar-week mr-1"></i>本周
              </button>
              <button 
                @click="setQuickDate('month')"
                class="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-gray-300 text-xs hover:bg-white/10 transition-all duration-300"
                title="本月"
              >
                <i class="fas fa-calendar-alt mr-1"></i>本月
              </button>
              <button 
                @click="setQuickDate('lastMonth')"
                class="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-gray-300 text-xs hover:bg-white/10 transition-all duration-300"
                title="上月"
              >
                <i class="fas fa-calendar-minus mr-1"></i>上月
              </button>
              <button 
                @click="setQuickDate('year')"
                class="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-gray-300 text-xs hover:bg-white/10 transition-all duration-300"
                title="今年"
              >
                <i class="fas fa-calendar-check mr-1"></i>今年
              </button>
              <button 
                @click="setQuickDate('lastYear')"
                class="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-gray-300 text-xs hover:bg-white/10 transition-all duration-300"
                title="去年"
              >
                <i class="fas fa-history mr-1"></i>去年
              </button>
            </div>
          </div>

          <!-- 操作区域已移除，采用自动加载模式 -->
        </div>

      </div>

      <!-- 统计组件区域 -->
      <div class="backdrop-blur-lg bg-white/10 rounded-2xl border border-white/20 shadow-xl p-8 mb-8 animate-fade-in" style="animation-delay: 0.2s">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-bold text-white flex items-center">
            <i class="fas fa-chart-bar mr-3 text-primary"></i>
            数据统计
          </h2>
        </div>
        
        <!-- 选项卡导航 -->
        <div class="flex space-x-1 bg-white/5 rounded-xl p-1 mb-6">
          <button
            v-for="tab in chartTabs"
            :key="tab.value"
            @click="activeTab = tab.value"
            :class="[
              'flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg text-sm font-medium transition-all duration-300',
              activeTab === tab.value
                ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg'
                : 'text-gray-400 hover:text-white hover:bg-white/10'
            ]"
          >
            <i :class="tab.icon"></i>
            <span>{{ tab.label }}</span>
          </button>
        </div>

        <!-- 动态组件渲染 -->
        <component
          :is="currentComponent"
          :start-date="queryForm.startDate"
          :end-date="queryForm.endDate"
          :creator-name="queryForm.creatorName"
          :department-name="queryForm.departmentName"
          :time-dimension="queryForm.timeDimension"
          :staff-name="activeTab === 'maintenanceTrend' ? queryForm.creatorName : undefined"
          :customer-source="activeTab === 'growthTrend' ? queryForm.creatorName : undefined"
          @loading="handleLoading"
          @error="handleError"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch, computed, nextTick } from 'vue'
import NavigationBar from '@/components/NavigationBar.vue'
import { ElMessage } from 'element-plus'

// 导入客户统计组件
import CustomerGrowthBySource from './customer/CustomerGrowthBySource.vue'
import UserCustomerGrowthTrend from './customer/UserCustomerGrowthTrend.vue'
import DepartmentCustomerGrowthTrend from './customer/DepartmentCustomerGrowthTrend.vue'
import CustomerMaintenanceTrend from './customer/CustomerMaintenanceTrend.vue'

// 响应式数据
const queryForm = reactive({
  startDate: '',
  endDate: '',
  creatorName: '',
  departmentName: '',
  timeDimension: 'month' // 默认按月统计
})

const loading = ref(false)
const showValidation = ref(false)

// 图表选项卡配置 - 根据后端接口设计
const chartTabs = ref([
  { label: '客户增长趋势', value: 'growthTrend', icon: 'fas fa-chart-line' },
  { label: '用户发展趋势', value: 'userTrend', icon: 'fas fa-user-tie' },
  { label: '部门发展趋势', value: 'departmentTrend', icon: 'fas fa-building' },
  { label: '客户维护趋势', value: 'maintenanceTrend', icon: 'fas fa-heartbeat' }
])

const activeTab = ref('growthTrend')

// 组件映射
const componentMap = {
  growthTrend: CustomerGrowthBySource,
  userTrend: UserCustomerGrowthTrend,
  departmentTrend: DepartmentCustomerGrowthTrend,
  maintenanceTrend: CustomerMaintenanceTrend
}

// 当前组件
const currentComponent = computed(() => {
  return componentMap[activeTab.value] || CustomerGrowthBySource
})

// 查询有效性验证 - 自动加载模式下不需要手动验证
const isQueryValid = computed(() => {
  // 基础验证：日期必填
  if (!queryForm.startDate || !queryForm.endDate) {
    return false
  }
  
  return true
})

// 获取当前选项卡描述
const getCurrentTabDescription = () => {
  const descriptions = {
    growthTrend: '按客户来源分析增长趋势',
    userTrend: '按创建者统计客户发展情况',
    departmentTrend: '按部门统计客户发展情况',
    maintenanceTrend: '客户维护情况分析'
  }
  return descriptions[activeTab.value] || '客户统计分析'
}

// 获取验证错误信息 - 自动加载模式下简化错误处理
const getValidationMessage = () => {
  if (!queryForm.startDate || !queryForm.endDate) {
    return '请选择开始日期和结束日期'
  }
  return ''
}

// 快速日期设置
const setQuickDate = (type) => {
  const today = new Date()
  const startDate = new Date()
  const endDate = new Date()
  
  switch (type) {
    case 'today':
      startDate.setDate(today.getDate())
      endDate.setDate(today.getDate())
      break
    case 'week':
      startDate.setDate(today.getDate() - today.getDay() + 1)
      endDate.setDate(today.getDate() + (6 - today.getDay()) + 1)
      break
    case 'month':
      startDate.setDate(1)
      endDate.setMonth(today.getMonth() + 1, 0)
      break
    case 'lastMonth':
      startDate.setMonth(today.getMonth() - 1, 1)
      endDate.setMonth(today.getMonth(), 0)
      break
    case 'year':
      startDate.setMonth(0, 1)
      endDate.setMonth(11, 31)
      break
    case 'lastYear':
      startDate.setFullYear(today.getFullYear() - 1, 0, 1)
      endDate.setFullYear(today.getFullYear() - 1, 11, 31)
      break
  }
  
  queryForm.startDate = startDate.toISOString().split('T')[0]
  queryForm.endDate = endDate.toISOString().split('T')[0]
}

// 格式化日期
const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('zh-CN')
}

// 自动加载数据 - 监听参数变化自动触发
const autoLoadData = () => {
  // 验证基本参数
  if (!isQueryValid.value) {
    return
  }
  
  // 参数变化时，子组件会自动重新加载数据
  console.log('参数已更新，子组件将自动加载数据')
}

// 重置处理 - 简化版本
const handleReset = () => {
  queryForm.startDate = ''
  queryForm.endDate = ''
  queryForm.creatorName = ''
  queryForm.departmentName = ''
  queryForm.timeDimension = 'month' // 重置为默认时间维度
  showValidation.value = false
}

// 处理加载状态
const handleLoading = (isLoading) => {
  loading.value = isLoading
}

// 处理错误
const handleError = (error) => {
  console.error('组件错误:', error)
  ElMessage.error('数据加载失败，请稍后重试')
}

// 监听选项卡变化
watch(activeTab, (newTab) => {
  // 重置验证状态
  showValidation.value = false
  
  // 根据选项卡重置特定字段
  if (newTab === 'growthTrend') {
    queryForm.creatorName = ''
    queryForm.departmentName = ''
  } else if (newTab === 'userTrend') {
    queryForm.creatorName = ''
    queryForm.departmentName = ''
  } else if (newTab === 'departmentTrend') {
    queryForm.creatorName = ''
    queryForm.departmentName = ''
  } else if (newTab === 'maintenanceTrend') {
    queryForm.creatorName = ''
    queryForm.departmentName = ''
  }
})

// 监听查询参数变化，自动加载数据
watch([() => queryForm.startDate, () => queryForm.endDate, () => queryForm.creatorName, () => queryForm.departmentName, () => queryForm.timeDimension], () => {
  // 防抖处理，避免频繁触发
  setTimeout(() => {
    autoLoadData()
  }, 300)
})

onMounted(async () => {
  // 设置默认日期（最近一个月）
  const endDate = new Date()
  const startDate = new Date()
  startDate.setMonth(startDate.getMonth() - 1)
  
  queryForm.endDate = endDate.toISOString().split('T')[0]
  queryForm.startDate = startDate.toISOString().split('T')[0]
})
</script>

<style scoped>
.chart-container {
  width: 100%;
  height: 400px;
}

/* 图标颜色定义 */
.text-primary { color: #3b82f6; }
.text-secondary { color: #8b5cf6; }
.text-success { color: #10b981; }
.text-info { color: #06b6d4; }
.text-warning { color: #f59e0b; }
.text-danger { color: #ef4444; }
</style>