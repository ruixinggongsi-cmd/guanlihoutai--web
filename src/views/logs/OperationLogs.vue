<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
    <!-- 动态背景装饰 -->
    <div class="absolute inset-0 overflow-hidden">
      <div class="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
      <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-indigo-500/20 rounded-full blur-3xl animate-pulse delay-500"></div>
    </div>

    <!-- 顶部导航栏 -->
    <NavigationBar />

    <!-- 主内容区域 -->
    <div class="relative z-10 max-w-1400 mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- 标题和操作区 -->
      <div class="mb-8 animate-fade-in">
        <div class="backdrop-blur-lg bg-white/5 rounded-2xl border border-white/10 shadow-2xl p-8 mb-8">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div class="flex items-center space-x-4">
              <div class="w-12 h-12 bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg">
                <i class="fas fa-history text-white text-xl"></i>
              </div>
              <div class="space-y-2">
                <h1 class="text-4xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
                  操作日志
                </h1>
                <p class="text-gray-400 text-lg">查看系统操作日志记录</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 搜索和筛选区 -->
      <div class="backdrop-blur-lg bg-white/10 rounded-2xl border border-white/20 shadow-xl p-6 mb-8 animate-fade-in" style="animation-delay: 0.1s">
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
            <label class="block text-sm font-medium text-gray-400 mb-2">操作类型</label>
            <select
              v-model="operationTypeFilter"
              class="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
            >
              <option value="" class="bg-slate-800 text-white">全部</option>
              <option value="create" class="bg-slate-800 text-white">创建</option>
              <option value="update" class="bg-slate-800 text-white">更新</option>
              <option value="delete" class="bg-slate-800 text-white">删除</option>
              <option value="query" class="bg-slate-800 text-white">查询</option>
              <option value="export" class="bg-slate-800 text-white">导出</option>
              <option value="import" class="bg-slate-800 text-white">导入</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-400 mb-2">操作结果</label>
            <select
              v-model="operationResultFilter"
              class="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
            >
              <option value="" class="bg-slate-800 text-white">全部</option>
              <option value="success" class="bg-slate-800 text-white">成功</option>
              <option value="failed" class="bg-slate-800 text-white">失败</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-400 mb-2">目标类型</label>
            <select
              v-model="targetTypeFilter"
              class="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
            >
              <option value="" class="bg-slate-800 text-white">全部</option>
              <option value="user" class="bg-slate-800 text-white">用户</option>
              <option value="department" class="bg-slate-800 text-white">部门</option>
              <option value="equipment" class="bg-slate-800 text-white">设备</option>
              <option value="cost" class="bg-slate-800 text-white">费用</option>
              <option value="file" class="bg-slate-800 text-white">文件</option>
            </select>
          </div>
          <div class="flex items-end space-x-2">
            <button
              @click="fetchOperationLogs"
              class="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:from-blue-600 hover:via-blue-700 hover:to-blue-800 text-white font-semibold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-0.5 active:scale-95 flex items-center justify-center space-x-2 group"
            >
              <i class="fas fa-search group-hover:scale-110 transition-transform duration-300"></i>
              <span>搜索</span>
            </button>
            <button
              @click="resetFilters"
              class="flex-1 px-4 py-2 bg-gradient-to-r from-gray-600 via-gray-700 to-gray-800 hover:from-gray-700 hover:via-gray-800 hover:to-gray-900 text-white font-semibold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-0.5 active:scale-95 flex items-center justify-center space-x-2 group border border-gray-500/30"
            >
              <i class="fas fa-redo group-hover:rotate-180 transition-transform duration-500"></i>
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

      <!-- 操作日志列表 -->
      <div class="backdrop-blur-lg bg-white/10 rounded-2xl border border-white/20 shadow-xl overflow-hidden animate-fade-in" style="animation-delay: 0.2s">
        <div class="px-6 py-4 border-b border-white/20">
          <h3 class="text-lg font-semibold text-white">操作日志列表</h3>
        </div>
        
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-white/5">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">用户名</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">操作类型</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">操作名称</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">操作结果</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">目标类型</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">目标名称</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">执行时间</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">操作时间</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">操作</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-white/10">
              <tr v-for="log in operationLogs" :key="log.id" class="hover:bg-white/5 transition-all duration-300 cursor-pointer">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-white">{{ log.username }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="getOperationTypeClass(log.operation_type)" class="px-3 py-1 text-xs font-medium rounded-full border">
                    {{ getOperationTypeName(log.operation_type) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                  <div class="truncate max-w-xs" :title="log.operation_name">{{ log.operation_name }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="getResultClass(log.operation_result)" class="px-3 py-1 text-xs font-medium rounded-full border">
                    {{ getResultName(log.operation_result) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                  {{ getTargetTypeName(log.target_type) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                  <div class="truncate max-w-xs" :title="log.target_name">{{ log.target_name || '-' }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                  <div v-if="log.execution_time_ms">{{ log.execution_time_ms }}ms</div>
                  <div v-else>-</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                  {{ formatDateTime(log.operation_time) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    @click="viewOperationLogDetail(log)"
                    class="px-3 py-1 bg-gradient-to-r from-blue-500/20 to-blue-600/20 hover:from-blue-500/30 hover:to-blue-600/30 text-blue-300 rounded-lg transition-all duration-200 border border-blue-400/30 hover:border-blue-400/50"
                  >
                    <i class="fas fa-eye"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- 空状态 -->
        <div v-if="operationLogs.length === 0 && !loading" class="text-center py-12">
          <i class="fas fa-search text-4xl text-slate-500 mb-4"></i>
          <h3 class="text-lg font-medium text-slate-400 mb-2">暂无操作日志</h3>
          <p class="text-slate-500">没有找到符合条件的操作日志记录</p>
        </div>

        <!-- 加载状态 -->
        <div v-if="loading" class="text-center py-12">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
          <p class="mt-2 text-slate-400">加载中...</p>
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

      <!-- 操作详情模态框 -->
      <div
        v-if="showDetailModal"
        class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      >
        <div class="backdrop-blur-lg bg-white/10 rounded-2xl border border-white/20 shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
          <div class="px-6 py-4 border-b border-white/20 flex-shrink-0">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-2">
                <div class="w-8 h-8 bg-gradient-to-r from-primary to-primary-light rounded-lg flex items-center justify-center">
                  <i class="fas fa-info text-white text-sm"></i>
                </div>
                <h3 class="text-lg font-semibold text-white">操作详情</h3>
              </div>
              <button
                @click="closeDetailModal"
                class="text-gray-400 hover:text-white transition-colors duration-200 w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10"
              >
                <i class="fas fa-times"></i>
              </button>
            </div>
          </div>
          <div class="p-6 overflow-y-auto flex-1 min-h-0">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-400 mb-2">操作人</label>
                <div class="bg-white/10 rounded-xl px-4 py-2 text-white border border-white/20 break-all">{{ currentLog.username }}</div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-400 mb-2">操作模块</label>
                <div class="bg-white/10 rounded-xl px-4 py-2 text-white border border-white/20">{{ getOperationTypeName(currentLog.operation_type) }}</div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-400 mb-2">操作类型</label>
                <div class="bg-white/10 rounded-xl px-4 py-2 text-white border border-white/20">{{ getOperationTypeName(currentLog.operation_type) }}</div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-400 mb-2">操作结果</label>
                <div class="bg-white/10 rounded-xl px-4 py-2 text-white border border-white/20">
                  <span
                    class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border"
                    :class="currentLog.operation_result === 'success' ? 'bg-gradient-to-r from-green-500/20 to-green-600/20 text-green-300 border-green-400/30' : 'bg-gradient-to-r from-red-500/20 to-red-600/20 text-red-300 border-red-400/30'"
                  >
                    {{ getResultName(currentLog.operation_result) }}
                  </span>
                </div>
              </div>
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-400 mb-2">操作描述</label>
                <div class="bg-white/10 rounded-xl px-4 py-2 text-white border border-white/20 break-all">{{ currentLog.operation_name }}</div>
              </div>
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-400 mb-2">请求参数</label>
                <pre class="bg-white/10 rounded-xl px-4 py-2 text-white text-sm overflow-x-auto border border-white/20 whitespace-pre-wrap break-all max-h-40">{{ JSON.stringify(JSON.parse(currentLog.request_params || '{}'), null, 2) }}</pre>
              </div>
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-400 mb-2">响应结果</label>
                <pre class="bg-white/10 rounded-xl px-4 py-2 text-white text-sm overflow-x-auto border border-white/20 whitespace-pre-wrap break-all max-h-40">{{ JSON.stringify(JSON.parse(currentLog.old_data || '{}'), null, 2) }}</pre>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-400 mb-2">IP地址</label>
                <div class="bg-white/10 rounded-xl px-4 py-2 text-white border border-white/20">{{ currentLog.ip_address }}</div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-400 mb-2">操作时间</label>
                <div class="bg-white/10 rounded-xl px-4 py-2 text-white border border-white/20">{{ formatDateTime(currentLog.operation_time) }}</div>
              </div>
            </div>
          </div>
          <div class="px-6 py-4 border-t border-white/20 flex justify-end flex-shrink-0">
            <button
              @click="closeDetailModal"
              class="px-4 py-2 bg-gradient-to-r from-gray-600 via-gray-700 to-gray-800 hover:from-gray-700 hover:via-gray-800 hover:to-gray-900 text-white rounded-2xl transition-all duration-300 transform hover:-translate-y-0.5 active:scale-95 shadow-xl hover:shadow-2xl border border-gray-500/30"
            >
              <i class="fas fa-times mr-2"></i>关闭
            </button>
          </div>
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
const operationTypeFilter = ref('')
const operationResultFilter = ref('')
const targetTypeFilter = ref('')
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

// 操作日志数据
const operationLogs = ref([])

// 计算属性
const totalPages = computed(() => Math.ceil(totalLogs.value / pageSize.value))

// 方法
const getOperationTypeClass = (type) => {
  const classes = {
    create: 'bg-gradient-to-r from-green-500/20 via-green-600/20 to-green-700/20 text-green-400 border border-green-500/30',
    update: 'bg-gradient-to-r from-blue-500/20 via-blue-600/20 to-blue-700/20 text-blue-400 border border-blue-500/30',
    delete: 'bg-gradient-to-r from-red-500/20 via-red-600/20 to-red-700/20 text-red-400 border border-red-500/30',
    query: 'bg-gradient-to-r from-purple-500/20 via-purple-600/20 to-purple-700/20 text-purple-400 border border-purple-500/30',
    export: 'bg-gradient-to-r from-orange-500/20 via-orange-600/20 to-orange-700/20 text-orange-400 border border-orange-500/30',
    import: 'bg-gradient-to-r from-teal-500/20 via-teal-600/20 to-teal-700/20 text-teal-400 border border-teal-500/30'
  }
  return classes[type] || 'bg-gradient-to-r from-gray-500/20 via-gray-600/20 to-gray-700/20 text-gray-400 border border-gray-500/30'
}

const getOperationTypeName = (type) => {
  const names = {
    create: '创建',
    update: '更新',
    delete: '删除',
    query: '查询',
    export: '导出',
    import: '导入'
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

const getTargetTypeName = (type) => {
  const names = {
    user: '用户',
    department: '部门',
    equipment: '设备',
    cost: '费用',
    file: '文件'
  }
  return names[type] || type
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

const formatJsonData = (data) => {
  try {
    return JSON.stringify(JSON.parse(data), null, 2)
  } catch {
    return data
  }
}

const resetFilters = () => {
  searchQuery.value = ''
  operationTypeFilter.value = ''
  operationResultFilter.value = ''
  targetTypeFilter.value = ''
  startDate.value = ''
  endDate.value = ''
  currentPage.value = 1
  fetchOperationLogs()
}

const viewOperationLogDetail = (log) => {
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

// 获取操作日志列表
const fetchOperationLogs = async () => {
  loading.value = true
  try {
    const params = {
      page: currentPage.value,
      pageSize: pageSize.value,
      username: searchQuery.value,
      operationType: operationTypeFilter.value,
      operationResult: operationResultFilter.value,
      targetType: targetTypeFilter.value,
      startDate: startDate.value,
      endDate: endDate.value
    }
    
    const response = await logsAPI.getOperationLogs(params)
    if (response && response.data) {
      operationLogs.value = response.data.map(log => ({
        id: log.id,
        user_id: log.user_id,
        username: log.username,
        operation_type: log.operation_type,
        operation_name: log.operation_name,
        operation_result: log.operation_result,
        fail_reason: log.fail_reason,
        target_type: log.target_type,
        target_id: log.target_id,
        target_name: log.target_name,
        old_data: log.old_data,
        new_data: log.new_data,
        changed_fields: log.changed_fields,
        request_method: log.request_method,
        request_url: log.request_url,
        request_params: log.request_params,
        device_info: log.device_info,
        user_agent: log.user_agent,
        ip_address: log.ip_address,
        ip_location: log.ip_location,
        execution_time_ms: log.execution_time_ms,
        memory_usage_mb: log.memory_usage_mb,
        operation_time: log.operation_time,
        created_at: log.created_at
      }))
      
      // 设置分页信息
      if (response.pagination) {
        totalLogs.value = response.pagination.total
      } else if (response.total !== undefined) {
        totalLogs.value = response.total
      } else {
        totalLogs.value = operationLogs.value.length
      }
    }
  } catch (error) {
    ElMessage.error({ message: '获取操作日志失败', duration: 1000 })
  } finally {
    loading.value = false
  }
}

watch(currentPage, () => {
  fetchOperationLogs()
})



// 组件挂载时获取数据
onMounted(() => {
  fetchOperationLogs()
})
</script>

<style scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');
</style>