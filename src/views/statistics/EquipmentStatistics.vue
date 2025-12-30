<!-- 设备统计页面 -->
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
                <i class="fas fa-laptop-medical text-white text-xl"></i>
              </div>
              <div class="space-y-2">
                <h1 class="text-4xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
                  设备申请统计
                </h1>
                <p class="text-gray-400 text-lg">全面掌握设备申请情况，智能分析数据趋势</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 筛选区域 - 根据选中选项卡动态显示查询条件 -->
      <div class="backdrop-blur-lg bg-white/10 rounded-2xl border border-white/20 shadow-2xl p-8 mb-8 animate-fade-in" style="animation-delay: 0.1s">
        <!-- 基础查询条件（所有选项卡通用） -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <!-- 日期范围选择器 - 增强版 -->
          <div v-if="activeTab !== 'userBreakdown'" class="space-y-3">
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
              />
              <i class="fas fa-calendar absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            </div>
          </div>
          
          <div v-if="activeTab !== 'userBreakdown'" class="space-y-3">
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
              />
              <i class="fas fa-calendar-check absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            </div>
          </div>

          <!-- 用户分类明细专用条件 -->
          <div v-if="activeTab === 'userBreakdown'" class="space-y-3">
            <label class="block text-sm font-semibold text-gray-300 mb-2 flex items-center">
              <i class="fas fa-user mr-2 text-warning"></i>
              用户姓名
              <span class="ml-1 text-xs text-gray-400">(可选)</span>
            </label>
            <div class="relative">
              <input
                v-model="queryForm.userName"
                type="text"
                placeholder="请输入用户姓名（可选）"
                class="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-warning focus:border-warning/50 transition-all duration-300 hover:bg-white/15 pl-10"
                @keyup.enter="handleQuery"
              />
              <i class="fas fa-user absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            </div>
          </div>

          <!-- 用户设备总量专用条件 - 可选 -->
          <div v-if="activeTab === 'userTotal'" class="space-y-3">
            <label class="block text-sm font-semibold text-gray-300 mb-2 flex items-center">
              <i class="fas fa-search mr-2 text-info"></i>
              用户姓名
              <span class="ml-1 text-xs text-gray-400">(可选)</span>
            </label>
            <div class="relative">
              <input
                v-model="queryForm.userName"
                type="text"
                placeholder="输入用户姓名进行筛选"
                class="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-info focus:border-info/50 transition-all duration-300 hover:bg-white/15 pl-10"
                @keyup.enter="handleQuery"
              />
              <i class="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            </div>
          </div>

          <!-- 分类设备统计专用条件 -->
          <div v-if="activeTab === 'categoryStats'" class="space-y-3">
            <label class="block text-sm font-semibold text-gray-300 mb-2 flex items-center">
              <i class="fas fa-tags mr-2 text-success"></i>
              主分类
              <span class="ml-1 text-xs text-gray-400">(可选)</span>
            </label>
            <div class="relative">
              <select
                v-model="queryForm.mainCategory"
                class="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-success focus:border-success/50 transition-all duration-300 hover:bg-white/15 pl-10 appearance-none"
              >
                <option value="" class="bg-slate-800">全部分类</option>
                <option v-for="category in mainCategories" :key="category.id" :value="category.name">
                  {{ category.name }}
                </option>
              </select>
              <i class="fas fa-tags absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
              <i class="fas fa-chevron-down absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"></i>
            </div>
          </div>

          

          <!-- 设备申请概览专用条件 -->
          <div v-if="activeTab === 'overview'" class="space-y-3">
            <label class="block text-sm font-semibold text-gray-300 mb-2 flex items-center">
              <i class="fas fa-building mr-2 text-secondary"></i>
              统计说明
              <span class="ml-1 text-xs text-gray-400">(部门维度)</span>
            </label>
            <div class="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-gray-300 text-sm">
              <i class="fas fa-info-circle mr-2 text-info"></i>
              按部门统计设备申请分布情况
            </div>
          </div>
        </div>

        <div class="flex items-center">
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
          :user-name="queryForm.userName"
          :main-category="queryForm.mainCategory"
          :group-by="queryForm.groupBy"
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
import { getEquipmentCategories } from '@/api/equipmentCategory'
import { ElMessage } from 'element-plus'

// 导入统计组件
import UserEquipmentTotal from './equipment/UserEquipmentTotal.vue'
import CategoryEquipmentStats from './equipment/CategoryEquipmentStats.vue'
import UserEquipmentCategoryBreakdown from './equipment/UserEquipmentCategoryBreakdown.vue'
import EquipmentOverview from './equipment/EquipmentOverview.vue'
import EquipmentTrend from './equipment/EquipmentTrend.vue'

// 响应式数据
const queryForm = reactive({
  startDate: '',
  endDate: '',
  userName: '',
  mainCategory: '',
  groupBy: 'day' // 新增：趋势统计维度
})

const mainCategories = ref([])
const loading = ref(false)
const showValidation = ref(false) // 新增：控制验证信息显示

// 图表选项卡配置
const chartTabs = ref([
  { label: '用户设备总量', value: 'userTotal', icon: 'fas fa-user-cog' },
  { label: '分类设备统计', value: 'categoryStats', icon: 'fas fa-chart-pie' },
  { label: '用户分类明细', value: 'userBreakdown', icon: 'fas fa-users' },
  { label: '设备申请概览', value: 'overview', icon: 'fas fa-chart-line' },
  { label: '设备申请趋势', value: 'trend', icon: 'fas fa-trending-up' }
])

const activeTab = ref('userTotal')

// 查询验证计算属性
const isQueryValid = computed(() => {
  // 用户分类明细选项卡：用户姓名为可选，无需验证
  if (activeTab.value === 'userBreakdown') {
    return true
  }
  
  // 其他选项卡：日期必填
  if (!queryForm.startDate || !queryForm.endDate) {
    return false
  }
  
  return true
})

// 获取当前选项卡图标
const getCurrentTabIcon = () => {
  const tabIcons = {
    overview: 'fas fa-building',
    userTotal: 'fas fa-users',
    userBreakdown: 'fas fa-user-tag',
    categoryStats: 'fas fa-tags',
    trend: 'fas fa-chart-line'
  }
  return tabIcons[activeTab.value] || 'fas fa-chart-bar'
}

// 获取当前选项卡描述
const getCurrentTabDescription = () => {
  const descriptions = {
    overview: '设备申请概览 - 按部门统计设备申请分布',
    userTotal: '用户设备总量 - 统计用户的设备申请总量',
    userBreakdown: '用户分类明细 - 仅输入用户姓名即可查询，无需日期范围',
    categoryStats: '分类设备统计 - 按设备分类统计申请情况',
    trend: '设备申请趋势 - 分析设备申请的时间趋势'
  }
  return descriptions[activeTab.value] || '设备统计分析'
}

// 获取验证错误信息
const getValidationMessage = () => {
  // 用户分类明细选项卡：用户姓名为可选，无需验证
  if (activeTab.value === 'userBreakdown') {
    return ''
  }
  
  // 其他选项卡
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
      startDate.setDate(today.getDate() - today.getDay()+1)
      endDate.setDate(today.getDate() + (6 - today.getDay())+1)
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

// 日期格式化函数
const formatDate = (date) => {
  return date.toISOString().split('T')[0]
}

// 组件映射
const componentMap = {
  userTotal: UserEquipmentTotal,
  categoryStats: CategoryEquipmentStats,
  userBreakdown: UserEquipmentCategoryBreakdown,
  overview: EquipmentOverview,
  trend: EquipmentTrend
}

// 当前组件
const currentComponent = computed(() => {
  return componentMap[activeTab.value] || UserEquipmentTotal
})

// 获取主分类列表
const getMainCategories = async () => {
  try {
    const res = await getEquipmentCategories()
    if (res.code === 200) {
      mainCategories.value = res.data || []
    }
  } catch (error) {
    console.error('获取主分类失败:', error)
  }
}

// 查询处理
const handleQuery = () => {
  // 重置验证状态
  showValidation.value = false
  
  // 验证查询条件
  if (!isQueryValid.value) {
    showValidation.value = true
    ElMessage.warning(getValidationMessage())
    return
  }
  
  loading.value = true
  // 这里可以根据需要添加查询逻辑
  setTimeout(() => {
    loading.value = false
  }, 1000)
}

// 重置处理
const handleReset = () => {
  queryForm.startDate = ''
  queryForm.endDate = ''
  queryForm.userName = ''
  queryForm.mainCategory = ''
  queryForm.groupBy = 'day' // 重置为默认值
  showValidation.value = false // 重置验证状态
  handleQuery()
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
  
  // 根据选项卡类型重置特定字段
  if (newTab === 'overview') {
    queryForm.userName = ''
    queryForm.mainCategory = ''
  } else if (newTab === 'trend') {
    queryForm.groupBy = 'day' // 趋势统计默认按日
  } else if (newTab === 'categoryStats') {
    queryForm.mainCategory = '' // 重置主分类
  } else if (newTab === 'userBreakdown') {
   
  } else if (newTab === 'userTotal') {
    // 用户设备总量，保留用户名
  } else {
    // 其他选项卡，清除用户相关字段
    queryForm.userName = ''
  }
})

onMounted(async () => {
  await getMainCategories()
  
  // 设置默认日期（最近一个月），但用户分类明细不需要日期
  if (activeTab.value !== 'userBreakdown') {
    const endDate = new Date()
    const startDate = new Date()
    startDate.setMonth(startDate.getMonth() - 1)
    
    queryForm.endDate = endDate.toISOString().split('T')[0]
    queryForm.startDate = startDate.toISOString().split('T')[0]
  }
})
</script>

<style scoped>
/* 图标颜色定义 */
.text-primary { color: #3b82f6; }
.text-secondary { color: #8b5cf6; }
.text-success { color: #10b981; }
.text-warning { color: #f59e0b; }
.text-info { color: #06b6d4; }
.text-danger { color: #ef4444; }

/* 输入框图标定位 */
.input-icon-left {
  padding-left: 2.5rem;
}

/* 自定义选择器箭头 */
select {
  background-image: none;
}

select {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
}

/* 快速日期按钮悬停效果 */
button:hover .fa-calendar-day,
button:hover .fa-calendar-week,
button:hover .fa-calendar-alt {
  transform: scale(1.1);
  transition: transform 0.2s ease;
}

/* 禁用按钮样式 */
button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* 查询验证错误动画 */
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); }
  20%, 40%, 60%, 80% { transform: translateX(2px); }
}

.animate-shake {
  animation: shake 0.5s ease-in-out;
}

/* 原有动画效果保留 */
.animate-fade-in {
  animation: fadeIn 0.6s ease-out;
}

.animation-delay-200 {
  animation-delay: 0.2s;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.chart-container {
  width: 100%;
  height: 400px;
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}

@keyframes fade-in {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in {
  animation: fade-in 0.6s ease-out forwards;
}

.animation-delay-200 {
  animation-delay: 200ms;
}

.animation-delay-4000 {
  animation-delay: 4000ms;
}
</style>