<!-- 费用概览统计组件 -->
<template>
  <div class="space-y-6">
    <!-- 图表显示 -->
    <div class="backdrop-blur-lg bg-white/10 rounded-2xl border border-white/20 shadow-xl p-6 transition-all duration-300 hover:shadow-2xl hover:bg-white/15 hover:translate-y-[-2px]">
      <div class="flex flex-col gap-4 mb-4">
        <div class="flex items-center justify-between flex-wrap gap-3">
        <h3 class="text-xl font-bold text-white flex items-center">
          <i class="fas fa-chart-line mr-3 text-primary"></i>
          费用概览统计
        </h3>
        <div class="flex space-x-2">
          <button
            @click="refreshData"
            :disabled="loading"
            class="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all duration-300 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <i class="fas fa-sync-alt" :class="{ 'fa-spin': loading }"></i>
            <span>刷新</span>
          </button>
          <button
            @click="exportData"
            :disabled="viewMode === 'records' ? recordsList.length === 0 : tableData.length === 0"
            class="px-4 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-400/30 rounded-lg transition-all duration-300 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <i class="fas fa-download"></i>
            <span>导出</span>
          </button>
        </div>
        </div>

        <!-- 查看维度 -->
        <div class="flex flex-wrap items-center gap-3">
          <div class="flex space-x-1 bg-white/5 rounded-xl p-1">
            <button
              v-for="tab in viewModeTabs"
              :key="tab.value"
              type="button"
              @click="switchViewMode(tab.value)"
              :class="[
                'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300',
                viewMode === tab.value
                  ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-white/10'
              ]"
            >
              <i :class="tab.icon" class="mr-1.5"></i>{{ tab.label }}
            </button>
          </div>

          <!-- 部门树筛选（与部门管理一致，含多级） -->
          <div class="flex flex-wrap items-center gap-2 min-w-[220px]">
            <span class="text-xs text-gray-400 shrink-0">
              <i class="fas fa-sitemap mr-1"></i>部门
            </span>
            <select
              v-model="selectedDepartmentId"
              @change="onDepartmentChange"
              :disabled="departmentsLoading"
              class="min-w-[200px] max-w-[320px] px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary appearance-none"
            >
              <option value="" class="bg-slate-800">全部顶级部门</option>
              <option
                v-for="opt in flatDepartmentOptions"
                :key="opt.id"
                :value="opt.id"
                class="bg-slate-800"
              >{{ opt.label }}</option>
            </select>
          </div>

          <!-- 角色筛选 -->
          <div v-if="viewMode === 'role' || viewMode === 'records'" class="flex items-center gap-2 flex-wrap">
            <span class="text-xs text-gray-400">角色：</span>
            <button
              v-for="opt in roleScopeOptions"
              :key="opt.value"
              type="button"
              @click="roleScope = opt.value; recordsPage = 1; loadData()"
              :class="scopeBtnClass(roleScope === opt.value)"
            >{{ opt.label }}</button>
          </div>

          <!-- 申请记录关键词 -->
          <div v-if="viewMode === 'records'" class="flex items-center gap-2">
            <input
              v-model="recordsKeyword"
              type="text"
              placeholder="搜索费用名称/申请人"
              class="px-3 py-1.5 bg-white/10 border border-white/20 rounded-lg text-white text-sm min-w-[160px]"
              @keyup.enter="recordsPage = 1; loadData()"
            />
          </div>
        </div>
      </div>
      
      <div v-if="viewMode !== 'records'" class="chart-container-wrapper">
         <div v-if="loading" class="flex items-center justify-center h-96 text-gray-400">
        <div class="text-center space-y-4">
          <div class="inline-block p-3 rounded-full bg-white/5 animate-pulse">
            <i class="fas fa-spinner fa-spin text-4xl"></i>
          </div>
          <p>图表加载中...</p>
        </div>
      </div>
      
      <div v-if="chartError" class="flex items-center justify-center h-96 text-red-400">
        <div class="text-center space-y-4">
          <div class="inline-block p-3 rounded-full bg-red-500/10">
            <i class="fas fa-exclamation-triangle text-4xl"></i>
          </div>
          <p>{{ chartError }}</p>
          <button
            @click="refreshData"
            class="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-400/30 rounded-lg transition-all duration-300"
          >
            重试
          </button>
        </div>
      </div>
      
      <div v-if="!hasChartItems" class="flex items-center justify-center h-96 text-gray-400">
        <div class="text-center space-y-4">
          <div class="inline-block p-3 rounded-full bg-white/5">
            <i class="fas fa-inbox text-4xl opacity-50"></i>
          </div>
          <p class="text-lg">暂无数据</p>
          <p class="text-sm text-gray-500">请调整查询条件后重试</p>
        </div>
      </div>
        <div v-if="!loading" ref="chartRef" class="chart-container">
         
        </div>
      </div>
    </div>
    
    <!-- 申请记录列表 -->
    <div
      v-if="viewMode === 'records'"
      class="backdrop-blur-lg bg-white/10 rounded-2xl border border-white/20 shadow-xl p-6"
    >
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold text-white">申请记录</h3>
        <span class="text-sm text-gray-400">共 {{ recordsTotal }} 条</span>
      </div>
      <div class="overflow-x-auto data-table-wrapper">
        <table class="w-full text-sm text-left">
          <thead class="text-xs text-gray-400 uppercase bg-white/5">
            <tr>
              <th class="px-4 py-3 text-gray-300">费用名称</th>
              <th class="px-4 py-3 text-gray-300">申请人</th>
              <th class="px-4 py-3 text-gray-300">部门</th>
              <th class="px-4 py-3 text-gray-300">角色</th>
              <th class="px-4 py-3 text-gray-300">金额</th>
              <th class="px-4 py-3 text-gray-300">日期</th>
              <th class="px-4 py-3 text-gray-300">状态</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="row in recordsList"
              :key="row.id"
              class="border-b border-white/10 hover:bg-white/5"
            >
              <td class="px-4 py-3 text-white">{{ row.name }}</td>
              <td class="px-4 py-3 text-white">{{ row.applicant_display }}</td>
              <td class="px-4 py-3 text-gray-400">{{ row.department_name }}</td>
              <td class="px-4 py-3 text-gray-400">{{ row.role_bucket || row.role_name }}</td>
              <td class="px-4 py-3 text-emerald-300 font-semibold">{{ formatAmount(row.amount) }}</td>
              <td class="px-4 py-3 text-gray-400">{{ row.date }}</td>
              <td class="px-4 py-3">
                <span class="px-2 py-1 rounded text-xs bg-white/10 text-gray-300">{{ statusLabel(row.status) }}</span>
              </td>
            </tr>
            <tr v-if="recordsList.length === 0 && !loading">
              <td colspan="7" class="px-6 py-8 text-center text-gray-400">暂无申请记录</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-if="recordsTotal > recordsPageSize" class="flex justify-center gap-2 mt-4">
        <button
          type="button"
          :disabled="recordsPage <= 1"
          class="px-3 py-1.5 rounded-lg bg-white/10 text-white text-sm disabled:opacity-40"
          @click="recordsPage--; loadData()"
        >上一页</button>
        <span class="text-gray-400 text-sm py-1.5">{{ recordsPage }} / {{ recordsTotalPages }}</span>
        <button
          type="button"
          :disabled="recordsPage >= recordsTotalPages"
          class="px-3 py-1.5 rounded-lg bg-white/10 text-white text-sm disabled:opacity-40"
          @click="recordsPage++; loadData()"
        >下一页</button>
      </div>
    </div>

    <!-- 统计汇总列表 -->
    <div
      v-else
      class="backdrop-blur-lg bg-white/10 rounded-2xl border border-white/20 shadow-xl p-6 transition-all duration-300 hover:shadow-2xl hover:bg-white/15 hover:translate-y-[-2px]"
    >
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold text-white">{{ summaryTableTitle }}</h3>
        <span class="text-sm text-gray-400">共 {{ total }} 条记录</span>
      </div>
      
      <div class="overflow-x-auto data-table-wrapper">
        <table class="w-full text-sm text-left">
          <thead class="text-xs text-gray-400 uppercase bg-white/5">
            <tr>
              <th scope="col" class="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">类型</th>
              <th scope="col" class="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">名称</th>
              <th scope="col" class="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">总金额</th>
              <th scope="col" class="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">申请数量</th>
              <th scope="col" class="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">占比</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in tableData" :key="item.id" class="border-b border-white/10 hover:bg-white/5 transition-colors duration-200">
              <td class="px-6 py-4">
                <span :class="[
                  'px-3 py-1.5 rounded-full text-xs font-medium backdrop-blur-sm',
                  item.statType === '角色'
                    ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-300 border border-amber-400/30'
                    : item.statType === '部门' 
                    ? 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-300 border border-blue-400/30'
                    : 'bg-gradient-to-r from-purple-500/20 to-purple-600/20 text-purple-300 border border-purple-400/30'
                ]">
                  <i :class="[
                    'mr-1',
                    item.statType === '角色' ? 'fas fa-user-tag text-amber-400' : item.statType === '部门' ? 'fas fa-building text-blue-400' : 'fas fa-tag text-purple-400'
                  ]"></i>
                  {{ item.statType }}
                </span>
              </td>
              <td class="px-6 py-4">
                <span class="text-white font-semibold text-sm">
                  {{ item.name }}
                </span>
              </td>
              <td class="px-6 py-4">
                <span class="px-3 py-1.5 bg-gradient-to-r from-emerald-500/20 to-green-500/20 text-emerald-300 border border-emerald-400/30 rounded-full text-sm font-bold backdrop-blur-sm">
                  {{ formatAmount(item.totalAmount) }}
                </span>
              </td>
              <td class="px-6 py-4 text-gray-400">
                {{ item.applicationCount }}
              </td>
              <td class="px-6 py-4">
                <span class="px-3 py-1.5 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-300 border border-blue-400/30 rounded-full text-xs font-medium backdrop-blur-sm">
                  {{ item.percentage }}%
                </span>
              </td>
            </tr>
            <tr v-if="tableData.length === 0">
              <td colspan="5" class="px-6 py-8 text-center text-gray-400">
                <div class="flex flex-col items-center justify-center space-y-4">
                  <i class="fas fa-inbox text-4xl text-gray-500 opacity-50"></i>
                  <p class="text-lg">暂无数据</p>
                  <p class="text-sm text-gray-500">请调整查询条件后重试</p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import * as echarts from 'echarts'
import { getExpenseOverview } from '@/api/expenseStatistics'
import { getDepartmentTree } from '@/api/department'
import { ElMessage } from 'element-plus'

const viewModeTabs = [
  { label: '部门', value: 'department', icon: 'fas fa-building' },
  { label: '角色', value: 'role', icon: 'fas fa-user-tag' },
  { label: '申请记录', value: 'records', icon: 'fas fa-list-alt' }
]

const roleScopeOptions = [
  { label: '全部', value: 'all' },
  { label: '总监', value: '总监' },
  { label: '管理员', value: '管理员' },
  { label: '组员', value: '组员' }
]

const viewMode = ref('department')
const selectedDepartmentId = ref('')
const departmentTree = ref([])
const departmentsLoading = ref(false)
const flatDepartmentOptions = ref([])
const roleScope = ref('all')
const recordsKeyword = ref('')
const recordsPage = ref(1)
const recordsPageSize = ref(20)
const recordsList = ref([])
const recordsTotal = ref(0)

const recordsTotalPages = computed(() =>
  Math.max(1, Math.ceil(recordsTotal.value / recordsPageSize.value))
)

const selectedDeptName = computed(() => {
  if (!selectedDepartmentId.value) return ''
  const opt = flatDepartmentOptions.value.find((o) => o.id === selectedDepartmentId.value)
  return opt?.name || ''
})

const summaryTableTitle = computed(() => {
  if (viewMode.value === 'role') {
    return selectedDeptName.value
      ? `角色费用汇总 · ${selectedDeptName.value}（含下级）`
      : '角色费用汇总'
  }
  if (!selectedDepartmentId.value) return '顶级部门费用汇总'
  return `${selectedDeptName.value} · 下级团队/小组明细`
})

const flattenDepartmentTree = (nodes, depth = 0) => {
  const result = []
  ;(nodes || []).forEach((node) => {
    const name = node.department_name || node.name || '未命名'
    const prefix = depth > 0 ? `${'　'.repeat(depth)}└ ` : ''
    result.push({ id: node.id, name, label: `${prefix}${name}`, depth })
    if (node.children?.length) {
      result.push(...flattenDepartmentTree(node.children, depth + 1))
    }
  })
  return result
}

const loadDepartmentTree = async () => {
  departmentsLoading.value = true
  try {
    const res = await getDepartmentTree()
    if (res.success) {
      departmentTree.value = res.data || []
      flatDepartmentOptions.value = flattenDepartmentTree(departmentTree.value)
    }
  } catch (e) {
    console.error('加载部门树失败:', e)
  } finally {
    departmentsLoading.value = false
  }
}

const onDepartmentChange = () => {
  recordsPage.value = 1
  loadData()
}

const hasChartItems = computed(() => {
  if (viewMode.value === 'records') return true
  return tableData.value.length > 0
})

const scopeBtnClass = (active) =>
  active
    ? 'px-3 py-1.5 rounded-lg text-sm bg-primary/30 text-white border border-primary/40'
    : 'px-3 py-1.5 rounded-lg text-sm bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10'

const statusLabel = (status) => {
  const map = {
    pending: '待审批',
    approving: '审批中',
    approved: '已通过',
    rejected: '已拒绝',
    cancelled: '已取消'
  }
  return map[status] || status || '-'
}

const switchViewMode = (mode) => {
  viewMode.value = mode
  recordsPage.value = 1
  loadData()
}

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

const loading = ref(false)
const chartError = ref('')
const chartRef = ref(null)
let chartInstance = null

const chartData = ref([])
const tableData = ref([])
const total = ref(0)

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

// 初始化图表
const initChart = async () => {
  console.log('initChart chartRef.value:', chartRef.value)
  
  // 检查主容器是否可用
  if (!chartRef.value) {
    console.warn('图表容器未找到，尝试等待DOM更新后重试')
    await nextTick()
    
    // 再次检查容器
    if (!chartRef.value) {
      console.warn('重试后仍未找到图表容器')
      chartError.value = '图表容器初始化失败'
      emit('error', chartError.value)
      return false
    }
  }
  
  // 确保容器有足够的尺寸
  if (chartRef.value.offsetWidth === 0 || chartRef.value.offsetHeight === 0) {
    console.warn('图表容器尺寸为0，等待100ms后重试')
    await new Promise(resolve => setTimeout(resolve, 100))
    
    if (chartRef.value.offsetWidth === 0 || chartRef.value.offsetHeight === 0) {
      console.warn('重试后图表容器尺寸仍为0')
      return false
    }
  }
  
  if (chartInstance) {
    chartInstance.dispose()
    chartInstance = null
  }
  
  try {
    chartInstance = echarts.init(chartRef.value)
    
    // 设置最小尺寸
    const container = chartRef.value
    const minHeight = 400
    if (container.offsetHeight < minHeight) {
      container.style.height = `${minHeight}px`
      chartInstance.resize()
    }
    
    console.log('图表初始化成功')
    return true
  } catch (error) {
    console.error('图表初始化失败:', error)
    chartError.value = '图表初始化失败'
    emit('error', chartError.value)
    return false
  }
}

const mapStatItems = (items, defaultType = '部门') =>
  (items || []).map((item, index) => ({
    name: item.name || item.department_name || item.category_name || `项${index + 1}`,
    amount: parseFloat(item.total_amount || item.amount || 0),
    type: item.stat_type || defaultType,
    applicationCount: parseInt(item.application_count || item.applicationCount || 0, 10),
    percentage: parseFloat(item.percentage || 0)
  }))

// 获取图表配置
const getChartOption = (data) => {
  let overviewData = []

  if (data && typeof data === 'object' && !Array.isArray(data)) {
    const primary =
      data.items ||
      (viewMode.value === 'role' ? data.role : null) ||
      data.department ||
      data.departments ||
      []
    overviewData = mapStatItems(primary, viewMode.value === 'role' ? '角色' : '部门')
      .sort((a, b) => b.amount - a.amount)
  } else if (Array.isArray(data)) {
    overviewData = mapStatItems(data).sort((a, b) => b.amount - a.amount)
  }
  
  // 准备图表数据
  const chartData = overviewData.map(item => item.amount)
  const chartNames = overviewData.map(item => item.name)
  
  // 为不同类型设置不同的渐变色
  const getGradientColor = (index, type) => {
    const gradients = {
      '部门': new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        { offset: 0, color: '#6366f1' },
        { offset: 1, color: '#8b5cf6' }
      ]),
      '角色': new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        { offset: 0, color: '#f59e0b' },
        { offset: 1, color: '#ea580c' }
      ]),
      '分类': new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        { offset: 0, color: '#ec4899' },
        { offset: 1, color: '#db2777' }
      ]),
      '其他': new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        { offset: 0, color: '#10b981' },
        { offset: 1, color: '#059669' }
      ])
    }
    return gradients[type] || gradients['其他']
  }
  
  const baseOption = {
    backgroundColor: 'transparent',
    textStyle: {
      color: '#e2e8f0',
      fontFamily: 'Inter, system-ui, sans-serif'
    },
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(15, 23, 42, 0.95)',
      borderColor: 'rgba(99, 102, 241, 0.3)',
      borderWidth: 1,
      textStyle: { color: '#e2e8f0' },
      padding: 15,
      borderRadius: 8,
      shadowBlur: 10,
      shadowColor: 'rgba(0, 0, 0, 0.2)',
      formatter: function(params) {
        const item = params[0]
        const dataItem = overviewData[item.dataIndex]
        return `
          <div class="p-3 space-y-2">
            <div class="font-semibold text-white">${item.name}</div>
            <div class="flex items-center space-x-2">
              <div class="w-3 h-3 rounded-full" style="background: ${dataItem.type === '部门' ? '#6366f1' : dataItem.type === '角色' ? '#f59e0b' : dataItem.type === '分类' ? '#ec4899' : '#10b981'}"></div>
              <span>费用总额: ${formatAmount(item.value)}</span>
            </div>
            <div class="flex items-center space-x-2">
              <div class="w-3 h-3 rounded-full bg-emerald-500/50"></div>
              <span>申请数量: ${dataItem.applicationCount || 0}</span>
            </div>
            <div class="flex items-center space-x-2">
              <div class="w-3 h-3 rounded-full bg-blue-500/50"></div>
              <span>占比: ${dataItem.percentage || 0}%</span>
            </div>
            <div class="text-sm text-gray-400">类型: ${dataItem.type || '未知'}</div>
          </div>
        `
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%',  // 增加底部空间以容纳标签
      top: '10%',
      containLabel: true,
      backgroundColor: 'transparent'
    },
    xAxis: {
      type: 'category',
      data: chartNames,
      axisLine: {
        lineStyle: {
          color: 'rgba(148, 163, 184, 0.3)',
          width: 1
        }
      },
      axisTick: {
        show: false
      },
      axisLabel: {
        color: '#94a3b8',
        fontSize: 11,
        rotate: chartNames.length > 8 ? 45 : 0,
        padding: [10, 0, 0, 0],
        interval: 0,
        formatter: function(value) {
          // 根据名称长度调整显示
          if (value.length > 10) {
            return value.substring(0, 8) + '...'
          }
          return value
        }
      }
    },
    yAxis: {
      type: 'value',
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: {
        lineStyle: {
          color: 'rgba(148, 163, 184, 0.1)',
          type: 'dashed'
        }
      },
      axisLabel: {
        color: '#94a3b8',
        fontSize: 11,
        formatter: function(value) {
          // 金额格式化，大数值时使用缩写
          if (value >= 10000) {
            return `${(value / 10000).toFixed(1)}万`
          }
          return `${value}`
        }
      }
    },
    series: [{
      name: '费用金额',
      type: 'bar',
      data: overviewData.map((item, index) => ({
        value: item.amount,
        itemStyle: {
          color: getGradientColor(index, item.type),
          borderRadius: [4, 4, 0, 0]
        }
      })),
      barWidth: '60%',
      emphasis: {
        itemStyle: {
          shadowBlur: 15,
          shadowColor: 'rgba(99, 102, 241, 0.6)',
          shadowOffsetX: 0,
          shadowOffsetY: 5
        }
      },
      animationDuration: 1500,
      animationDelay: function (idx) {
        return idx * 50
      },
      animationEasing: 'cubicOut',
      // 添加数值标签
      label: {
        show: chartData.length <= 8,  // 数据较少时显示标签
        position: 'top',
        offset: [0, -10],
        color: '#e2e8f0',
        fontSize: 10,
        fontWeight: 500,
        formatter: function(params) {
          const value = params.value
          if (value >= 10000) {
            return `${(value / 10000).toFixed(1)}万`
          }
          return `${value}`
        }
      }
    }],
    animation: true,
    animationDuration: 2000,
    animationEasing: 'cubicOut'
  }
  
  return baseOption
}

// 更新图表
const updateChart = async (data) => {
  // 确保DOM已经更新
  await nextTick()
  

    const initSuccess = await initChart()
    if (!initSuccess) return false
  
  
  if (!chartInstance) return false
  
  try {
    const items = data?.items || data?.department || data?.role || data
    const isEmpty = !items || (Array.isArray(items) && items.length === 0)
    if (isEmpty) {
      chartInstance.setOption(getEmptyChartOption())
    } else {
      chartInstance.setOption(getChartOption(data))
    }
    return true
  } catch (error) {
    console.error('图表更新失败:', error)
    chartError.value = '图表更新失败'
    emit('error', chartError.value)
    return false
  }
}

// 空数据图表配置
const getEmptyChartOption = () => {
  return {
    backgroundColor: 'transparent',
    textStyle: {
      color: '#e2e8f0',
      fontFamily: 'Inter, system-ui, sans-serif'
    },
    title: {
      text: '暂无数据',
      left: 'center',
      top: 'middle',
      textStyle: {
        color: '#94a3b8',
        fontSize: 16,
        fontWeight: 500
      }
    },
    xAxis: {
      type: 'category',
      data: [],
      axisLine: {
        lineStyle: {
          color: 'rgba(148, 163, 184, 0.3)',
          width: 1
        }
      },
      axisLabel: { color: '#94a3b8', fontSize: 11 }
    },
    yAxis: {
      type: 'value',
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: {
        lineStyle: {
          color: 'rgba(148, 163, 184, 0.1)',
          type: 'dashed'
        }
      },
      axisLabel: {
        color: '#94a3b8',
        fontSize: 11,
        formatter: '{value}'
      }
    },
    series: [{
      name: '费用金额',
      type: 'bar',
      data: [],
      itemStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: '#6366f1' },
          { offset: 1, color: '#8b5cf6' }
        ])
      }
    }]
  }
}

// 加载数据
const loadData = async () => {
  if (!props.startDate || !props.endDate) {
    return
  }
  
  loading.value = true
  chartError.value = ''
  emit('loading', true)
  
  try {
    const params = {
      startDate: props.startDate,
      endDate: props.endDate,
      viewMode: viewMode.value,
      roleScope: roleScope.value
    }
    if (selectedDepartmentId.value) {
      params.departmentId = selectedDepartmentId.value
    }

    if (viewMode.value === 'records') {
      params.page = recordsPage.value
      params.pageSize = recordsPageSize.value
      params.keyword = recordsKeyword.value
    }

    if (props.userName) params.userName = props.userName
    if (props.mainCategory) params.mainCategory = props.mainCategory

    const res = await getExpenseOverview(params)

    if (res.success) {
      loading.value = false

      if (viewMode.value === 'records') {
        const payload = res.data || {}
        recordsList.value = payload.list || []
        recordsTotal.value = payload.total || 0
        tableData.value = []
        total.value = 0
        chartData.value = []
        return
      }

      const data = res.data || {}
      chartData.value = data

      const primaryItems =
        data.items || (viewMode.value === 'role' ? data.role : data.department) || []

      const tableItems = (Array.isArray(primaryItems) ? primaryItems : []).map((item, index) => ({
        id: `${viewMode.value}_${index}`,
        statType: item.stat_type || (viewMode.value === 'role' ? '角色' : '部门'),
        name: item.name || '未知',
        totalAmount: parseFloat(item.total_amount || 0),
        applicationCount: parseInt(item.application_count || 0, 10),
        percentage: parseFloat(item.percentage || 0)
      }))

      tableData.value = tableItems.sort((a, b) => b.totalAmount - a.totalAmount)
      total.value = tableItems.length
      await nextTick()
      await updateChart(data)
    } else {
      chartError.value = res.message || '获取数据失败'
      emit('error', chartError.value)
    }
  } catch (error) {
    console.error('费用概览查询失败:', error)
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

// 导出数据
const exportData = () => {
  if (viewMode.value === 'records') {
    if (recordsList.value.length === 0) {
      ElMessage.warning('暂无数据可导出')
      return
    }
    const rows = recordsList.value.map((row, index) => ({
      '序号': index + 1,
      '费用名称': row.name,
      '申请人': row.applicant_display,
      '部门': row.department_name,
      '角色': row.role_bucket || row.role_name,
      '金额': row.amount,
      '日期': row.date,
      '状态': statusLabel(row.status)
    }))
    downloadCsv(rows, '费用申请记录')
    return
  }

  if (tableData.value.length === 0) {
    ElMessage.warning('暂无数据可导出')
    return
  }
  
  const exportRows = tableData.value.map((item, index) => ({
    '序号': index + 1,
    '统计类型': item.statType,
    '名称': item.name,
    '总金额': item.totalAmount,
    '申请数量': item.applicationCount,
    '占比': `${item.percentage}%`
  }))
  
  downloadCsv(exportRows, '费用概览统计')
}

const downloadCsv = (rows, filenamePrefix) => {
  const headers = Object.keys(rows[0])
  const csvContent = [
    headers.join(','),
    ...rows.map(row =>
      headers.map(header => {
        const value = row[header]
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`
        }
        return value
      }).join(',')
    )
  ].join('\n')

  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = `${filenamePrefix}_${new Date().toLocaleDateString('zh-CN')}.csv`
  link.click()
  ElMessage.success('导出成功')
}

// 监听参数变化
watch([() => props.startDate, () => props.endDate, () => props.userName, () => props.mainCategory], () => {
  loadData()
})

// 监听窗口大小变化
const handleResize = () => {
  if (chartInstance) {
    chartInstance.resize()
  }
}

onMounted(async () => {
  await loadDepartmentTree()
  loadData()
  window.addEventListener('resize', handleResize)
})

// 清理
const cleanup = () => {
  if (chartInstance) {
    chartInstance.dispose()
    chartInstance = null
  }
  window.removeEventListener('resize', handleResize)
}

// 暴露方法
defineExpose({
  refreshData,
  exportData,
  cleanup
})
</script>

<style scoped>
.chart-container-wrapper {
  position: relative;
  width: 100%;
  min-height: 400px;
  height: 500px;
  transition: height 0.3s ease;
}

.chart-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.data-table-wrapper {
  overflow-x: auto;
  -ms-overflow-style: none;
  scrollbar-width: thin;
}

.data-table-wrapper::-webkit-scrollbar {
  height: 6px;
}

.data-table-wrapper::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
}

.data-table-wrapper::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.15);
  border-radius: 10px;
  transition: background-color 0.3s ease;
}

.data-table-wrapper::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.25);
}

/* 动画效果 */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-in {
  animation: fadeIn 0.5s ease-out;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .chart-container-wrapper {
    height: 400px;
  }
  
  .flex.items-center.justify-between {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
  
  .text-xl {
    font-size: 1.25rem;
  }
  
  .text-lg {
    font-size: 1.125rem;
  }
}

@media (max-width: 480px) {
  .chart-container-wrapper {
    height: 350px;
  }
  
  .px-6 {
    padding-left: 12px;
    padding-right: 12px;
  }
  
  .py-4 {
    padding-top: 12px;
    padding-bottom: 12px;
  }
}

</style>