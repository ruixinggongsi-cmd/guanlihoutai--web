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
                <i class="fas fa-comments text-white text-xl"></i>
              </div>
              <div class="space-y-2">
                <h1 class="text-4xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
                  联系记录管理
                </h1>
                <p class="text-gray-400 text-lg">管理和跟踪客户联系记录，维护客户关系历史</p>
              </div>
            </div>
            <div class="flex space-x-4">
              <button 
                @click="refreshData"
                class="px-6 py-3 bg-white/10 text-white border border-white/20 rounded-xl hover:bg-white/20 transition-all duration-300"
              >
                <i class="fas fa-sync-alt mr-2"></i>
                刷新
              </button>
            </div>
          </div>
        </div>

      <!-- 搜索和筛选区域 -->
      <div class="backdrop-blur-lg bg-white/10 rounded-2xl border border-white/20 shadow-xl p-6 mb-8">
        <div class="flex flex-wrap gap-4 items-center">
          <div class="flex-1 min-w-48">
            <div class="relative">
              <input 
                v-model="searchForm.customerName" 
                type="text" 
                placeholder="搜索客户名称..."
                class="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
                @keyup.enter="handleSearch"
              >
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i class="fas fa-search text-gray-400"></i>
              </div>
            </div>
          </div>
          <div class="flex gap-3">
            <input
              v-model="searchForm.staffName"
              type="text"
              placeholder="员工姓名"
              class="px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 w-32"
              @keyup.enter="handleSearch"
            >
            <input
              v-model="startDate"
              type="date"
              class="px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 w-36"
            >
            <span class="text-gray-400 self-center">至</span>
            <input
              v-model="endDate"
              type="date"
              class="px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 w-36"
            >
            <button 
              @click="handleSearch"
              class="px-6 py-3 bg-gradient-to-r from-primary to-primary-light text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <i class="fas fa-search mr-2"></i>
              搜索
            </button>
            <button 
              @click="handleReset"
              class="px-6 py-3 bg-white/10 text-white border border-white/20 rounded-xl hover:bg-white/20 transition-all duration-300"
            >
              <i class="fas fa-redo mr-2"></i>
              重置
            </button>
          </div>
        </div>
      </div>

      <!-- 数据表格 -->
      <div class="backdrop-blur-lg bg-white/10 rounded-2xl border border-white/20 shadow-xl overflow-hidden">
        <div class="table-header p-6 border-b border-white/20 flex justify-between items-center bg-white/5">
          <h3 class="text-lg font-medium text-white">联系记录列表</h3>
          <div class="text-sm text-gray-300">
            共 {{ total }} 条记录
          </div>
        </div>
        
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-white/5 border-b border-white/20">
              <tr>
                <th class="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">客户</th>
                <th class="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">联系时间</th>
                <th class="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">沟通内容</th>
                <th class="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">员工</th>
                <th class="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">部门</th>
                <th class="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">客户状态</th>
                <th class="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">创建时间</th>
                <th class="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">操作</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-white/10">
              <tr v-for="record in contactRecords" :key="record.id" class="hover:bg-white/5 transition-colors duration-200">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-medium shadow-lg">
                      {{ record.customer_name ? record.customer_name.charAt(0) : '?' }}
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-white">{{ record.customer_name }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-white">{{ formatDateTime(record.contact_time) }}</div>
                </td>
                <td class="px-6 py-4">
                  <div class="text-sm text-gray-300 max-w-xs truncate" :title="record.content">
                    {{ record.content }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-white">{{ record.staff_name }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-300">{{ record.department_name }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="getCustomerStatusClass(record.customer_status)" class="px-2 py-1 text-xs font-medium rounded-full">
                    {{ getCustomerStatusText(record.customer_status) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{{ formatDateTime(record.created_at) }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div class="flex space-x-2">
                    <button 
                    
                      @click="handleView(record)"
                      class="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors"
                    >
                      <i class="fas fa-eye mr-1"></i>
                      查看
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
            显示 {{ (currentPage - 1) * pageSize + 1 }} 到 {{ Math.min(currentPage * pageSize, total) }} 条，共 {{ total }} 条记录
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
              {{ currentPage }} / {{ Math.ceil(total / pageSize) }}
            </span>
            <button 
              @click="nextPage"
              :disabled="currentPage * pageSize >= total"
              class="px-4 py-2 bg-white/10 text-white border border-white/20 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/20 transition-all duration-300"
            >
              下一页
              <i class="fas fa-chevron-right ml-2"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- 详情模态框 -->
      <transition
        enter-active-class="transition-all duration-300 ease-out"
        enter-from-class="opacity-0 scale-95"
        enter-to-class="opacity-100 scale-100"
        leave-active-class="transition-all duration-200 ease-in"
        leave-from-class="opacity-100 scale-100"
        leave-to-class="opacity-0 scale-95"
      >
        <div v-if="showViewModal" class="fixed inset-0 bg-black/70 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center modal-scrollbar">
          <div class="relative w-full max-w-6xl mx-4 bg-slate-800/95 backdrop-blur-xl rounded-2xl border border-white/30 shadow-2xl transform transition-all duration-300 modal-glow max-h-[85vh] flex flex-col">
            <div class="flex justify-between items-center p-4 border-b border-white/20 bg-slate-900/50 rounded-t-2xl flex-shrink-0">
              <h3 class="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                联系记录详情
              </h3>
              <button @click="closeViewModal" class="text-gray-400 hover:text-white transition-all duration-300 hover:rotate-90 w-6 h-6 flex items-center justify-center rounded-full hover:bg-white/10">
                <i class="fas fa-times text-lg"></i>
              </button>
            </div>
            <div v-if="currentRecord" class="p-4 space-y-4 overflow-y-auto flex-1">
            <!-- 客户信息和联系记录信息 - 左右布局 -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <!-- 客户信息区域 -->
              <div class="bg-slate-700/30 rounded-2xl p-3 border border-white/10 shadow-lg backdrop-blur-sm modal-content-glow">
                <h4 class="text-base font-semibold text-white mb-3 flex items-center">
                  <i class="fas fa-user-tie mr-2 text-primary"></i>
                  客户信息
                </h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div class="w-full px-2 py-2 bg-slate-700/50 border border-white/20 rounded-lg text-white font-medium transition-all duration-300 hover:border-white/40 hover:shadow-lg text-xs">
                    <div class="text-gray-400 text-xs mb-1">客户名称</div>
                    {{ currentRecord.customer_name }}
                  </div>
                  <div class="w-full px-2 py-2 bg-slate-700/50 border border-white/20 rounded-lg text-white transition-all duration-300 hover:border-white/40 text-xs">
                    <div class="text-gray-400 text-xs mb-1">客户状态</div>
                    <span :class="getCustomerStatusClass(currentRecord.customer_status)" class="px-2 py-1 rounded-full text-xs font-medium">
                      {{ getCustomerStatusText(currentRecord.customer_status) }}
                    </span>
                  </div>
                  <div class="w-full px-2 py-2 bg-slate-700/50 border border-white/20 rounded-lg text-white transition-all duration-300 hover:border-white/40 text-xs">
                    <div class="text-gray-400 text-xs mb-1">公司</div>
                    {{ currentRecord.customer_company || '-' }}
                  </div>
                  <div class="w-full px-2 py-2 bg-slate-700/50 border border-white/20 rounded-lg text-white transition-all duration-300 hover:border-white/40 text-xs">
                    <div class="text-gray-400 text-xs mb-1">联系电话</div>
                    {{ currentRecord.customer_phone || '-' }}
                  </div>
                  <div class="w-full px-2 py-2 bg-slate-700/50 border border-white/20 rounded-lg text-white transition-all duration-300 hover:border-white/40 text-xs md:col-span-2">
                    <div class="text-gray-400 text-xs mb-1">邮箱</div>
                    {{ currentRecord.customer_email || '-' }}
                  </div>
                  <div class="w-full px-2 py-2 bg-slate-700/50 border border-white/20 rounded-lg text-white transition-all duration-300 hover:border-white/40 text-xs md:col-span-2">
                    <div class="text-gray-400 text-xs mb-1">客户来源</div>
                    {{ getCustomerSourceText(currentRecord.customer_source) }}
                  </div>
                </div>
              </div>

              <!-- 联系记录信息 -->
              <div class="bg-slate-700/30 rounded-2xl p-3 border border-white/10 shadow-lg backdrop-blur-sm modal-content-glow">
                <h4 class="text-base font-semibold text-white mb-3 flex items-center">
                  <i class="fas fa-phone mr-2 text-primary"></i>
                  联系记录信息
                </h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div class="w-full px-2 py-2 bg-slate-700/50 border border-white/20 rounded-lg text-white transition-all duration-300 hover:border-white/40 text-xs">
                    <div class="text-gray-400 text-xs mb-1">联系时间</div>
                    {{ formatDateTime(currentRecord.contact_time) }}
                  </div>
                  <div class="w-full px-2 py-2 bg-slate-700/50 border border-white/20 rounded-lg text-white transition-all duration-300 hover:border-white/40 text-xs">
                    <div class="text-gray-400 text-xs mb-1">员工姓名</div>
                    {{ currentRecord.staff_name }}
                  </div>
                  <div class="w-full px-2 py-2 bg-slate-700/50 border border-white/20 rounded-lg text-white transition-all duration-300 hover:border-white/40 text-xs">
                    <div class="text-gray-400 text-xs mb-1">所属部门</div>
                    {{ currentRecord.department_name }}
                  </div>
                  <div class="w-full px-2 py-2 bg-slate-700/50 border border-white/20 rounded-lg text-white transition-all duration-300 hover:border-white/40 text-xs">
                    <div class="text-gray-400 text-xs mb-1">创建时间</div>
                    {{ formatDateTime(currentRecord.created_at) }}
                  </div>
                  <div class="w-full px-2 py-2 bg-slate-700/50 border border-white/20 rounded-lg text-white transition-all duration-300 hover:border-white/40 text-xs">
                    <div class="text-gray-400 text-xs mb-1">更新时间</div>
                    {{ formatDateTime(currentRecord.updated_at) }}
                  </div>
                  <div v-if="currentRecord.days_since_last_contact" class="w-full px-2 py-2 bg-slate-700/50 border border-white/20 rounded-lg text-white transition-all duration-300 hover:border-white/40 text-xs">
                    <div class="text-gray-400 text-xs mb-1">距离上次联系</div>
                    <span class="font-medium text-blue-300 text-xs">{{ currentRecord.days_since_last_contact }} 天</span>
                  </div>
                </div>
              </div>
            </div>
            <!-- 沟通内容区域 -->
            <div class="bg-slate-700/30 rounded-2xl p-3 border border-white/10 shadow-lg backdrop-blur-sm modal-content-glow">
              <h4 class="text-base font-semibold text-white mb-3 flex items-center">
                <i class="fas fa-comments mr-2 text-primary"></i>
                沟通内容
              </h4>
              <div class="space-y-2">
                <div v-if="currentRecord.content" class="w-full px-2 py-2 bg-slate-700/50 border border-white/20 rounded-lg text-white transition-all duration-300 hover:border-white/40 text-xs min-h-[50px]">
                  {{ currentRecord.content }}
                </div>
              
              </div>
            </div>
            </div>
            <div class="flex justify-end p-4 border-t border-white/20 bg-slate-900/50 rounded-b-2xl flex-shrink-0">
              <button
                @click="closeViewModal"
                class="px-6 py-2 bg-white/10 text-white border border-white/20 rounded-lg hover:bg-white/20 hover:border-white/40 transition-all duration-300 flex items-center space-x-2 font-medium text-sm"
              >
                <i class="fas fa-times"></i>
                <span>关闭</span>
              </button>
            </div>
          </div>
        </div>
      </transition>
    </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Search, Refresh } from '@element-plus/icons-vue'
import { getContactRecordsList } from '@/api/contactRecords.js'
import NavigationBar from '@/components/NavigationBar.vue'

// 搜索表单
const searchForm = reactive({
  customerName: '',
  staffName: '',
  contactTimeRange: null
})

// 日期范围搜索
const startDate = ref('')
const endDate = ref('')

// 表格数据
const contactRecords = ref([])
const loading = ref(false)
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)

// 模态框状态
const showViewModal = ref(false)
const currentRecord = ref(null)

// 获取联系记录列表
const fetchContactRecords = async () => {
  loading.value = true
  try {
    const params = {
      page: currentPage.value,
      pageSize: pageSize.value,
      sortBy: 'contact_time',
      sortOrder: 'desc'
    }
    
    // 添加搜索条件
    if (searchForm.customerName) {
      params.customerName = searchForm.customerName
    }
    if (searchForm.staffName) {
      params.staffName = searchForm.staffName
    }
    if (startDate.value) {
      params.startDate = startDate.value
    }
    if (endDate.value) {
      params.endDate = endDate.value
    }
    
    const response = await getContactRecordsList(params)
    
    if (response.success) {
      contactRecords.value = response.data || []
      total.value = response.pagination?.total || 0
      
      // 调试日志：检查第一条记录的客户名称
      if (contactRecords.value.length > 0) {
        console.log('第一条联系记录数据:', contactRecords.value[0])
        console.log('客户名称:', contactRecords.value[0].customer_name)
      }
    } else {
      ElMessage.error(response.message || '获取联系记录失败')
    }
  } catch (error) {
    console.error('获取联系记录失败:', error)
    ElMessage.error('获取联系记录失败')
  } finally {
    loading.value = false
  }
}

// 刷新数据
const refreshData = () => {
  fetchContactRecords()
  ElMessage.success('数据已刷新')
}

// 上一页
const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
    fetchContactRecords()
  }
}

// 下一页
const nextPage = () => {
  if (currentPage.value * pageSize.value < total.value) {
    currentPage.value++
    fetchContactRecords()
  }
}

// 搜索
const handleSearch = () => {
  currentPage.value = 1
  fetchContactRecords()
}

// 重置
const handleReset = () => {
  searchForm.customerName = ''
  searchForm.staffName = ''
  startDate.value = ''
  endDate.value = ''
  handleSearch()
}

// 分页大小改变
const handleSizeChange = (val) => {
  pageSize.value = val
  currentPage.value = 1
  fetchContactRecords()
}

// 当前页改变
const handleCurrentChange = (val) => {
  currentPage.value = val
  fetchContactRecords()
}

// 行点击
const handleRowClick = (row) => {
  handleView(row)
}

// 查看详情
const handleView = (record) => {
  currentRecord.value = { ...record }
  showViewModal.value = true
} 

// 格式化日期时间
const formatDateTime = (dateTime) => {
  if (!dateTime) return ''
  const date = new Date(dateTime)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

// 获取客户状态样式
const getCustomerStatusClass = (status) => {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-800'
    case 'vip':
      return 'bg-yellow-100 text-yellow-800'
    case 'inactive':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

// 获取客户状态文本
const getCustomerStatusText = (status) => {
  switch (status) {
    case 'active':
      return '活跃'
    case 'vip':
      return 'VIP'
    case 'inactive':
      return '流失'
    default:
      return '未知'
  }
}

// 获取客户来源文本
const getCustomerSourceText = (source) => {
  switch (source) {
    case 'advertisement':
      return '广告'
    case 'referral':
      return '推荐'
    case 'website':
      return '网站'
    case 'social':
      return '社交媒体'
    case 'event':
      return '活动'
    case 'other':
      return '其他'
    default:
      return source || '-'
  }
}

const getContactMethodText = (method) => {
  switch (method) {
    case 'phone':
      return '电话'
    case 'email':
      return '邮件'
    case 'meeting':
      return '会议'
    case 'wechat':
      return '微信'
    case 'qq':
      return 'QQ'
    case 'other':
      return '其他'
    default:
      return method || '-'
  }
}

const getContactPurposeText = (purpose) => {
  switch (purpose) {
    case 'sales':
      return '销售'
    case 'support':
      return '技术支持'
    case 'followup':
      return '跟进'
    case 'negotiation':
      return '谈判'
    case 'demo':
      return '演示'
    case 'other':
      return '其他'
    default:
      return purpose || '-'
  }
}

// 关闭查看模态框
const closeViewModal = () => {
  showViewModal.value = false
  currentRecord.value = null
}

// 初始化
onMounted(() => {
  fetchContactRecords()
})
</script>

<style scoped>
/* 动画定义 */
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}

@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.6s ease-out;
}

@keyframes pulse {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* 主容器样式 */
.contact-record-management {
  min-height: 100vh;
  position: relative;
}

/* 搜索表单样式 */
.search-form {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: flex-end;
  margin: 0;
}

/* 内容预览样式 */
.content-preview {
  max-width: 300px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* 模态框样式增强 */
.modal-glow {
  box-shadow: 0 0 40px rgba(59, 130, 246, 0.3), 0 0 80px rgba(59, 130, 246, 0.1);
}

.modal-content-glow {
  box-shadow: inset 0 0 20px rgba(255, 255, 255, 0.05), 0 0 20px rgba(0, 0, 0, 0.3);
}

/* 模态框滚动条样式 */
.modal-scrollbar::-webkit-scrollbar {
  width: 8px;
}

.modal-scrollbar::-webkit-scrollbar-track {
  background: rgba(15, 23, 42, 0.5);
  border-radius: 4px;
}

.modal-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(59, 130, 246, 0.5);
  border-radius: 4px;
}

.modal-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(59, 130, 246, 0.7);
}

/* 表格样式 */
.contact-records-table {
  width: 100%;
  border-collapse: collapse;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.contact-records-table th {
  background: rgba(255, 255, 255, 0.05);
  color: #e5e7eb;
  font-weight: 600;
  padding: 16px;
  text-align: left;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.contact-records-table td {
  padding: 16px;
  color: #d1d5db;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  transition: all 0.3s ease;
}

.contact-records-table tr:hover {
  background: rgba(255, 255, 255, 0.08);
  transform: translateY(-1px);
}

.contact-records-table tr {
  transition: all 0.3s ease;
}

/* 操作按钮组样式 */
.btn-group {
  display: flex;
  gap: 8px;
  align-items: center;
}

/* 分页样式 */
.pagination-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  margin-top: 24px;
}

.pagination-controls .pagination-info {
  color: #d1d5db;
  font-size: 14px;
}

.pagination-controls .pagination-buttons {
  display: flex;
  gap: 8px;
}

.pagination-controls .btn {
  padding: 8px 16px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.1);
  color: #d1d5db;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
}

.pagination-controls .btn:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-1px);
}

.pagination-controls .btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-controls .btn.active {
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  color: white;
  border-color: transparent;
}

/* 模态框样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(10px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
}

.modal-overlay.active {
  opacity: 1;
  visibility: visible;
}

.modal-content {
  background: rgba(30, 41, 59, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  transform: scale(0.9);
  transition: all 0.3s ease;
}

.modal-overlay.active .modal-content {
  transform: scale(1);
}

.modal-header {
  background: rgba(255, 255, 255, 0.05);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding: 20px 24px;
  border-radius: 16px 16px 0 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-title {
  color: #e5e7eb;
  font-size: 18px;
  font-weight: 600;
  margin: 0;
}

.modal-close {
  background: none;
  border: none;
  color: #9ca3af;
  font-size: 24px;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.modal-close:hover {
  color: #e5e7eb;
  background: rgba(255, 255, 255, 0.1);
}

.modal-body {
  padding: 24px;
  color: #d1d5db;
}

.modal-footer {
  background: rgba(255, 255, 255, 0.05);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding: 16px 24px;
  border-radius: 0 0 16px 16px;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

/* 表单样式 */
.form-group {
  margin-bottom: 20px;
}

.form-label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #e5e7eb;
}

.form-control {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.05);
  color: #d1d5db;
  font-size: 14px;
  transition: all 0.3s ease;
}

.form-control:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-control::placeholder {
  color: #9ca3af;
}

.form-control:disabled {
  background: rgba(255, 255, 255, 0.02);
  color: #6b7280;
  cursor: not-allowed;
}

/* 详情网格样式 */
.detail-grid {
  display: grid;
  grid-template-columns: 100px 1fr;
  gap: 16px;
  align-items: center;
}

.detail-label {
  font-weight: 500;
  color: #9ca3af;
  text-align: right;
  padding-right: 12px;
}

.detail-value {
  color: #d1d5db;
  background: rgba(255, 255, 255, 0.02);
  padding: 8px 12px;
  border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

/* 客户头像样式 */
.customer-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 14px;
}

/* 表单元素样式 */
:deep(.el-input__inner),
:deep(.el-textarea__inner),
:deep(.el-select .el-input__inner) {
  background: rgba(255, 255, 255, 0.05) !important;
  border: 1px solid rgba(255, 255, 255, 0.2) !important;
  color: #d1d5db !important;
  border-radius: 12px !important;
}

:deep(.el-input__inner:focus),
:deep(.el-textarea__inner:focus),
:deep(.el-select .el-input__inner:focus) {
  border-color: #3b82f6 !important;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2) !important;
}

:deep(.el-input__wrapper) {
  background: transparent !important;
  box-shadow: none !important;
  padding: 0 !important;
}

:deep(.el-form-item__label) {
  color: #e5e7eb !important;
  font-weight: 500 !important;
}

:deep(.el-button) {
  border-radius: 12px !important;
  transition: all 0.3s ease !important;
}

:deep(.el-button:hover) {
  transform: translateY(-1px) !important;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2) !important;
}

/* 记录详情样式 */
.record-detail {
  padding: 10px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .search-form {
    flex-direction: column;
    align-items: stretch;
  }
  
  :deep(.el-form-item) {
    margin-right: 0 !important;
    width: 100% !important;
  }
  
  :deep(.el-form-item__content) {
    width: 100% !important;
  }
}

/* 客户状态标签样式 */
.bg-green-100 {
  background-color: rgba(34, 197, 94, 0.2) !important;
}
.text-green-800 {
  color: #16a34a !important;
}

.bg-yellow-100 {
  background-color: rgba(234, 179, 8, 0.2) !important;
}
.text-yellow-800 {
  color: #ca8a04 !important;
}

.bg-red-100 {
  background-color: rgba(239, 68, 68, 0.2) !important;
}
.text-red-800 {
  color: #dc2626 !important;
}

.bg-gray-100 {
  background-color: rgba(156, 163, 175, 0.2) !important;
}
.text-gray-800 {
  color: #4b5563 !important;
}
</style>