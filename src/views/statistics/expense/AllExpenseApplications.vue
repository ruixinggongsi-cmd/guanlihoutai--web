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
      <div class="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-semibold text-gray-300 mb-2">
            <i class="fas fa-filter mr-2"></i>状态筛选
          </label>
          <select 
            v-model="filters.status"
            @change="handleSearch"
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
            <i class="fas fa-user mr-2"></i>申请人（用户名/姓名）
          </label>
          <input 
            v-model="filters.applicantName"
            type="text"
            placeholder="输入用户名或姓名"
            @keyup.enter="handleSearch"
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
            @keyup.enter="handleSearch"
            class="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div class="flex items-end">
          <button
            @click="handleSearch"
            class="w-full px-6 py-2.5 bg-gradient-to-r from-primary to-secondary text-white rounded-xl hover:from-primary/80 hover:to-secondary/80 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl flex items-center justify-center"
          >
            <i class="fas fa-search mr-2"></i>
            搜索
          </button>
        </div>
      </div>

      <!-- 批量操作栏 -->
      <div v-if="selectedIds.length > 0" class="mb-4 p-4 bg-primary/20 border border-primary/30 rounded-xl flex items-center justify-between">
        <div class="text-white">
          <i class="fas fa-check-circle mr-2"></i>
          已选择 <span class="font-bold text-primary">{{ selectedIds.length }}</span> 条记录
        </div>
        <button
          @click="handleBatchDelete"
          class="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors font-semibold flex items-center"
        >
          <i class="fas fa-trash-alt mr-2"></i>
          批量删除
        </button>
      </div>

      <!-- 数据表格 -->
      <div class="overflow-x-auto">
        <table class="w-full text-left">
          <thead>
            <tr class="border-b border-white/20">
              <th class="px-4 py-3 text-gray-300 font-semibold text-center" style="width: 50px;">
                <input
                  type="checkbox"
                  :checked="isAllSelected"
                  @change="handleSelectAll"
                  class="w-4 h-4 text-primary bg-white/10 border-white/20 rounded focus:ring-primary"
                />
              </th>
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
              <td class="px-4 py-3 text-center">
                <input
                  type="checkbox"
                  :value="item.id"
                  v-model="selectedIds"
                  class="w-4 h-4 text-primary bg-white/10 border-white/20 rounded focus:ring-primary"
                />
              </td>
              <td class="px-4 py-3 text-white">{{ item.name }}</td>
              <td class="px-4 py-3 text-white">
                {{ item.applicant_info?.name || item.applicant_name || '未知' }}
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
                <div class="flex items-center justify-center gap-2">
                  <button
                    @click="handleView(item)"
                    class="px-3 py-1.5 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition-colors text-sm font-semibold"
                    title="查看详情"
                  >
                    <i class="fas fa-eye mr-1"></i>
                    查看
                  </button>
                  <button
                    @click="handleDelete(item)"
                    class="px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors text-sm font-semibold"
                    title="删除"
                  >
                    <i class="fas fa-trash-alt mr-1"></i>
                    删除
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="filteredApplications.length === 0">
              <td colspan="9" class="px-4 py-8 text-center text-gray-400">
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

    <!-- 费用详情模态框 -->
    <Teleport to="body">
      <div v-if="showViewModal" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4" @click.self="closeViewModal">
        <div class="backdrop-blur-xl bg-gradient-to-br from-white/15 to-white/5 rounded-2xl border border-white/20 shadow-2xl w-full max-w-4xl mx-4 max-h-[80vh] flex flex-col relative z-[10000]" @click.stop>
        
        <!-- 标题栏 - 固定在顶部 -->
        <div class="p-6 border-b border-white/10 flex-shrink-0">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-4">
              <div class="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <i class="fas fa-file-invoice text-white text-xl"></i>
              </div>
              <div>
                <h2 class="text-2xl font-bold text-white">费用详情</h2>
                <p class="text-gray-400 text-sm">查看费用单据的完整信息</p>
              </div>
            </div>
            <button 
              @click="closeViewModal"
              class="w-10 h-10 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 rounded-xl flex items-center justify-center text-white transition-all duration-200 group border border-gray-500/30 hover:shadow-lg"
            >
              <i class="fas fa-times text-lg group-hover:rotate-90 transition-transform duration-300"></i>
            </button>
          </div>
        </div>

        <!-- 内容区域 - 可滚动 -->
        <div class="p-6 overflow-y-auto flex-1">
          
          <!-- 单据详细信息 -->
          <div class="mb-8">
            
            <!-- 简洁的左右结构布局 -->
            <div class="bg-white/5 rounded-xl p-4 border border-white/10 backdrop-blur-sm">
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <!-- 左侧：基础信息 -->
                <div class="space-y-4">
                  <div class="flex items-start justify-between py-3 border-b border-white/10">
                    <label class="text-sm font-medium text-gray-400 flex items-center">
                      <i class="fas fa-file-signature mr-2 text-blue-400"></i>
                      费用名称
                    </label>
                    <div class="text-white font-medium text-lg max-w-xs text-right">
                      {{ viewingExpense?.name || '-' }}
                    </div>
                  </div>
                  
                  <div class="flex items-start justify-between py-3 border-b border-white/10">
                    <label class="text-sm font-medium text-gray-400 flex items-center">
                      <i class="fas fa-tag mr-2 text-purple-400"></i>
                      主分类
                    </label>
                    <div class="text-purple-300 font-medium max-w-xs text-right">
                      <span class="px-3 py-1.5 bg-gradient-to-r from-purple-500/20 to-purple-600/20 text-purple-300 border border-purple-400/30 rounded-full text-xs font-medium backdrop-blur-sm">
                        <i class="fas fa-tag mr-1 text-purple-400"></i>
                        {{ viewingExpense?.main_category_name || viewingExpense?.main_category_id || '-' }}
                      </span>
                    </div>
                  </div>
                  
                  <div class="flex items-start justify-between py-3 border-b border-white/10">
                    <label class="text-sm font-medium text-gray-400 flex items-center">
                      <i class="fas fa-folder mr-2 text-cyan-400"></i>
                      子分类
                    </label>
                    <div class="text-cyan-300 font-medium max-w-xs text-right">
                      <span class="px-3 py-1.5 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border border-cyan-400/30 rounded-full text-xs font-medium backdrop-blur-sm">
                        <i class="fas fa-folder mr-1 text-cyan-400"></i>
                        {{ viewingExpense?.sub_category_name || viewingExpense?.sub_category_id || '-' }}
                      </span>
                    </div>
                  </div>
                  
                  <div class="flex items-start justify-between py-3">
                    <label class="text-sm font-medium text-gray-400 flex items-center">
                      <i class="fas fa-yen-sign mr-2 text-emerald-400"></i>
                      金额
                    </label>
                    <div class="text-emerald-300 font-bold text-xl">
                      ¥{{ viewingExpense?.amount ? formatAmount(viewingExpense.amount) : '0.00' }}
                    </div>
                  </div>
                </div>

                <!-- 右侧：状态和时间信息 -->
                <div class="space-y-4">
                  <div class="flex items-start justify-between py-3 border-b border-white/10">
                    <label class="text-sm font-medium text-gray-400 flex items-center">
                      <i class="fas fa-info-circle mr-2 text-blue-400"></i>
                      状态
                    </label>
                    <div class="max-w-xs text-right">
                      <span :class="viewingExpense ? getStatusClass(viewingExpense.status) : ''" class="inline-flex items-center gap-2 px-3 py-1 rounded-lg text-sm font-medium">
                        {{ viewingExpense ? getStatusText(viewingExpense.status) : '-' }}
                      </span>
                    </div>
                  </div>

                  <div class="flex items-start justify-between py-3 border-b border-white/10">
                    <label class="text-sm font-medium text-gray-400 flex items-center">
                      <i class="fas fa-calendar mr-2 text-yellow-400"></i>
                      日期
                    </label>
                    <div class="text-white font-medium max-w-xs text-right">
                      {{ viewingExpense ? formatDate(viewingExpense.date || viewingExpense.expense_date) : '-' }}
                    </div>
                  </div>
                  
                  <div class="flex items-start justify-between py-3 border-b border-white/10">
                    <label class="text-sm font-medium text-gray-400 flex items-center">
                      <i class="fas fa-user mr-2 text-green-400"></i>
                      申请人
                    </label>
                    <div class="text-white font-medium max-w-xs text-right">
                      {{ viewingExpense?.applicant_info?.name || viewingExpense?.applicant_name || '-' }}
                    </div>
                  </div>
                  
                  <div class="flex items-start justify-between py-3 border-b border-white/10">
                    <label class="text-sm font-medium text-gray-400 flex items-center">
                      <i class="fas fa-building mr-2 text-orange-400"></i>
                      部门
                    </label>
                    <div class="text-gray-300 font-medium max-w-xs text-right">
                      {{ viewingExpense?.applicant_info?.department || '-' }}
                    </div>
                  </div>
                  
                  <div class="flex items-start justify-between py-3 border-b border-white/10">
                    <label class="text-sm font-medium text-gray-400 flex items-center">
                      <i class="fas fa-clock mr-2 text-gray-400"></i>
                      创建时间
                    </label>
                    <div class="text-gray-300 text-sm max-w-xs text-right">
                      {{ viewingExpense?.created_at ? formatDateTime(viewingExpense.created_at) : '-' }}
                    </div>
                  </div>
                  
                  <div class="flex items-start justify-between py-3">
                    <label class="text-sm font-medium text-gray-400 flex items-center">
                      <i class="fas fa-sync mr-2 text-gray-400"></i>
                      更新时间
                    </label>
                    <div class="text-gray-300 text-sm max-w-xs text-right">
                      {{ viewingExpense?.updated_at ? formatDateTime(viewingExpense.updated_at) : '-' }}
                    </div>
                  </div>
                </div>
              </div>

              <!-- 描述信息 -->
              <div class="mt-6 pt-6 border-t border-white/10">
                <label class="block text-sm font-medium text-gray-400 mb-3 flex items-center">
                  <i class="fas fa-align-left mr-2 text-blue-400"></i>
                  描述
                </label>
                <div class="text-gray-300 leading-relaxed min-h-[60px]">
                  {{ viewingExpense?.description || '暂无描述信息' }}
                </div>
              </div>

              <!-- 付款信息 -->
              <div v-if="viewingExpense?.payment_method || viewingExpense?.payee_name || viewingExpense?.account_name || viewingExpense?.account_type" class="mt-6 pt-6 border-t border-white/10">
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <!-- 左侧：付款方式 -->
                  <div class="space-y-4">
                    <div v-if="viewingExpense?.payment_method" class="flex items-start justify-between py-3 border-b border-white/10">
                      <label class="text-sm font-medium text-gray-400 flex items-center">
                        <i class="fas fa-credit-card mr-2 text-blue-400"></i>
                        付款方式
                      </label>
                      <div class="text-blue-300 font-medium max-w-xs text-right">
                        {{ viewingExpense.payment_method }}
                      </div>
                    </div>
                    
                    <div v-if="viewingExpense?.payee_name" class="flex items-start justify-between py-3">
                      <label class="text-sm font-medium text-gray-400 flex items-center">
                        <i class="fas fa-user mr-2 text-purple-400"></i>
                        收款人姓名
                      </label>
                      <div class="text-purple-300 font-medium max-w-xs text-right">
                        {{ viewingExpense.payee_name }}
                      </div>
                    </div>
                  </div>

                  <!-- 右侧：账户信息 -->
                  <div class="space-y-4">
                    <div v-if="viewingExpense?.account_name" class="flex items-start justify-between py-3 border-b border-white/10">
                      <label class="text-sm font-medium text-gray-400 flex items-center">
                        <i class="fas fa-university mr-2 text-green-400"></i>
                        账户名称
                      </label>
                      <div class="text-green-300 font-medium max-w-xs text-right">
                        {{ viewingExpense.account_name }}
                      </div>
                    </div>
                    
                    <div v-if="viewingExpense?.account_type" class="flex items-start justify-between py-3">
                      <label class="text-sm font-medium text-gray-400 flex items-center">
                        <i class="fas fa-hashtag mr-2 text-orange-400"></i>
                        账号
                      </label>
                      <div class="text-orange-300 font-medium max-w-xs text-right">
                        {{ viewingExpense.account_type }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted, Teleport } from 'vue'
import { expenseApplicationsAPI } from '@/api/expenseApplications'
import { ElMessage, ElMessageBox } from 'element-plus'

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
const selectedIds = ref([]) // 选中的ID列表
const showViewModal = ref(false) // 查看详情模态框显示状态
const viewingExpense = ref(null) // 当前查看的费用申请
const pagination = reactive({
  page: 1,
  pageSize: 100,
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
  // 如果没有设置日期范围，使用默认日期范围（最近一年）
  let startDate = props.startDate
  let endDate = props.endDate
  
  if (!startDate || !endDate) {
    const today = new Date()
    const oneYearAgo = new Date()
    oneYearAgo.setFullYear(today.getFullYear() - 1)
    
    startDate = startDate || oneYearAgo.toISOString().split('T')[0]
    endDate = endDate || today.toISOString().split('T')[0]
    
    console.log('[所有申请记录] 使用默认日期范围', { startDate, endDate })
  }

  try {
    loading.value = true
    error.value = ''
    emit('loading', true)

    const params = {
      page: pagination.page,
      pageSize: pagination.pageSize,
      start_date: startDate,
      end_date: endDate,
      keyword: filters.keyword || undefined,
      status: filters.status !== 'all' ? filters.status : undefined,
      applicant_name: filters.applicantName || undefined  // 添加申请人姓名/用户名筛选参数
    }

    console.log('[所有申请记录] 开始加载数据，参数:', params)
    console.log('[所有申请记录] 申请人筛选:', filters.applicantName)
    const response = await expenseApplicationsAPI.getAllExpenseApplicationsList(params)
    console.log('[所有申请记录] API响应:', response)
    console.log('[所有申请记录] 返回数据量:', response.data?.length || 0)
    
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
// 注意：申请人筛选现在主要在后端进行，这里只做前端实时过滤（用于显示）
const filteredApplications = computed(() => {
  let result = applications.value
  
  // 前端补充筛选（主要用于实时显示，后端已经做了主要筛选）
  // 如果后端筛选不满足需求，可以在这里添加额外的筛选逻辑
  // 目前后端已经处理了申请人筛选，所以这里不需要再次筛选
  
  return result
})

// 全选/取消全选
const isAllSelected = computed(() => {
  return filteredApplications.value.length > 0 && 
         selectedIds.value.length === filteredApplications.value.length &&
         filteredApplications.value.every(item => selectedIds.value.includes(item.id))
})

const handleSelectAll = (event) => {
  if (event.target.checked) {
    // 全选当前页的所有记录
    const currentPageIds = filteredApplications.value.map(item => item.id)
    selectedIds.value = [...new Set([...selectedIds.value, ...currentPageIds])]
  } else {
    // 取消全选当前页的记录
    const currentPageIds = filteredApplications.value.map(item => item.id)
    selectedIds.value = selectedIds.value.filter(id => !currentPageIds.includes(id))
  }
}

// 批量删除
const handleBatchDelete = async () => {
  if (selectedIds.value.length === 0) {
    ElMessage.warning('请先选择要删除的记录')
    return
  }

  try {
    await ElMessageBox.confirm(
      `确定要删除选中的 ${selectedIds.value.length} 条费用申请吗？此操作不可恢复！`,
      '确认批量删除',
      {
        confirmButtonText: '确定删除',
        cancelButtonText: '取消',
        type: 'warning',
        confirmButtonClass: 'el-button--danger'
      }
    )

    // 将 Vue Proxy 数组转换为普通数组
    const idsArray = Array.from(selectedIds.value)
    console.log('[前端批量删除] 准备删除的IDs:', idsArray)
    console.log('[前端批量删除] 删除数量:', idsArray.length)
    
    const response = await expenseApplicationsAPI.batchDeleteExpenseApplications(idsArray)
    
    console.log('[前端批量删除] API响应:', response)

    if (response.success) {
      ElMessage.success(response.message || `成功删除 ${selectedIds.value.length} 条记录`)
      selectedIds.value = [] // 清空选择
      loadData() // 重新加载数据
    } else {
      ElMessage.error(response.message || '批量删除失败')
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('批量删除失败:', error)
      ElMessage.error(error.response?.data?.message || error.message || '批量删除失败，请稍后重试')
    }
  }
}

// 搜索按钮点击或回车键触发
const handleSearch = () => {
  pagination.page = 1
  selectedIds.value = [] // 清空选择
  loadData()
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

// 查看费用申请详情
const handleView = async (item) => {
  try {
    // 先设置数据并显示模态框，避免闪烁
    viewingExpense.value = { ...item }
    showViewModal.value = true
    
    // 然后异步加载完整的费用申请详情（包含支付信息等完整字段）
    try {
      const detailResponse = await expenseApplicationsAPI.getExpenseApplicationDetail(item.id)
      if (detailResponse.success && detailResponse.data) {
        // 合并详情数据，保留列表中的申请人信息
        viewingExpense.value = {
          ...detailResponse.data,
          ...item, // 保留列表中的信息（如 applicant_info）
          // 确保字段名统一
          payment_method: detailResponse.data.payment_method || detailResponse.data.paymentMethod,
          payee_name: detailResponse.data.payee_name || detailResponse.data.payeeName,
          account_name: detailResponse.data.account_name || detailResponse.data.accountName,
          account_type: detailResponse.data.account_type || detailResponse.data.accountType
        }
      }
    } catch (detailError) {
      console.error('加载费用详情失败:', detailError)
      // 如果详情接口失败，使用列表数据（模态框仍然显示）
      viewingExpense.value = { ...item }
    }
  } catch (error) {
    console.error('查看费用详情错误:', error)
    ElMessage.error('加载费用详情失败，请稍后重试')
    // 即使出错也显示模态框，使用列表数据
    viewingExpense.value = { ...item }
    showViewModal.value = true
  }
}

// 关闭查看详情模态框
const closeViewModal = () => {
  showViewModal.value = false
  viewingExpense.value = null
}

// 删除费用申请
const handleDelete = async (item) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除费用申请"${item.name}"吗？此操作不可恢复！`,
      '确认删除',
      {
        confirmButtonText: '确定删除',
        cancelButtonText: '取消',
        type: 'warning',
        confirmButtonClass: 'el-button--danger'
      }
    )

    const response = await expenseApplicationsAPI.deleteExpenseApplication(item.id)

    if (response.success) {
      ElMessage.success('删除成功')
      loadData()
    } else {
      ElMessage.error(response.message || '删除失败')
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除失败:', error)
      ElMessage.error(error.response?.data?.message || error.message || '删除失败，请稍后重试')
    }
  }
}

// 监听日期变化
watch([() => props.startDate, () => props.endDate], () => {
  pagination.page = 1
  loadData()
}, { immediate: true })

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.all-expense-applications {
  min-height: 400px;
}
</style>

