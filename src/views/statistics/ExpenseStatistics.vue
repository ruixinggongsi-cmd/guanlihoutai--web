<!-- 费用统计页面 -->
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
              <div class="w-12 h-12 bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
                <i class="fas fa-chart-line text-white text-xl"></i>
              </div>
              <div class="space-y-2">
                <h1 class="text-4xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
                  费用统计分析
                </h1>
                <p class="text-gray-400 text-lg">全面掌握费用支出情况，智能分析数据趋势</p>
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

          <!-- 用户分类占比专用条件 - 可选 -->
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
              >
              <i class="fas fa-user absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            </div>
          </div>

          <!-- 用户费用总额专用条件 - 可选 -->
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
              >
              <i class="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            </div>
          </div>

          <!-- 分类费用统计专用条件 -->
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
                <option v-for="category in mainCategories" :key="category.id" :value="category.id" class="bg-slate-800">
                  {{ category.name }}
                </option>
              </select>
              <i class="fas fa-tags absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
              <i class="fas fa-chevron-down absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"></i>
            </div>
          </div>

          <!-- 费用趋势专用条件 -->
          <div v-if="activeTab === 'trend'" class="space-y-3">
            <label class="block text-sm font-semibold text-gray-300 mb-2 flex items-center">
              <i class="fas fa-chart-line mr-2 text-primary"></i>
              统计维度
              <span class="ml-1 text-xs text-gray-400">(可选)</span>
            </label>
            <div class="relative">
              <select 
                v-model="queryForm.groupBy" 
                class="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary/50 transition-all duration-300 hover:bg-white/15 pl-10 appearance-none"
              >
                <option value="day" class="bg-slate-800">按日统计</option>
                <option value="week" class="bg-slate-800">按周统计</option>
                <option value="month" class="bg-slate-800">按月统计</option>
              </select>
              <i class="fas fa-chart-line absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
              <i class="fas fa-chevron-down absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"></i>
            </div>
          </div>

          <!-- 部门费用概览专用条件 -->
          <div v-if="activeTab === 'overview'" class="space-y-3">
            <label class="block text-sm font-semibold text-gray-300 mb-2 flex items-center">
              <i class="fas fa-building mr-2 text-secondary"></i>
              统计说明
              <span class="ml-1 text-xs text-gray-400">(部门维度)</span>
            </label>
            <div class="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-gray-300 text-sm">
              <i class="fas fa-info-circle mr-2 text-info"></i>
              按部门统计费用分布情况
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
        <div class="flex space-x-1 bg-white/5 rounded-xl p-1 mb-6 overflow-x-auto">
          <button
            v-for="tab in chartTabs"
            :key="tab.value"
            @click="activeTab = tab.value"
            :class="[
              'flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg text-sm font-medium transition-all duration-300 whitespace-nowrap',
              activeTab === tab.value
                ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg'
                : 'text-gray-400 hover:text-white hover:bg-white/10'
            ]"
          >
            <i :class="tab.icon"></i>
            <span>{{ tab.label }}</span>
          </button>
          <!-- 备用：如果用户是admin，直接显示"所有申请记录"选项卡 -->
          <button
            v-if="isAdminUser && !chartTabs.find(t => t.value === 'allApplications')"
            @click="activeTab = 'allApplications'"
            :class="[
              'flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg text-sm font-medium transition-all duration-300 whitespace-nowrap',
              activeTab === 'allApplications'
                ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg'
                : 'text-gray-400 hover:text-white hover:bg-white/10'
            ]"
          >
            <i class="fas fa-list-alt"></i>
            <span>所有申请记录</span>
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
import { getMainCategoriesList } from '@/api/expense'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'
import { permissionUtils } from '@/utils/permission'

// 导入统计组件
import UserExpenseTotal from './expense/UserExpenseTotal.vue'
import CategoryExpenseStats from './expense/CategoryExpenseStats.vue'
import UserCategoryBreakdown from './expense/UserCategoryBreakdown.vue'
import ExpenseOverview from './expense/ExpenseOverview.vue'
import ExpenseTrend from './expense/ExpenseTrend.vue'
import AllExpenseApplications from './expense/AllExpenseApplications.vue'

const userStore = useUserStore()

// 在组件加载时立即输出调试信息
console.log('[费用统计] 组件开始加载')
console.log('[费用统计] 用户Store状态:', {
  isLoggedIn: userStore.isLoggedIn,
  hasUserInfo: !!userStore.userInfo,
  userInfo: userStore.userInfo
})

// 简单的admin用户检查（备用方案）
const isAdminUser = computed(() => {
  if (!userStore.userInfo) return false
  
  const username = userStore.userInfo?.username || ''
  const roleCode = userStore.userInfo?.roleInfo?.role_code || userStore.userInfo?.role_code
  const dataPermission = userStore.userInfo?.roleInfo?.data_permission || userStore.userInfo?.data_permission
  const roleName = userStore.userInfo?.roleInfo?.role_name || userStore.userInfo?.role_name
  
  const isAdmin = username.toLowerCase() === 'admin' || 
                 roleCode === 'superadmin' || 
                 dataPermission === 'all' || 
                 roleName === '超级管理员'
  
  console.log('[费用统计] isAdminUser 检查:', {
    username,
    roleCode,
    dataPermission,
    roleName,
    isAdmin
  })
  
  return isAdmin
})

// 检查是否有"所有申请记录"权限
const hasViewAllApplicationsPermission = computed(() => {
  // 详细调试信息
  console.log('[费用统计] ========== 开始权限检查 ==========')
  console.log('[费用统计] 完整用户信息:', JSON.stringify(userStore.userInfo, null, 2))
  
  // 优先检查：如果是超级管理员，直接允许访问（不依赖权限菜单）
  if (userStore.userInfo) {
    // 尝试多种路径获取角色信息
    const roleInfo = userStore.userInfo?.roleInfo || userStore.userInfo?.role || {}
    const roleCode = roleInfo?.role_code || userStore.userInfo?.role_code
    const dataPermission = roleInfo?.data_permission || userStore.userInfo?.data_permission
    const roleName = roleInfo?.role_name || userStore.userInfo?.role_name
    
    // 检查用户名是否为admin（备用检查）
    const username = userStore.userInfo?.username || ''
    const isAdminUser = username.toLowerCase() === 'admin'
    
    console.log('[费用统计] 角色信息提取:', {
      roleInfo,
      roleCode,
      dataPermission,
      roleName,
      username,
      isAdminUser
    })
    
    const isSuperAdmin = roleCode === 'superadmin' || 
                        dataPermission === 'all' || 
                        roleName === '超级管理员' ||
                        isAdminUser // 如果用户名为admin，也认为是超级管理员
    
    if (isSuperAdmin) {
      console.log('[费用统计] ✅ 通过超级管理员检查，允许访问所有申请记录', {
        roleCode,
        dataPermission,
        roleName,
        username,
        isAdminUser
      })
      console.log('[费用统计] ====================================')
      return true
    } else {
      console.log('[费用统计] ❌ 未通过超级管理员检查')
    }
  } else {
    console.log('[费用统计] ⚠️ 用户信息为空')
  }
  
  // 方法2: 检查是否有权限 'expense_statistics:view_all'（通过权限菜单）
  const hasPermission = permissionUtils.hasPermission('expense_statistics:view_all')
  console.log('[费用统计] 权限代码检查结果:', hasPermission)
  
  // 调试信息 - 详细输出
  if (!hasPermission) {
    console.log('[费用统计] ========== 权限菜单检查详情 ==========')
    console.log('[费用统计] 用户菜单列表:', userStore.userMenus)
    
    // 检查用户菜单中是否有该权限
    const userMenus = userStore.userMenus || []
    const extractFunctions = (menus) => {
      const functions = []
      menus.forEach(menu => {
        if (menu.type === 'function' && menu.path) {
          functions.push({ path: menu.path, name: menu.name, type: menu.type })
        }
        if (menu.children && Array.isArray(menu.children)) {
          functions.push(...extractFunctions(menu.children))
        }
      })
      return functions
    }
    const allFunctions = extractFunctions(userMenus)
    console.log('[费用统计] 所有功能权限:', allFunctions)
    console.log('[费用统计] 是否包含 expense_statistics:view_all:', allFunctions.some(f => f.path === 'expense_statistics:view_all'))
    console.log('[费用统计] ====================================')
  }
  
  console.log('[费用统计] 最终权限结果:', hasPermission)
  console.log('[费用统计] ====================================')
  
  return hasPermission
})

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
const showValidation = ref(false) // 新增：显示验证信息

// 图表选项卡配置
const chartTabs = computed(() => {
  console.log('[费用统计] chartTabs computed 被触发')
  
  const tabs = [
    { label: '用户费用总额', value: 'userTotal', icon: 'fas fa-user-dollar' },
    { label: '分类费用统计', value: 'categoryStats', icon: 'fas fa-chart-pie' },
    { label: '用户分类占比', value: 'userBreakdown', icon: 'fas fa-users' },
    { label: '部门费用概览', value: 'overview', icon: 'fas fa-chart-line' },
    { label: '费用趋势', value: 'trend', icon: 'fas fa-trending-up' }
  ]
  
  // 如果有"所有申请记录"权限，添加该选项卡
  console.log('[费用统计] 开始检查权限，准备调用 hasViewAllApplicationsPermission.value')
  const hasPermission = hasViewAllApplicationsPermission.value
  console.log('[费用统计] 权限检查结果:', hasPermission)
  
  if (hasPermission) {
    tabs.push({ label: '所有申请记录', value: 'allApplications', icon: 'fas fa-list-alt' })
    console.log('[费用统计] ✅ 已添加"所有申请记录"选项卡，当前选项卡数量:', tabs.length)
  } else {
    console.log('[费用统计] ❌ 未添加"所有申请记录"选项卡 - 用户没有权限')
  }
  
  console.log('[费用统计] 最终选项卡列表:', tabs.map(t => t.label))
  return tabs
})

const activeTab = ref('userTotal')

// 组件映射
const componentMap = {
  userTotal: UserExpenseTotal,
  categoryStats: CategoryExpenseStats,
  userBreakdown: UserCategoryBreakdown,
  overview: ExpenseOverview,
  trend: ExpenseTrend,
  allApplications: AllExpenseApplications
}

// 当前组件
const currentComponent = computed(() => {
  return componentMap[activeTab.value] || UserExpenseTotal
})

// 查询有效性验证
const isQueryValid = computed(() => {
  // 基础验证：日期必填
  if (!queryForm.startDate || !queryForm.endDate) {
    return false
  }
  
  // 用户分类占比：用户姓名为可选，无需验证
  if (activeTab.value === 'userBreakdown') {
    return true
  }
  
  return true
})

// 获取当前选项卡描述
const getCurrentTabDescription = () => {
  const descriptions = {
    userTotal: '统计用户的费用总额及明细',
    categoryStats: '按费用分类统计支出情况',
    userBreakdown: '查看指定用户的分类费用占比',
    overview: '按部门维度查看费用概览',
    trend: '分析费用趋势变化',
    allApplications: '查看所有用户的费用申请记录（仅超级管理员）'
  }
  return descriptions[activeTab.value] || '费用统计分析'
}

// 获取验证错误信息
const getValidationMessage = () => {
  if (!queryForm.startDate || !queryForm.endDate) {
    return '请选择开始日期和结束日期'
  }
  // 用户分类占比：用户姓名为可选，无需错误提示
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

// 格式化日期
 const formatDate = (dateStr) => {
   if (!dateStr) return '-'
   return new Date(dateStr).toLocaleDateString('zh-CN')
 }

 // 格式化金额
 const formatAmount = (amount) => {
   if (amount === null || amount === undefined || amount === '') return '0.00'
   
   const num = parseFloat(amount)
   if (isNaN(num)) return '0.00'
   
   return num.toLocaleString('zh-CN', {
     minimumFractionDigits: 2,
     maximumFractionDigits: 2
   })
 }

 // 获取主分类列表
 const getMainCategories = async () => {
   try {
     const res = await getMainCategoriesList()
     if (res.code === 200) {
       mainCategories.value = res.data || []
     }
   } catch (error) {
     console.error('获取主分类失败:', error)
   }
 }

// 查询处理
const handleQuery = () => {
  // 显示验证信息
  showValidation.value = true
  
  // 验证查询条件
  if (!isQueryValid.value) {
    ElMessage.warning(getValidationMessage())
    return
  }
  
  // 容器组件不直接处理数据查询，只传递参数给子组件
  // 子组件会监听参数变化并自动加载数据
  ElMessage.success('查询参数已更新，子组件将自动加载数据')
}





// 重置处理
const handleReset = () => {
  queryForm.startDate = ''
  queryForm.endDate = ''
  queryForm.userName = ''
  queryForm.mainCategory = ''
  queryForm.groupBy = 'day'
  showValidation.value = false
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
  
  // 根据选项卡重置特定字段
  if (newTab === 'userBreakdown') {
    queryForm.userName = ''
  } else if (newTab === 'categoryStats') {
    queryForm.mainCategory = ''
  } else if (newTab === 'trend') {
    queryForm.groupBy = 'day'
  }
  
  // 清除用户名（除了用户相关选项卡）
  if (newTab !== 'userTotal' && newTab !== 'userBreakdown') {
    queryForm.userName = ''
  }
})

onMounted(async () => {
  console.log('[费用统计] 组件已挂载 (onMounted)')
  console.log('[费用统计] 当前用户信息:', userStore.userInfo)
  console.log('[费用统计] 当前权限检查结果:', hasViewAllApplicationsPermission.value)
  console.log('[费用统计] 当前选项卡列表:', chartTabs.value.map(t => t.label))
  
  await getMainCategories()
  
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
.text-warning { color: #f59e0b; }
.text-info { color: #06b6d4; }
.text-danger { color: #ef4444; }

/* 输入框图标定位 */
input[type="date"], input[type="text"], select {
  padding-left: 2.5rem !important;
}

/* 自定义选择器箭头 */
select {
  background-image: none !important;
}

/* 快速日期按钮悬停效果 */
button:hover .fa-calendar-day,
button:hover .fa-calendar-week,
button:hover .fa-calendar-alt {
  transform: scale(1.1);
  transition: transform 0.2s ease;
}

/* 查询按钮禁用状态 */
button:disabled {
  cursor: not-allowed;
  opacity: 0.6;
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

/* 验证错误动画 */
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}

.animate-shake {
  animation: shake 0.5s ease-in-out;
}
</style>

