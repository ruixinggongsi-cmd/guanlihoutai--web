<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
    <!-- 动态背景装饰 -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full filter blur-3xl animate-float"></div>
      <div class="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-info/10 to-success/10 rounded-full filter blur-3xl animate-float" style="animation-delay: -1.5s;"></div>
      <div class="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-r from-warning/5 to-danger/5 rounded-full filter blur-2xl animate-pulse"></div>
    </div>

    <!-- 顶部导航栏 -->
    <NavigationBar />

    <!-- 主内容区 -->
    <div class="relative z-10 max-w-1400 mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- 标题和操作区 -->
      <div class="mb-8 animate-fade-in">
        <div class="backdrop-blur-lg bg-white/5 rounded-2xl border border-white/10 shadow-2xl p-8 mb-8">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div class="flex items-center space-x-4">
              <div class="w-12 h-12 bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg">
                <i class="fas fa-sign-in-alt text-white text-xl"></i>
              </div>
              <div class="space-y-2">
                <h1 class="text-4xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
                  登录日志
                </h1>
                <p class="text-gray-400 text-lg">查看系统登录日志记录</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 搜索和筛选区 -->
      <div class="backdrop-blur-lg bg-white/10 rounded-2xl border border-white/20 p-6 shadow-xl mb-6 animate-fade-in" style="animation-delay: 0.1s">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-400 mb-2">用户名</label>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="输入用户名搜索"
              class="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-400 mb-2">登录结果</label>
            <select
              v-model="loginResultFilter"
              class="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
            >
              <option value="" class="bg-slate-800 text-white">全部</option>
              <option value="success" class="bg-slate-800 text-white">成功</option>
              <option value="failed" class="bg-slate-800 text-white">失败</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-400 mb-2">登录类型</label>
            <select
              v-model="loginTypeFilter"
              class="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
            >
              <option value="" class="bg-slate-800 text-white">全部</option>
              <option value="web" class="bg-slate-800 text-white">Web</option>
              <option value="mobile" class="bg-slate-800 text-white">移动端</option>
              <option value="api" class="bg-slate-800 text-white">API</option>
            </select>
          </div>
          <div class="flex items-end space-x-2">
            <button
              @click="fetchLoginLogs"
              class="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:from-blue-600 hover:via-blue-700 hover:to-blue-800 text-white font-semibold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-0.5 active:scale-95 flex items-center justify-center space-x-2 group"
            >
              <i class="fas fa-search group-hover:scale-110 transition-transform duration-300"></i>
              <span>搜索</span>
            </button>
            <button
              @click="resetFilters"
              class="flex-1 px-4 py-2 bg-gradient-to-r from-gray-600 via-gray-700 to-gray-800 hover:from-gray-700 hover:via-gray-800 hover:to-gray-900 text-white font-semibold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-0.5 active:scale-95 flex items-center justify-center space-x-2 group border border-gray-500/30"
            >
              <i class="fas fa-undo group-hover:rotate-180 transition-transform duration-500"></i>
              <span>重置</span>
            </button>
          </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <label class="block text-sm font-medium text-gray-400 mb-2">开始日期</label>
            <input
              v-model="startDate"
              type="date"
              class="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-400 mb-2">结束日期</label>
            <input
              v-model="endDate"
              type="date"
              class="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
            />
          </div>
        </div>
      </div>

      <!-- 登录日志列表 -->
      <div class="backdrop-blur-lg bg-white/10 rounded-2xl border border-white/20 shadow-xl animate-fade-in" style="animation-delay: 0.2s">
        <div v-if="loading" class="p-8 text-center text-gray-400">
          <i class="fas fa-spinner fa-spin text-2xl mb-4"></i>
          <div>正在加载登录日志...</div>
        </div>
        <div v-else-if="loginLogs.length === 0" class="p-8 text-center text-gray-400">
          <i class="fas fa-search text-4xl mb-4 opacity-50"></i>
          <div>暂无登录日志数据</div>
        </div>
        <div v-else class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-white/5">
              <tr>
                <th class="px-6 py-4 text-left text-sm font-medium text-gray-400">用户名</th>
                <th class="px-6 py-4 text-left text-sm font-medium text-gray-400">登录类型</th>
                <th class="px-6 py-4 text-left text-sm font-medium text-gray-400">登录结果</th>
                <th class="px-6 py-4 text-left text-sm font-medium text-gray-400">IP地址</th>
                <th class="px-6 py-4 text-left text-sm font-medium text-gray-400">设备信息</th>
                <th class="px-6 py-4 text-left text-sm font-medium text-gray-400">登录时间</th>
                <th class="px-6 py-4 text-left text-sm font-medium text-gray-400">操作</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-white/10">
              <tr v-for="log in loginLogs" :key="log.id" class="hover:bg-white/5 transition-all duration-300">
                <td class="px-6 py-4">
                  <div class="flex items-center">
                    <div class="w-10 h-10 bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 rounded-full flex items-center justify-center mr-3">
                      <i class="fas fa-user text-white text-sm"></i>
                    </div>
                    <div class="text-left">
                      <div class="text-white font-medium">{{ log.username }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <div class="bg-gradient-to-r from-cyan-500/20 via-cyan-600/20 to-cyan-700/20 text-cyan-400 border border-cyan-500/30 shadow-lg shadow-cyan-500/20 px-3 py-1 text-xs font-bold rounded-2xl flex items-center justify-center space-x-1 backdrop-blur-sm">
                    <i class="fas fa-sign-in-alt text-xs"></i>
                    <span>{{ getLoginTypeName(log.login_type) }}</span>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <div :class="log.login_result === 'success' ? 'bg-gradient-to-r from-green-500/20 via-green-600/20 to-green-700/20 text-green-400 border border-green-500/30 shadow-lg shadow-green-500/20' : 'bg-gradient-to-r from-red-500/20 via-red-600/20 to-red-700/20 text-red-400 border border-red-500/30 shadow-lg shadow-red-500/20'" class="px-3 py-1 text-xs font-bold rounded-2xl flex items-center justify-center space-x-1 backdrop-blur-sm">
                    <i :class="log.login_result === 'success' ? 'fas fa-check-circle' : 'fas fa-times-circle'" class="text-xs"></i>
                    <span>{{ getResultName(log.login_result) }}</span>
                  </div>
                </td>
                <td class="px-6 py-4 text-sm text-gray-300">
                  {{ log.ip_address }}
                  <div v-if="log.ip_location" class="text-xs text-gray-400">{{ log.ip_location }}</div>
                </td>
                <td class="px-6 py-4 text-sm text-gray-300">
                  <div class="truncate max-w-xs" :title="log.device_info">{{ log.device_info }}</div>
                </td>
                <td class="px-6 py-4 text-sm text-gray-300">
                  <div class="bg-gradient-to-r from-amber-500/20 via-amber-600/20 to-amber-700/20 text-amber-400 border border-amber-500/30 shadow-lg shadow-amber-500/20 px-3 py-1 text-xs font-bold rounded-2xl flex items-center justify-center space-x-1 backdrop-blur-sm">
                    <i class="fas fa-calendar-alt text-xs"></i>
                    <span>{{ formatDateTime(log.login_time) }}</span>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <div class="flex items-center space-x-2">
                    <button 
                      @click="viewLoginLogDetail(log)"
                      class="bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 hover:shadow-lg group"
                      title="查看详情"
                    >
                      <i class="fas fa-eye group-hover:scale-110 transition-transform duration-300"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- 空状态 -->
        <div v-if="loginLogs.length === 0 && !loading" class="p-8 text-center text-gray-400">
          <i class="fas fa-search text-4xl mb-4 opacity-50"></i>
          <div>暂无登录日志数据</div>
        </div>

        <!-- 加载状态 -->
        <div v-if="loading" class="p-8 text-center text-gray-400">
          <i class="fas fa-spinner fa-spin text-2xl mb-4"></i>
          <div>正在加载登录日志...</div>
        </div>
        
        <!-- 分页 -->
        <div class="bg-white/5 px-6 py-4 border-t border-white/20 flex items-center justify-between">
          <div class="text-sm text-gray-400">
            显示 {{ (currentPage - 1) * pageSize + 1 }} 到 {{ Math.min(currentPage * pageSize, totalLogs) }} 条，共 {{ totalLogs }} 条记录
          </div>
          <div class="flex space-x-2">
            <button 
              @click="previousPage"
              :disabled="currentPage <= 1"
              class="px-3 py-1 text-sm bg-white/10 border border-white/20 text-gray-400 rounded-lg hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
            >
              <i class="fas fa-chevron-left mr-1"></i>
              上一页
            </button>
            <span class="px-3 py-1 text-sm text-gray-400">
              第 {{ currentPage }} 页
            </span>
            <button 
              @click="nextPage"
              :disabled="currentPage >= totalPages"
              class="px-3 py-1 text-sm bg-white/10 border border-white/20 text-gray-400 rounded-lg hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
            >
              下一页
              <i class="fas fa-chevron-right ml-1"></i>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 登录日志详情模态框 -->
    <div v-if="showDetailModal" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div class="backdrop-blur-lg bg-white/10 rounded-2xl border border-white/20 shadow-2xl p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-xl font-bold text-white flex items-center">
            <div class="w-8 h-8 bg-gradient-to-br from-cyan-500 via-cyan-600 to-cyan-700 rounded-full flex items-center justify-center mr-3">
              <i class="fas fa-info text-white text-sm"></i>
            </div>
            登录日志详情
          </h3>
          <button
            @click="closeDetailModal"
            class="bg-gradient-to-r from-red-500/20 via-red-600/20 to-red-700/20 hover:from-red-600/20 hover:via-red-700/20 hover:to-red-800/20 text-red-400 hover:text-red-300 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 border border-red-500/30 hover:border-red-400/50 backdrop-blur-sm"
          >
            <i class="fas fa-times text-sm"></i>
          </button>
        </div>
        
        <div v-if="currentLog" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-400 mb-2">用户名</label>
              <div class="bg-gradient-to-r from-blue-500/10 via-blue-600/10 to-blue-700/10 text-blue-300 border border-blue-500/20 rounded-2xl px-4 py-3 backdrop-blur-sm break-all">{{ currentLog.username }}</div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-400 mb-2">登录类型</label>
              <div class="bg-gradient-to-r from-cyan-500/10 via-cyan-600/10 to-cyan-700/10 text-cyan-300 border border-cyan-500/20 rounded-2xl px-4 py-3 backdrop-blur-sm">{{ getLoginTypeName(currentLog.login_type) }}</div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-400 mb-2">登录结果</label>
              <div class="bg-gradient-to-r from-gray-500/10 via-gray-600/10 to-gray-700/10 border border-gray-500/20 rounded-2xl px-4 py-3 backdrop-blur-sm">
                <span :class="currentLog.login_result === 'success' ? 'text-green-400' : 'text-red-400'">{{ getResultName(currentLog.login_result) }}</span>
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-400 mb-2">IP地址</label>
              <div class="bg-gradient-to-r from-purple-500/10 via-purple-600/10 to-purple-700/10 text-purple-300 border border-purple-500/20 rounded-2xl px-4 py-3 backdrop-blur-sm">{{ currentLog.ip_address }}</div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-400 mb-2">IP归属地</label>
              <div class="bg-gradient-to-r from-indigo-500/10 via-indigo-600/10 to-indigo-700/10 text-indigo-300 border border-indigo-500/20 rounded-2xl px-4 py-3 backdrop-blur-sm">{{ currentLog.ip_location || '-' }}</div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-400 mb-2">登录时间</label>
              <div class="bg-gradient-to-r from-amber-500/10 via-amber-600/10 to-amber-700/10 text-amber-300 border border-amber-500/20 rounded-2xl px-4 py-3 backdrop-blur-sm">{{ formatDateTime(currentLog.login_time) }}</div>
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-400 mb-2">设备信息</label>
            <div class="bg-gradient-to-r from-teal-500/10 via-teal-600/10 to-teal-700/10 text-teal-300 border border-teal-500/20 rounded-2xl px-4 py-3 backdrop-blur-sm break-all">{{ currentLog.device_info }}</div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-400 mb-2">User Agent</label>
            <div class="bg-gradient-to-r from-gray-500/10 via-gray-600/10 to-gray-700/10 text-gray-300 border border-gray-500/20 rounded-2xl px-4 py-3 backdrop-blur-sm text-sm break-all">{{ currentLog.user_agent }}</div>
          </div>
          <div v-if="currentLog.fail_reason">
            <label class="block text-sm font-medium text-gray-400 mb-2">失败原因</label>
            <div class="bg-gradient-to-r from-red-500/20 via-red-600/20 to-red-700/20 text-red-400 border border-red-500/30 shadow-lg shadow-red-500/20 rounded-2xl px-4 py-3 backdrop-blur-sm break-all">{{ currentLog.fail_reason }}</div>
          </div>
        </div>
        
        <div class="flex justify-end mt-6">
          <button
            @click="closeDetailModal"
            class="bg-gradient-to-r from-gray-600/50 via-gray-700/50 to-gray-800/50 hover:from-gray-500/50 hover:via-gray-600/50 hover:to-gray-700/50 text-gray-300 border border-gray-500/30 hover:border-gray-400/50 px-6 py-3 rounded-2xl font-medium transition-all duration-300 transform hover:-translate-y-0.5 active:scale-95 shadow-lg hover:shadow-xl"
          >
            <i class="fas fa-times mr-2"></i>关闭
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { logsAPI } from '../../api/logs.js'
import NavigationBar from '../../components/NavigationBar.vue'

const router = useRouter()

// 搜索和筛选
const searchQuery = ref('')
const loginResultFilter = ref('')
const loginTypeFilter = ref('')
const startDate = ref('')
const endDate = ref('')

// 分页
const currentPage = ref(1)
const pageSize = ref(10)
const totalLogs = ref(0)

// 加载状态
const loading = ref(false)

// 模态框状态
const showDetailModal = ref(false)

// 当前日志
const currentLog = ref(null)

// 登录日志数据
const loginLogs = ref([])

// 计算属性
const totalPages = computed(() => Math.ceil(totalLogs.value / pageSize.value))

// 方法
const getLoginTypeClass = (type) => {
  const classes = {
    web: 'bg-gradient-to-r from-blue-500/20 via-blue-600/20 to-blue-700/20 text-blue-400 border border-blue-500/30',
    mobile: 'bg-gradient-to-r from-green-500/20 via-green-600/20 to-green-700/20 text-green-400 border border-green-500/30',
    api: 'bg-gradient-to-r from-purple-500/20 via-purple-600/20 to-purple-700/20 text-purple-400 border border-purple-500/30'
  }
  return classes[type] || 'bg-gradient-to-r from-gray-500/20 via-gray-600/20 to-gray-700/20 text-gray-400 border border-gray-500/30'
}

const getLoginTypeName = (type) => {
  const names = {
    web: 'Web',
    mobile: '移动端',
    api: 'API'
  }
  return names[type] || type
}

const getResultClass = (result) => {
  const classes = {
    success: 'bg-gradient-to-r from-green-500/20 via-green-600/20 to-green-700/20 text-green-400 border border-green-500/30',
    failed: 'bg-gradient-to-r from-red-500/20 via-red-600/20 to-red-700/20 text-red-400 border border-red-500/30'
  }
  return classes[result] || 'bg-gradient-to-r from-gray-500/20 via-gray-600/20 to-gray-700/20 text-gray-400 border border-gray-500/30'
}

const getResultName = (result) => {
  const names = {
    success: '成功',
    failed: '失败'
  }
  return names[result] || result
}

const formatDateTime = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

const resetFilters = () => {
  searchQuery.value = ''
  loginResultFilter.value = ''
  loginTypeFilter.value = ''
  startDate.value = ''
  endDate.value = ''
  currentPage.value = 1
  fetchLoginLogs()
}

const viewLoginLogDetail = (log) => {
  currentLog.value = log
  showDetailModal.value = true
}

const closeDetailModal = () => {
  showDetailModal.value = false
  currentLog.value = null
}

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

// 获取登录日志列表
const fetchLoginLogs = async () => {
  loading.value = true
  try {
    const params = {
      page: currentPage.value,
      pageSize: pageSize.value,
      username: searchQuery.value,
      loginResult: loginResultFilter.value,
      loginType: loginTypeFilter.value,
      startDate: startDate.value,
      endDate: endDate.value
    }
    
    const response = await logsAPI.getLoginLogs(params)
    if (response && response.data) {
      loginLogs.value = response.data.map(log => ({
        id: log.id,
        user_id: log.user_id,
        username: log.username,
        login_type: log.login_type,
        login_result: log.login_result,
        fail_reason: log.fail_reason,
        device_info: log.device_info,
        user_agent: log.user_agent,
        ip_address: log.ip_address,
        ip_location: log.ip_location,
        login_time: log.login_time,
        created_at: log.created_at
      }))
      
      // 设置分页信息
      if (response.pagination) {
        totalLogs.value = response.pagination.total
      } else if (response.total !== undefined) {
        totalLogs.value = response.total
      } else {
        totalLogs.value = loginLogs.value.length
      }
    }
  } catch (error) {
    ElMessage.error({ message: '获取登录日志失败', duration: 1000 })
  } finally {
    loading.value = false
  }
}

watch(currentPage, () => {
  fetchLoginLogs()
})



// 组件挂载时获取数据
onMounted(() => {
  fetchLoginLogs()
})
</script>

<style scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');
</style>