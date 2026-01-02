<!-- 所有费用申请记录组件（仅超级管理员） -->
<template>
  <div class="all-expense-applications">
    <div v-if="loading" class="flex justify-center items-center py-12">
      <div class="text-white">
        <i class="fas fa-spinner fa-spin text-2xl mr-2"></i>
        <span>加载中...</span>
      </div>
    </div>

    <div v-else-if="error" class="text-center py-12">
      <div class="text-red-400 mb-4">
        <i class="fas fa-exclamation-circle text-2xl mb-2"></i>
        <p>{{ error }}</p>
      </div>
      <button 
        @click="loadData"
        class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/80 transition-colors"
      >
        重试
      </button>
    </div>

    <div v-else>
      <!-- 筛选条件 -->
      <div class="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-semibold text-gray-300 mb-2">
            <i class="fas fa-filter mr-2"></i>状态筛选
          </label>
          <select 
            v-model="filters.status"
            @change="handleFilterChange"
            class="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all" class="bg-slate-800">全部状态</option>
            <option value="pending" class="bg-slate-800">待审批</option>
            <option value="approving" class="bg-slate-800">审批中</option>
            <option value="approved" class="bg-slate-800">已通过</option>
            <option value="rejected" class="bg-slate-800">已拒绝</option>
            <option value="cancelled" class="bg-slate-800">已取消</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-semibold text-gray-300 mb-2">
            <i class="fas fa-user mr-2"></i>申请人
          </label>
          <input 
            v-model="filters.applicantName"
            type="text"
            placeholder="输入申请人姓名"
            @input="handleFilterChange"
            class="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div>
          <label class="block text-sm font-semibold text-gray-300 mb-2">
            <i class="fas fa-search mr-2"></i>关键词搜索
          </label>
          <input 
            v-model="filters.keyword"
            type="text"
            placeholder="搜索费用名称或描述"
            @input="handleFilterChange"
            class="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      <!-- 数据表格 -->
      <div class="overflow-x-auto">
        <table class="w-full text-left">
          <thead>
            <tr class="border-b border-white/20">
              <th class="px-4 py-3 text-gray-300 font-semibold">费用名称</th>
              <th class="px-4 py-3 text-gray-300 font-semibold">申请人</th>
              <th class="px-4 py-3 text-gray-300 font-semibold">部门</th>
              <th class="px-4 py-3 text-gray-300 font-semibold">金额</th>
              <th class="px-4 py-3 text-gray-300 font-semibold">日期</th>
              <th class="px-4 py-3 text-gray-300 font-semibold">状态</th>
              <th class="px-4 py-3 text-gray-300 font-semibold">创建时间</th>
              <th class="px-4 py-3 text-gray-300 font-semibold text-center">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr 
              v-for="item in filteredApplications" 
              :key="item.id"
              class="border-b border-white/10 hover:bg-white/5 transition-colors"
            >
              <td class="px-4 py-3 text-white">{{ item.name }}</td>
              <td class="px-4 py-3 text-white">
                {{ item.applicant_info?.name || '未知' }}
              </td>
              <td class="px-4 py-3 text-gray-400">
                {{ item.applicant_info?.department || '-' }}
              </td>
              <td class="px-4 py-3 text-white font-semibold">
                ¥{{ formatAmount(item.amount) }}
              </td>
              <td class="px-4 py-3 text-gray-400">
                {{ formatDate(item.date || item.expense_date) }}
              </td>
              <td class="px-4 py-3">
                <span :class="getStatusClass(item.status)">
                  {{ getStatusText(item.status) }}
                </span>
              </td>
              <td class="px-4 py-3 text-gray-400 text-sm">
                {{ formatDateTime(item.created_at) }}
              </td>
              <td class="px-4 py-3 text-center">
                <button
                  @click="handleDelete(item)"
                  class="px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors text-sm font-semibold"
                  title="删除"
                >
                  <i class="fas fa-trash-alt mr-1"></i>
                  删除
                </button>
              </td>
            </tr>
            <tr v-if="filteredApplications.length === 0">
              <td colspan="8" class="px-4 py-8 text-center text-gray-400">
                <i class="fas fa-inbox text-2xl mb-2"></i>
                <p>暂无数据</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 分页 -->
      <div v-if="pagination.totalPages > 1" class="mt-6 flex justify-center items-center space-x-4">
        <button 
          @click="changePage(pagination.page - 1)"
          :disabled="pagination.page <= 1"
          class="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <i class="fas fa-chevron-left mr-2"></i>上一页
        </button>
        <span class="text-gray-300">
          第 {{ pagination.page }} / {{ pagination.totalPages }} 页，共 {{ pagination.total }} 条
        </span>
        <button 
          @click="changePage(pagination.page + 1)"
          :disabled="pagination.page >= pagination.totalPages"
          class="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          下一页<i class="fas fa-chevron-right ml-2"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { expenseApplicationsAPI } from '@/api/expenseApplications'
import { ElMessage } from 'element-plus'

const props = defineProps({
  startDate: {
    type: String,
    default: ''
  },
  endDate: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['loading', 'error'])

const loading = ref(false)
const error = ref('')
const applications = ref([])
const pagination = reactive({
  page: 1,
  pageSize: 20,
  total: 0,
  totalPages: 0
})

const filters = reactive({
  status: 'all',
  applicantName: '',
  keyword: ''
})

// 加载数据
const loadData = async () => {
  if (!props.startDate || !props.endDate) {
    console.log('[所有申请记录] 日期未设置，跳过加载', { startDate: props.startDate, endDate: props.endDate })
    return
  }

  try {
    loading.value = true
    error.value = ''
    emit('loading', true)

    const params = {
      page: pagination.page,
      pageSize: pagination.pageSize,
      start_date: props.startDate,
      end_date: props.endDate,
      keyword: filters.keyword || undefined,
      status: filters.status !== 'all' ? filters.status : undefined
    }

    console.log('[所有申请记录] 开始加载数据，参数:', params)
    const response = await expenseApplicationsAPI.getAllExpenseApplicationsList(params)
    console.log('[所有申请记录] API响应:', response)
    
    if (response.success) {
      applications.value = response.data || []
      pagination.total = response.pagination?.total || 0
      pagination.totalPages = response.pagination?.totalPages || 0
      console.log('[所有申请记录] 数据加载成功:', {
        count: applications.value.length,
        total: pagination.total,
        totalPages: pagination.totalPages
      })
    } else {
      error.value = response.message || '获取数据失败'
      emit('error', error.value)
      console.error('[所有申请记录] API返回失败:', response)
    }
  } catch (err) {
    console.error('[所有申请记录] 加载申请记录失败:', err)
    error.value = err.response?.data?.message || err.message || '加载数据失败，请稍后重试'
    emit('error', error.value)
    ElMessage.error(error.value)
  } finally {
    loading.value = false
    emit('loading', false)
  }
}

// 筛选后的申请记录
const filteredApplications = computed(() => {
  let result = applications.value
  
  // 按申请人姓名筛选
  if (filters.applicantName) {
    result = result.filter(item => {
      const applicantName = item.applicant_info?.name || ''
      return applicantName.includes(filters.applicantName)
    })
  }
  
  return result
})

// 筛选条件变化
const handleFilterChange = () => {
  // 关键词和状态筛选需要重新加载数据
  if (filters.keyword || filters.status !== 'all') {
    pagination.page = 1
    loadData()
  }
  // 申请人姓名筛选在前端进行，不需要重新加载
}

// 分页变化
const changePage = (page) => {
  if (page >= 1 && page <= pagination.totalPages) {
    pagination.page = page
    loadData()
  }
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

// 格式化日期
const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('zh-CN')
}

// 格式化日期时间
const formatDateTime = (dateStr) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleString('zh-CN')
}

// 获取状态文本
const getStatusText = (status) => {
  const statusMap = {
    pending: '待审批',
    approving: '审批中',
    approved: '已通过',
    rejected: '已拒绝',
    cancelled: '已取消'
  }
  return statusMap[status] || status
}

// 获取状态样式
const getStatusClass = (status) => {
  const classMap = {
    pending: 'px-3 py-1 rounded-full text-xs font-semibold bg-yellow-500/20 text-yellow-400',
    approving: 'px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-400',
    approved: 'px-3 py-1 rounded-full text-xs font-semibold bg-green-500/20 text-green-400',
    rejected: 'px-3 py-1 rounded-full text-xs font-semibold bg-red-500/20 text-red-400',
    cancelled: 'px-3 py-1 rounded-full text-xs font-semibold bg-gray-500/20 text-gray-400'
  }
  return classMap[status] || 'px-3 py-1 rounded-full text-xs font-semibold bg-gray-500/20 text-gray-400'
}

// 监听日期变化
watch([() => props.startDate, () => props.endDate], () => {
  if (props.startDate && props.endDate) {
    pagination.page = 1
    loadData()
  }
}, { immediate: true })

onMounted(() => {
  if (props.startDate && props.endDate) {
    loadData()
  }
})
</script>

<style scoped>
.all-expense-applications {
  min-height: 400px;
}
</style>

