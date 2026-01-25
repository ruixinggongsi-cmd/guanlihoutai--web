<!-- 用户费用总额统计组件 -->
<template>
  <div class="space-y-6">
    <!-- 统计卡片 - 第一行：时间维度 -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- 总支出 -->
      <div class="backdrop-blur-lg bg-gradient-to-br from-blue-500/20 to-indigo-600/20 rounded-2xl border border-blue-400/30 shadow-xl p-6">
      <div class="flex items-center justify-between mb-4">
          <div class="flex items-center space-x-3">
            <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <i class="fas fa-wallet text-white text-xl"></i>
            </div>
            <div>
              <h3 class="text-sm font-medium text-gray-300">总支出</h3>
              <p class="text-xs text-gray-400">累计费用总额</p>
            </div>
          </div>
        </div>
        <div v-if="loading" class="flex items-center justify-center h-20">
          <i class="fas fa-spinner fa-spin text-2xl text-gray-400"></i>
      </div>
        <div v-else class="space-y-2">
          <p class="text-3xl font-bold text-white">
            ¥{{ formatAmount(totalExpense) }}
          </p>
          <p class="text-xs text-gray-400">
            {{ totalCount }} 条记录
          </p>
        </div>
      </div>
      
      <!-- 昨日支出 -->
      <div class="backdrop-blur-lg bg-gradient-to-br from-purple-500/20 to-pink-600/20 rounded-2xl border border-purple-400/30 shadow-xl p-6">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center space-x-3">
            <div class="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
              <i class="fas fa-calendar-day text-white text-xl"></i>
            </div>
            <div>
              <h3 class="text-sm font-medium text-gray-300">昨日支出</h3>
              <p class="text-xs text-gray-400">{{ yesterdayDate }}</p>
            </div>
          </div>
        </div>
        <div v-if="loading" class="flex items-center justify-center h-20">
          <i class="fas fa-spinner fa-spin text-2xl text-gray-400"></i>
      </div>
        <div v-else class="space-y-2">
          <p class="text-3xl font-bold text-white">
            ¥{{ formatAmount(yesterdayExpense) }}
          </p>
          <p class="text-xs text-gray-400">
            {{ yesterdayCount }} 条记录
          </p>
        </div>
      </div>
      
      <!-- 今日支出 -->
      <div class="backdrop-blur-lg bg-gradient-to-br from-emerald-500/20 to-teal-600/20 rounded-2xl border border-emerald-400/30 shadow-xl p-6">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center space-x-3">
            <div class="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
              <i class="fas fa-calendar-check text-white text-xl"></i>
            </div>
            <div>
              <h3 class="text-sm font-medium text-gray-300">今日支出</h3>
              <p class="text-xs text-gray-400">{{ todayDate }}</p>
            </div>
      </div>
    </div>
        <div v-if="loading" class="flex items-center justify-center h-20">
          <i class="fas fa-spinner fa-spin text-2xl text-gray-400"></i>
      </div>
        <div v-else class="space-y-2">
          <p class="text-3xl font-bold text-white">
            ¥{{ formatAmount(todayExpense) }}
          </p>
          <p class="text-xs text-gray-400">
            {{ todayCount }} 条记录
          </p>
                </div>
      </div>
    </div>

    <!-- 统计卡片 - 第二行：审批状态维度 -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- 已支出（已审批通过） -->
      <div 
        @click="viewStatusList('approved')"
        class="backdrop-blur-lg bg-gradient-to-br from-green-500/20 to-emerald-600/20 rounded-2xl border border-green-400/30 shadow-xl p-6 cursor-pointer hover:from-green-500/30 hover:to-emerald-600/30 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
      >
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center space-x-3">
            <div class="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
              <i class="fas fa-check-circle text-white text-xl"></i>
            </div>
            <div>
              <h3 class="text-sm font-medium text-gray-300">已支出</h3>
              <p class="text-xs text-gray-400">财务全部审批通过</p>
            </div>
          </div>
        </div>
        <div v-if="loading" class="flex items-center justify-center h-20">
          <i class="fas fa-spinner fa-spin text-2xl text-gray-400"></i>
        </div>
        <div v-else class="space-y-2">
          <p class="text-3xl font-bold text-white">
            ¥{{ formatAmount(approvedExpense) }}
          </p>
          <p class="text-xs text-gray-400">
            {{ approvedCount }} 条记录
          </p>
        </div>
      </div>

      <!-- 审批中 -->
      <div 
        @click="viewStatusList('approving')"
        class="backdrop-blur-lg bg-gradient-to-br from-yellow-500/20 to-orange-600/20 rounded-2xl border border-yellow-400/30 shadow-xl p-6 cursor-pointer hover:from-yellow-500/30 hover:to-orange-600/30 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
      >
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center space-x-3">
            <div class="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
              <i class="fas fa-clock text-white text-xl"></i>
            </div>
            <div>
              <h3 class="text-sm font-medium text-gray-300">审批中</h3>
              <p class="text-xs text-gray-400">正在审批流程中</p>
            </div>
          </div>
        </div>
        <div v-if="loading" class="flex items-center justify-center h-20">
          <i class="fas fa-spinner fa-spin text-2xl text-gray-400"></i>
        </div>
        <div v-else class="space-y-2">
          <p class="text-3xl font-bold text-white">
            ¥{{ formatAmount(approvingExpense) }}
          </p>
          <p class="text-xs text-gray-400">
            {{ approvingCount }} 条记录
          </p>
        </div>
      </div>

      <!-- 待审批 -->
      <div 
        @click="viewStatusList('pending')"
        class="backdrop-blur-lg bg-gradient-to-br from-red-500/20 to-pink-600/20 rounded-2xl border border-red-400/30 shadow-xl p-6 cursor-pointer hover:from-red-500/30 hover:to-pink-600/30 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
      >
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center space-x-3">
            <div class="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
              <i class="fas fa-hourglass-half text-white text-xl"></i>
            </div>
            <div>
              <h3 class="text-sm font-medium text-gray-300">待审批</h3>
              <p class="text-xs text-gray-400">等待审批处理</p>
            </div>
          </div>
        </div>
        <div v-if="loading" class="flex items-center justify-center h-20">
          <i class="fas fa-spinner fa-spin text-2xl text-gray-400"></i>
        </div>
        <div v-else class="space-y-2">
          <p class="text-3xl font-bold text-white">
            ¥{{ formatAmount(pendingExpense) }}
          </p>
          <p class="text-xs text-gray-400">
            {{ pendingCount }} 条记录
          </p>
        </div>
      </div>
    </div>

    <!-- 刷新按钮 -->
    <div class="flex justify-end">
      <button
        @click="refreshData"
        class="px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-xl hover:from-primary/80 hover:to-secondary/80 transition-all duration-300 flex items-center space-x-2 shadow-lg"
      >
        <i class="fas fa-sync-alt" :class="{ 'fa-spin': loading }"></i>
        <span>刷新数据</span>
      </button>
    </div>

    <!-- 订单列表模态框 -->
    <Teleport to="body">
      <div v-if="showStatusModal" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4" @click.self="closeStatusModal">
        <div class="backdrop-blur-xl bg-gradient-to-br from-white/15 to-white/5 rounded-2xl border border-white/20 shadow-2xl w-full max-w-6xl mx-4 max-h-[90vh] flex flex-col relative z-[10000]" @click.stop>
          
          <!-- 标题栏 -->
          <div class="p-6 border-b border-white/10 flex-shrink-0">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-4">
                <div class="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-xl flex items-center justify-center">
                  <i class="fas fa-list-alt text-white text-xl"></i>
                </div>
                <div>
                  <h2 class="text-2xl font-bold text-white">{{ statusModalTitle }}</h2>
                  <p class="text-gray-400 text-sm">共 {{ statusListTotal }} 条记录</p>
                </div>
              </div>
              <button 
                @click="closeStatusModal"
                class="w-10 h-10 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 rounded-xl flex items-center justify-center text-white transition-all duration-200 group border border-gray-500/30 hover:shadow-lg"
              >
                <i class="fas fa-times text-lg group-hover:rotate-90 transition-transform duration-300"></i>
              </button>
            </div>
          </div>

          <!-- 内容区域 - 可滚动 -->
          <div class="p-6 overflow-y-auto flex-1">
            <!-- 加载状态 -->
            <div v-if="statusListLoading" class="flex items-center justify-center py-12">
              <i class="fas fa-spinner fa-spin text-4xl text-gray-400"></i>
            </div>

            <!-- 数据表格 -->
            <div v-else class="overflow-x-auto">
              <table class="w-full text-left">
                <thead>
                  <tr class="border-b border-white/20">
                    <th class="px-4 py-3 text-gray-300 font-semibold text-sm">费用名称</th>
                    <th class="px-4 py-3 text-gray-300 font-semibold text-sm">申请人</th>
                    <th class="px-4 py-3 text-gray-300 font-semibold text-sm">部门</th>
                    <th class="px-4 py-3 text-gray-300 font-semibold text-sm">金额</th>
                    <th class="px-4 py-3 text-gray-300 font-semibold text-sm">日期</th>
                    <th class="px-4 py-3 text-gray-300 font-semibold text-sm">状态</th>
                    <th class="px-4 py-3 text-gray-300 font-semibold text-sm text-center">操作</th>
                  </tr>
                </thead>
                <tbody>
                  <tr 
                    v-for="item in statusListData" 
                    :key="item.id"
                    class="border-b border-white/10 hover:bg-white/5 transition-colors"
                  >
                    <td class="px-4 py-3 text-white">{{ item.name }}</td>
                    <td class="px-4 py-3 text-gray-300">
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
                    <td class="px-4 py-3 text-center">
                      <button
                        @click="viewExpenseDetail(item)"
                        class="px-3 py-1.5 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition-colors text-sm font-semibold"
                        title="查看详情"
                      >
                        <i class="fas fa-eye mr-1"></i>
                        查看
                      </button>
                    </td>
                  </tr>
                  <tr v-if="statusListData.length === 0">
                    <td colspan="7" class="px-4 py-8 text-center text-gray-400">
                      <i class="fas fa-inbox text-2xl mb-2"></i>
                      <p>暂无数据</p>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- 分页 -->
            <div v-if="statusListTotal > 0 && !statusListLoading" class="mt-6 flex justify-center items-center space-x-4">
              <button 
                @click="changeStatusPage(statusListPage - 1)"
                :disabled="statusListPage <= 1"
                class="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <i class="fas fa-chevron-left mr-2"></i>上一页
              </button>
              <span class="text-gray-300">
                第 {{ statusListPage }} / {{ statusListTotalPages }} 页，共 {{ statusListTotal }} 条
              </span>
              <button 
                @click="changeStatusPage(statusListPage + 1)"
                :disabled="statusListPage >= statusListTotalPages"
                class="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                下一页<i class="fas fa-chevron-right ml-2"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- 费用详情模态框 -->
    <Teleport to="body">
      <div v-if="showExpenseDetailModal" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[10001] p-4" @click.self="closeExpenseDetailModal">
        <div class="backdrop-blur-xl bg-gradient-to-br from-white/15 to-white/5 rounded-2xl border border-white/20 shadow-2xl w-full max-w-4xl mx-4 max-h-[80vh] flex flex-col relative z-[10002]" @click.stop>
          
          <!-- 标题栏 -->
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
                @click="closeExpenseDetailModal"
                class="w-10 h-10 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 rounded-xl flex items-center justify-center text-white transition-all duration-200 group border border-gray-500/30 hover:shadow-lg"
              >
                <i class="fas fa-times text-lg group-hover:rotate-90 transition-transform duration-300"></i>
              </button>
            </div>
          </div>

          <!-- 内容区域 - 可滚动 -->
          <div class="p-6 overflow-y-auto flex-1">
            <div v-if="viewingExpenseDetail" class="bg-white/5 rounded-xl p-4 border border-white/10">
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div class="space-y-4">
                  <div class="flex items-start justify-between py-3 border-b border-white/10">
                    <label class="text-sm font-medium text-gray-400">费用名称</label>
                    <div class="text-white font-medium text-right">{{ viewingExpenseDetail.name || '-' }}</div>
                  </div>
                  <div class="flex items-start justify-between py-3 border-b border-white/10">
                    <label class="text-sm font-medium text-gray-400">金额</label>
                    <div class="text-emerald-300 font-bold text-xl">¥{{ formatAmount(viewingExpenseDetail.amount) }}</div>
                  </div>
                  <div class="flex items-start justify-between py-3 border-b border-white/10">
                    <label class="text-sm font-medium text-gray-400">日期</label>
                    <div class="text-white font-medium">{{ formatDate(viewingExpenseDetail.date || viewingExpenseDetail.expense_date) }}</div>
                  </div>
                  <div class="flex items-start justify-between py-3">
                    <label class="text-sm font-medium text-gray-400">状态</label>
                    <span :class="getStatusClass(viewingExpenseDetail.status)">
                      {{ getStatusText(viewingExpenseDetail.status) }}
                    </span>
                  </div>
                </div>
                <div class="space-y-4">
                  <div class="flex items-start justify-between py-3 border-b border-white/10">
                    <label class="text-sm font-medium text-gray-400">申请人</label>
                    <div class="text-white font-medium text-right">
                      {{ viewingExpenseDetail.applicant_info?.name || viewingExpenseDetail.applicant_name || '-' }}
                    </div>
                  </div>
                  <div class="flex items-start justify-between py-3 border-b border-white/10">
                    <label class="text-sm font-medium text-gray-400">部门</label>
                    <div class="text-gray-300 font-medium text-right">
                      {{ viewingExpenseDetail.applicant_info?.department || '-' }}
                    </div>
                  </div>
                  <div class="flex items-start justify-between py-3 border-b border-white/10">
                    <label class="text-sm font-medium text-gray-400">创建时间</label>
                    <div class="text-gray-300 text-sm text-right">
                      {{ formatDateTime(viewingExpenseDetail.created_at) }}
                    </div>
                  </div>
                </div>
              </div>
              <div v-if="viewingExpenseDetail.description" class="mt-6 pt-6 border-t border-white/10">
                <label class="block text-sm font-medium text-gray-400 mb-3">描述</label>
                <div class="text-gray-300 leading-relaxed">{{ viewingExpenseDetail.description }}</div>
              </div>
            </div>
            
            <!-- 审批记录 -->
            <div class="mt-8">
              <div class="flex items-center mb-6">
                <div class="w-8 h-8 bg-gradient-to-r from-success to-success-light rounded-lg flex items-center justify-center mr-3">
                  <i class="fas fa-route text-white text-sm"></i>
                </div>
                <h3 class="text-xl font-semibold text-white">审批记录</h3>
              </div>
              
              <div class="bg-white/5 rounded-xl p-6 border border-white/10 backdrop-blur-sm">
                <div v-if="loadingApprovalNodes" class="flex items-center justify-center py-6">
                  <i class="fas fa-spinner fa-spin text-2xl text-gray-400"></i>
                </div>
                <div v-else-if="approvalNodes.length > 0" class="space-y-1">
                  <div v-for="(node, index) in approvalNodes" :key="index" 
                       class="flex items-start justify-between py-4 border-b border-white/10 last:border-b-0 hover:bg-white/5 transition-all duration-200 px-3">
                    <div class="flex items-start space-x-4 flex-1">
                      <div class="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" :class="getApprovalNodeStatusClass(node.status)">
                        <i :class="getApprovalNodeIcon(node.status)" class="text-white text-sm"></i>
                      </div>
                      <div class="flex-1 min-w-0">
                        <div class="flex items-center space-x-3 mb-1">
                          <div class="text-white font-medium text-sm">{{ node.nodeName || node.node_name || '审批节点' }}</div>
                          <div class="font-medium text-xs px-2 py-0.5 rounded" :class="getApprovalNodeTextColor(node.status)">
                            <span v-if="node.status === 'pending'">待审批</span>
                            <span v-else-if="node.status === 'approving'">审批中</span>
                            <span v-else-if="node.status === 'approved'">已通过</span>
                            <span v-else-if="node.status === 'rejected'">已拒绝</span>
                            <span v-else-if="node.status === 'auto_approved'">自动审批</span>
                            <span v-else-if="node.is_current_node">审批中……</span>
                            <span v-else>待审批</span>
                          </div>
                        </div>
                        <div class="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-gray-400 mb-2">
                          <div class="flex items-center space-x-1">
                            <i class="fas fa-user text-gray-500"></i>
                            <span class="font-medium text-gray-300">审批人：</span>
                            <span class="text-white font-semibold">
                              {{ 
                                node.user_info?.name || 
                                node.user_info?.username || 
                                node.userName || 
                                node.user_name || 
                                node.approver_name || 
                                (node.user_id ? `用户ID: ${node.user_id}` : '未指定') 
                              }}
                            </span>
                          </div>
                          <div class="flex items-center space-x-1">
                            <i class="fas fa-clock text-gray-500"></i>
                            <span class="font-medium text-gray-300">审批时间：</span>
                            <span class="text-white">{{ formatDateTime(node.createdAt || node.create_time || node.createTime || node.approvedAt || node.approved_at || node.approval_start_time || node.approval_end_time || node.updatedAt || node.update_time || node.updateTime) }}</span>
                          </div>
                        </div>
                        <div v-if="node.comment" class="mt-2 p-2 bg-white/5 rounded-lg border border-white/10">
                          <div class="flex items-start space-x-2">
                            <i class="fas fa-comment text-gray-400 text-xs mt-0.5"></i>
                            <div class="text-gray-300 text-xs leading-relaxed flex-1">{{ node.comment }}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div v-else class="text-gray-400 text-center py-6">
                  <div class="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-2 border border-white/10">
                    <i class="fas fa-clipboard-list text-xl"></i>
                  </div>
                  <p class="text-sm">暂无审批记录</p>
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
import { ref, onMounted, watch, computed } from 'vue'
import { getUserExpenseTotal } from '@/api/expenseStatistics'
import { expenseApplicationsAPI } from '@/api/expenseApplications'
import { useUserStore } from '@/stores/user'

const props = defineProps({
  startDate: {
    type: String,
    default: ''
  },
  endDate: {
    type: String,
    default: ''
  },
  userName: {
    type: String,
    default: ''
  },
  mainCategory: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['error', 'loading'])

const userStore = useUserStore()

// 检查用户是否有全部数据权限（可以查看所有用户的数据）
const hasAllDataPermission = computed(() => {
  return userStore.hasAllDataPermission()
})

const loading = ref(false)
const chartError = ref('')

// 统计数据 - 时间维度
const totalExpense = ref(0)
const totalCount = ref(0)
const yesterdayExpense = ref(0)
const yesterdayCount = ref(0)
const todayExpense = ref(0)
const todayCount = ref(0)

// 统计数据 - 审批状态维度
const approvedExpense = ref(0)
const approvedCount = ref(0)
const approvingExpense = ref(0)
const approvingCount = ref(0)
const pendingExpense = ref(0)
const pendingCount = ref(0)

// 日期格式化
const todayDate = ref('')
const yesterdayDate = ref('')

// 状态列表模态框相关
const showStatusModal = ref(false)
const currentStatus = ref('')
const statusListData = ref([])
const statusListLoading = ref(false)
const statusListPage = ref(1)
const statusListPageSize = ref(20)
const statusListTotal = ref(0)
const statusListTotalPages = ref(0)

// 费用详情模态框
const showExpenseDetailModal = ref(false)
const viewingExpenseDetail = ref(null)
const approvalNodes = ref([]) // 审批节点数据
const loadingApprovalNodes = ref(false) // 加载审批节点状态

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


// 获取日期字符串
const getDateString = (date) => {
  return date.toISOString().split('T')[0]
}

// 加载数据
const loadData = async () => {
  loading.value = true
  chartError.value = ''
  emit('loading', true)
  
  try {
    // 计算日期
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    
    todayDate.value = today.toLocaleDateString('zh-CN', { month: 'long', day: 'numeric' })
    yesterdayDate.value = yesterday.toLocaleDateString('zh-CN', { month: 'long', day: 'numeric' })
    
    // 获取总支出（使用传入的日期范围，如果没有则使用最近一年）
    let startDate = props.startDate
    let endDate = props.endDate
    const oneYearAgo = new Date()
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1)
    
    if (!startDate || !endDate) {
      startDate = startDate || getDateString(oneYearAgo)
      endDate = endDate || getDateString(today)
    }
    
    // 获取总支出
    const totalParams = {
      startDate: startDate,
      endDate: endDate
    }
    
    if (props.userName) {
      totalParams.userName = props.userName
    }
    
    if (props.mainCategory) {
      totalParams.mainCategory = props.mainCategory
    }
    
    // 获取昨日支出
    const yesterdayParams = {
      startDate: getDateString(yesterday),
      endDate: getDateString(yesterday)
    }
    
    if (props.userName) {
      yesterdayParams.userName = props.userName
    }
    
    if (props.mainCategory) {
      yesterdayParams.mainCategory = props.mainCategory
    }
    
    // 获取今日支出
    const todayParams = {
      startDate: getDateString(today),
      endDate: getDateString(today)
    }
    
    if (props.userName) {
      todayParams.userName = props.userName
    }
    
    if (props.mainCategory) {
      todayParams.mainCategory = props.mainCategory
    }
    
    // 并行请求所有数据
    const [totalRes, yesterdayRes, todayRes] = await Promise.all([
      getUserExpenseTotal(totalParams),
      getUserExpenseTotal(yesterdayParams),
      getUserExpenseTotal(todayParams)
    ])
    
    // 计算总支出
    if (totalRes.success) {
      const totalData = totalRes.data || []
      totalExpense.value = totalData.reduce((sum, item) => {
        return sum + parseFloat(item.total_amount || item.totalAmount || item.amount || 0)
      }, 0)
      totalCount.value = totalData.reduce((sum, item) => {
        return sum + parseInt(item.application_count || item.applicationCount || 0)
      }, 0)
    }
    
    // 计算昨日支出
    if (yesterdayRes.success) {
      const yesterdayData = yesterdayRes.data || []
      yesterdayExpense.value = yesterdayData.reduce((sum, item) => {
        return sum + parseFloat(item.total_amount || item.totalAmount || item.amount || 0)
      }, 0)
      yesterdayCount.value = yesterdayData.reduce((sum, item) => {
        return sum + parseInt(item.application_count || item.applicationCount || 0)
      }, 0)
    }
    
    // 计算今日支出
    if (todayRes.success) {
      const todayData = todayRes.data || []
      todayExpense.value = todayData.reduce((sum, item) => {
        return sum + parseFloat(item.total_amount || item.totalAmount || item.amount || 0)
      }, 0)
      todayCount.value = todayData.reduce((sum, item) => {
        return sum + parseInt(item.application_count || item.applicationCount || 0)
      }, 0)
    }
    
    // 获取审批状态统计数据
    // 如果没有设置日期范围，使用最近一年
    const statusStartDate = props.startDate || getDateString(oneYearAgo)
    const statusEndDate = props.endDate || getDateString(today)
    
    // 根据用户权限选择API：如果有全部数据权限，使用getAllExpenseApplicationsList获取所有用户的数据
    // 否则使用getExpenseApplicationsList只获取当前用户的数据
    const apiMethod = hasAllDataPermission.value 
      ? expenseApplicationsAPI.getAllExpenseApplicationsList 
      : expenseApplicationsAPI.getExpenseApplicationsList
    
    // 并行请求不同状态的费用申请
    const [approvedRes, approvingRes, pendingRes] = await Promise.all([
      apiMethod({
        status: 'approved',
        start_date: statusStartDate,
        end_date: statusEndDate,
        page: 1,
        pageSize: 10000 // 获取所有数据用于统计
      }),
      apiMethod({
        status: 'approving',
        start_date: statusStartDate,
        end_date: statusEndDate,
        page: 1,
        pageSize: 10000
      }),
      apiMethod({
        status: 'pending',
        start_date: statusStartDate,
        end_date: statusEndDate,
        page: 1,
        pageSize: 10000
      })
    ])
    
    // 计算已支出（已审批通过）
    if (approvedRes.success) {
      const approvedData = approvedRes.data || []
      approvedExpense.value = approvedData.reduce((sum, item) => {
        return sum + parseFloat(item.amount || 0)
      }, 0)
      approvedCount.value = approvedRes.pagination?.total || approvedData.length
    }
    
    // 计算审批中
    if (approvingRes.success) {
      const approvingData = approvingRes.data || []
      approvingExpense.value = approvingData.reduce((sum, item) => {
        return sum + parseFloat(item.amount || 0)
      }, 0)
      approvingCount.value = approvingRes.pagination?.total || approvingData.length
    }
    
    // 计算待审批
    if (pendingRes.success) {
      const pendingData = pendingRes.data || []
      pendingExpense.value = pendingData.reduce((sum, item) => {
        return sum + parseFloat(item.amount || 0)
      }, 0)
      pendingCount.value = pendingRes.pagination?.total || pendingData.length
    }
    
  } catch (error) {
    console.error('费用统计查询失败:', error)
    chartError.value = error.message || '查询失败'
    emit('error', chartError.value)
  } finally {
    loading.value = false
    emit('loading', false)
  }
}

// 刷新数据
const refreshData = () => {
  loadData()
}

// 获取状态标题
const getStatusTitle = (status) => {
  const titles = {
    approved: '已支出订单列表',
    approving: '审批中订单列表',
    pending: '待审批订单列表'
  }
  return titles[status] || '订单列表'
}

// 计算状态模态框标题
const statusModalTitle = computed(() => {
  return getStatusTitle(currentStatus.value)
})

// 查看状态列表
const viewStatusList = (status) => {
  currentStatus.value = status
  statusListPage.value = 1
  showStatusModal.value = true
  loadStatusList()
}

// 加载状态列表数据
const loadStatusList = async () => {
  if (!currentStatus.value) return
  
  statusListLoading.value = true
  
  try {
    // 计算日期范围
    const today = new Date()
    const oneYearAgo = new Date()
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1)
    
    const statusStartDate = props.startDate || getDateString(oneYearAgo)
    const statusEndDate = props.endDate || getDateString(today)
    
    // 根据用户权限选择API
    const apiMethod = hasAllDataPermission.value 
      ? expenseApplicationsAPI.getAllExpenseApplicationsList 
      : expenseApplicationsAPI.getExpenseApplicationsList
    
    const response = await apiMethod({
      status: currentStatus.value,
      start_date: statusStartDate,
      end_date: statusEndDate,
      page: statusListPage.value,
      pageSize: statusListPageSize.value
    })
    
    if (response.success) {
      statusListData.value = response.data || []
      statusListTotal.value = response.pagination?.total || 0
      statusListTotalPages.value = response.pagination?.totalPages || Math.ceil(statusListTotal.value / statusListPageSize.value)
    } else {
      statusListData.value = []
      statusListTotal.value = 0
      statusListTotalPages.value = 0
    }
  } catch (error) {
    console.error('加载状态列表失败:', error)
    statusListData.value = []
    statusListTotal.value = 0
    statusListTotalPages.value = 0
  } finally {
    statusListLoading.value = false
  }
}

// 切换状态列表页码
const changeStatusPage = (page) => {
  if (page >= 1 && page <= statusListTotalPages.value) {
    statusListPage.value = page
    loadStatusList()
  }
}

// 关闭状态列表模态框
const closeStatusModal = () => {
  showStatusModal.value = false
  currentStatus.value = ''
  statusListData.value = []
  statusListPage.value = 1
}

// 查看费用详情
const viewExpenseDetail = async (item) => {
  try {
    // 先显示基本信息
    viewingExpenseDetail.value = { ...item }
    showExpenseDetailModal.value = true
    approvalNodes.value = [] // 重置审批节点
    
    // 尝试获取完整详情
    try {
      const detailResponse = await expenseApplicationsAPI.getExpenseApplicationDetail(item.id)
      if (detailResponse.success && detailResponse.data) {
        viewingExpenseDetail.value = {
          ...detailResponse.data,
          ...item // 保留列表中的信息
        }
      }
    } catch (error) {
      console.error('加载费用详情失败:', error)
      // 如果失败，使用列表数据
    }
    
    // 获取审批节点信息
    try {
      loadingApprovalNodes.value = true
      console.log('开始获取审批节点信息，费用ID:', item.id)
      const nodesResponse = await expenseApplicationsAPI.getExpenseApplicationApprovalNodes(item.id)
      console.log('审批节点API响应:', nodesResponse)
      
      if (nodesResponse.success) {
        approvalNodes.value = nodesResponse.data || []
        console.log('审批节点数据:', approvalNodes.value)
        
        // 打印每个节点的详细信息
        if (approvalNodes.value.length > 0) {
          approvalNodes.value.forEach((node, index) => {
            console.log(`审批节点 ${index + 1}:`, {
              nodeName: node.nodeName || node.node_name,
              status: node.status,
              user_id: node.user_id,
              user_info: node.user_info,
              user_info_name: node.user_info?.name,
              user_info_username: node.user_info?.username
            })
          })
        }
      } else {
        console.warn('获取审批节点信息失败:', nodesResponse.message)
        approvalNodes.value = []
      }
    } catch (nodesError) {
      console.error('获取审批节点信息错误:', nodesError)
      approvalNodes.value = []
    } finally {
      loadingApprovalNodes.value = false
    }
  } catch (error) {
    console.error('查看费用详情错误:', error)
  }
}

// 关闭费用详情模态框
const closeExpenseDetailModal = () => {
  showExpenseDetailModal.value = false
  viewingExpenseDetail.value = null
  approvalNodes.value = []
  loadingApprovalNodes.value = false
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

// 格式化日期
const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('zh-CN')
}

// 格式化日期时间
const formatDateTime = (dateStr) => {
  if (!dateStr) return '-'
  try {
    const date = new Date(dateStr)
    if (isNaN(date.getTime())) return dateStr
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    const seconds = String(date.getSeconds()).padStart(2, '0')
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
  } catch (error) {
    return dateStr
  }
}

// 获取审批节点状态文本颜色
const getApprovalNodeTextColor = (status) => {
  const colorMap = {
    pending: 'text-yellow-300',
    approving: 'text-blue-300',
    approved: 'text-green-300',
    rejected: 'text-red-300',
    auto_approved: 'text-purple-300'
  }
  return colorMap[status] || 'text-gray-300'
}

// 获取审批节点状态样式
const getApprovalNodeStatusClass = (status) => {
  const statusMap = {
    pending: 'bg-gradient-to-r from-yellow-400/80 to-orange-400/80',
    approving: 'bg-gradient-to-r from-blue-500/80 to-cyan-500/80',
    approved: 'bg-gradient-to-r from-emerald-500/80 to-green-500/80',
    rejected: 'bg-gradient-to-r from-red-500/80 to-rose-500/80',
    auto_approved: 'bg-gradient-to-r from-purple-500/80 to-indigo-500/80'
  }
  return statusMap[status] || 'bg-gradient-to-r from-gray-500/80 to-gray-600/80'
}

// 获取审批节点图标
const getApprovalNodeIcon = (status) => {
  const iconMap = {
    pending: 'fas fa-clock',
    approving: 'fas fa-spinner',
    approved: 'fas fa-check',
    rejected: 'fas fa-times',
    auto_approved: 'fas fa-robot'
  }
  return iconMap[status] || 'fas fa-question'
}


// 监听参数变化
watch([() => props.startDate, () => props.endDate, () => props.userName, () => props.mainCategory], () => {
  loadData()
})

onMounted(() => {
  loadData()
})

// 暴露方法
defineExpose({
  refreshData
})
</script>

<style scoped>
</style>