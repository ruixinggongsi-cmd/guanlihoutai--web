<!-- 客户维护趋势组件 -->
<template>
  <div class="space-y-6">
    <!-- 统计卡片 -->
    <div v-if="selectedStaff && chartData && chartData.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="backdrop-blur-lg bg-white/10 rounded-xl border border-white/20 shadow-lg p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-400">总客户数</p>
            <p class="text-2xl font-bold text-blue-400">{{ latestData.total_customers || 0 }}</p>
          </div>
          <div class="p-3 bg-blue-500/20 rounded-full">
            <i class="fas fa-users text-blue-400 text-xl"></i>
          </div>
        </div>
      </div>
      
      <div class="backdrop-blur-lg bg-white/10 rounded-xl border border-white/20 shadow-lg p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-400">已联系客户</p>
            <p class="text-2xl font-bold text-emerald-400">{{ latestData.contacted_customers || 0 }}</p>
          </div>
          <div class="p-3 bg-emerald-500/20 rounded-full">
            <i class="fas fa-phone text-emerald-400 text-xl"></i>
          </div>
        </div>
      </div>
      
      <div class="backdrop-blur-lg bg-white/10 rounded-xl border border-white/20 shadow-lg p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-400">联系率</p>
            <p class="text-2xl font-bold text-purple-400">{{ formatPercentage(latestData.contact_rate) }}</p>
          </div>
          <div class="p-3 bg-purple-500/20 rounded-full">
            <i class="fas fa-percentage text-purple-400 text-xl"></i>
          </div>
        </div>
      </div>
      
      <div class="backdrop-blur-lg bg-white/10 rounded-xl border border-white/20 shadow-lg p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-400">未联系客户</p>
            <p class="text-2xl font-bold text-red-400">{{ latestData.uncontacted_customers || 0 }}</p>
          </div>
          <div class="p-3 bg-red-500/20 rounded-full">
            <i class="fas fa-user-times text-red-400 text-xl"></i>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 图表显示 -->
    <div class="backdrop-blur-lg bg-white/10 rounded-2xl border border-white/20 shadow-xl p-6">
      <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 space-y-4 lg:space-y-0">
        <div class="flex items-center space-x-4">
          <h3 class="text-lg font-bold text-white flex items-center">
            <i class="fas fa-users-cog mr-2 text-primary"></i>
            客户维护趋势
          </h3>
          <div class="hidden lg:block text-sm text-gray-400">
            <i class="fas fa-info-circle mr-1"></i>
            基于联系记录综合分析
          </div>
        </div>
        <div class="flex items-center space-x-4">
          <div class="relative">
            <select
              v-model="selectedStaff"
              class="px-3 py-1.5 bg-gray-800 border border-gray-600 text-white rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary appearance-none cursor-pointer min-w-32"
            >
              <option value="" class="bg-gray-800 text-white hover:bg-gray-700">全部员工</option>
              <option v-for="staff in uniqueStaffs" :key="staff" :value="staff" class="bg-gray-800 text-white hover:bg-gray-700">
                {{ staff }}
              </option>
            </select>
            <div class="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </div>
          </div>
          <div class="flex space-x-2">
            <button
              @click="refreshData"
              class="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-md transition-all duration-300 flex items-center space-x-2"
            >
              <i class="fas fa-sync-alt" :class="{ 'fa-spin': loading }"></i>
              <span>刷新</span>
            </button>
            <button
              @click="exportData"
              class="px-3 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-400/30 rounded-md transition-all duration-300 flex items-center space-x-2"
            >
              <i class="fas fa-download"></i>
              <span>导出</span>
            </button>
          </div>
        </div>
      </div>
      
      <div v-if="loading" class="flex items-center justify-center h-96 text-gray-400">
        <div class="text-center space-y-4">
          <i class="fas fa-spinner fa-spin text-4xl"></i>
          <p>图表加载中...</p>
        </div>
      </div>
      
      <div v-else-if="chartError" class="flex items-center justify-center h-96 text-red-400">
        <div class="text-center space-y-4">
          <i class="fas fa-exclamation-triangle text-4xl"></i>
          <p>{{ chartError }}</p>
          <button
            @click="refreshData"
            class="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-400/30 rounded-lg transition-all duration-300"
          >
            重试
          </button>
        </div>
      </div>
      
      <div v-else-if="!chartData || chartData.length === 0" class="flex items-center justify-center h-96 text-gray-400">
        <div class="text-center space-y-4">
          <i class="fas fa-inbox text-4xl opacity-50"></i>
          <p class="text-lg">暂无数据</p>
          <p class="text-sm text-gray-500">请调整查询条件后重试</p>
        </div>
      </div>
      
      <div v-if="!loading" ref="chartRef" class="chart-container"></div>
    </div>
    
    <!-- 数据列表 -->
    <div class="backdrop-blur-lg bg-white/10 rounded-2xl border border-white/20 shadow-xl p-6">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-bold text-white flex items-center">
          <i class="fas fa-table mr-2 text-primary"></i>
          详细数据
        </h3>
        <div class="text-sm text-gray-400">
          <i class="fas fa-chart-line mr-1"></i>
          共 {{ selectedStaff ? filteredData.length : total }} 条记录
        </div>
      </div>
      
      <div class="overflow-x-auto">
        <table class="w-full text-sm text-left">
          <thead class="text-xs text-gray-400 uppercase bg-white/5">
            <tr>
              <th scope="col" class="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">员工</th>
              <th scope="col" class="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">部门</th>
              <th scope="col" class="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">时期</th>
              <th scope="col" class="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">新增客户</th>
              <th scope="col" class="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">总客户数</th>
              <th scope="col" class="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">VIP客户</th>
              <th scope="col" class="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">已联系客户</th>
              <th scope="col" class="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">未联系客户</th>
              <th scope="col" class="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">联系率</th>
              <th scope="col" class="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">总联系次数</th>
              <th scope="col" class="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">平均未联系天数</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in (selectedStaff ? filteredData : tableData)" :key="item.period_date" 
                class="border-b border-white/10 hover:bg-white/5 transition-all duration-200 cursor-pointer"
                :class="{ 'bg-white/5': index % 2 === 0 }">
              <td class="px-6 py-4 text-gray-300">
                <div class="flex items-center">
                  <i class="fas fa-user mr-2 text-gray-400"></i>
                  {{ item.staff_name || '-' }}
                </div>
              </td>
              <td class="px-6 py-4 text-gray-300">
                <div class="flex items-center">
                  <i class="fas fa-building mr-2 text-gray-400"></i>
                  {{ item.department_name || '-' }}
                </div>
              </td>
              <td class="px-6 py-4">
                <span class="text-white font-semibold text-sm">
                  {{ item.period_date_formatted || formatDate(item.period_date) }}
                </span>
              </td>
              <td class="px-6 py-4 text-cyan-400 font-semibold">{{ item.new_customers || 0 }}</td>
              <td class="px-6 py-4">
                <span class="px-3 py-1.5 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-300 border border-blue-400/30 rounded-full text-sm font-bold backdrop-blur-sm">
                  {{ item.total_customers }}
                </span>
              </td>
              <td class="px-6 py-4 text-yellow-400 font-semibold">{{ item.vip_customers || 0 }}</td>
              <td class="px-6 py-4">
                <span class="px-3 py-1.5 bg-gradient-to-r from-emerald-500/20 to-green-500/20 text-emerald-300 border border-emerald-400/30 rounded-full text-sm font-bold backdrop-blur-sm">
                  {{ item.contacted_customers }}
                </span>
              </td>
              <td class="px-6 py-4">
                <span class="px-3 py-1.5 bg-gradient-to-r from-red-500/20 to-rose-500/20 text-red-300 border border-red-400/30 rounded-full text-sm font-bold backdrop-blur-sm">
                  {{ item.uncontacted_customers }}
                </span>
              </td>
              <td class="px-6 py-4">
                <span class="px-3 py-1.5 bg-gradient-to-r from-purple-500/20 to-indigo-500/20 text-purple-300 border border-purple-400/30 rounded-full text-xs font-medium backdrop-blur-sm">
                  {{ formatPercentage(item.contact_rate) }}
                </span>
              </td>
              <td class="px-6 py-4 text-green-400 font-semibold">{{ item.total_contacts || 0 }}</td>
              <td class="px-6 py-4">
                <span class="px-3 py-1.5 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 text-amber-300 border border-amber-400/30 rounded-full text-xs font-medium backdrop-blur-sm">
                  {{ Math.round(item.avg_days_since_contact) }} 天
                </span>
              </td>
            </tr>
            <tr v-if="(selectedStaff ? filteredData : tableData).length === 0">
              <td colspan="11" class="px-6 py-8 text-center text-gray-400">
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
import { ref, reactive, onMounted, watch, nextTick, computed } from 'vue'
import * as echarts from 'echarts'
import { getCustomerMaintenanceTrend } from '@/api/customerStatistics'
import { ElMessage } from 'element-plus'

const props = defineProps({
  startDate: {
    type: String,
    default: ''
  },
  endDate: {
    type: String,
    default: ''
  },
  staffName: {
    type: String,
    default: ''
  },
  timeDimension: {
    type: String,
    default: 'month'
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
const selectedStaff = ref('')
const uniqueStaffs = ref([])

// 格式化日期
const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('zh-CN')
}



// 计算筛选后的数据
const filteredData = computed(() => {
  let data = chartData.value
  if (selectedStaff.value) {
    data = data.filter(item => item.staff_name === selectedStaff.value)
  }
  // 过滤掉没有数据的时期（总客户数为0或关键指标缺失的时期）
  data = data.filter(item => {
    return item.total_customers > 0 && 
           item.period_date && 
           item.contacted_customers !== null && 
           item.uncontacted_customers !== null
  })
  // 按时期升序排序
  return data.sort((a, b) => new Date(a.period_date) - new Date(b.period_date))
})

// 格式化百分比
const formatPercentage = (value) => {
  if (value === null || value === undefined || value === '') return '0.00%'
  
  const num = parseFloat(value)
  if (isNaN(num)) return '0.00%'
  
  return num.toLocaleString('zh-CN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }) + '%'
}

// 获取最新数据
const latestData = computed(() => {
  if (!chartData.value || chartData.value.length === 0) {
    return {
      total_customers: 0,
      contacted_customers: 0,
      uncontacted_customers: 0,
      contact_rate: 0
    }
  }
  
  let filteredData = chartData.value
  if (selectedStaff.value) {
    filteredData = filteredData.filter(item => item.staff_name === selectedStaff.value)
  }
  
  // 过滤掉没有数据的时期（与filteredData使用相同的过滤逻辑）
  filteredData = filteredData.filter(item => {
    return item.total_customers > 0 && 
           item.period_date && 
           item.contacted_customers !== null && 
           item.uncontacted_customers !== null
  })
  
  // 按时期排序
  filteredData.sort((a, b) => new Date(a.period_date) - new Date(b.period_date))
    
  if (filteredData.length === 0) {
    return {
      total_customers: 0,
      contacted_customers: 0,
      uncontacted_customers: 0,
      contact_rate: 0
    }
  }
  
  // 返回最新的数据
  return filteredData[filteredData.length - 1] || {
    total_customers: 0,
    contacted_customers: 0,
    uncontacted_customers: 0,
    contact_rate: 0
  }
})



// 初始化图表
const initChart = async () => {
  if (!chartRef.value) {
    chartError.value = '图表容器未找到'
    emit('error', chartError.value)
    return false
  }

  // 销毁旧图表实例
  if (chartInstance) {
    chartInstance.dispose()
  }

  chartInstance = echarts.init(chartRef.value)
  
  // 重新组织数据结构：按时间维度分组，每个时间点显示不同用户的数据
  const getTimeSeriesData = () => {
    const timeGroups = {}
    
    // 获取当前需要处理的数据（根据筛选条件）
    const currentData = selectedStaff.value 
      ? chartData.value.filter(item => item.staff_name === selectedStaff.value)
      : chartData.value
    
    // 按时间分组数据
    currentData.forEach(item => {
      if (!item.period_date || item.total_customers <= 0) return
      
      const timeKey = item.period_date_formatted || formatDate(item.period_date)
      if (!timeGroups[timeKey]) {
        timeGroups[timeKey] = {
          period_date: timeKey,
          staff_data: []
        }
      }
      
      timeGroups[timeKey].staff_data.push({
        staff_name: item.staff_name,
        total_customers: item.total_customers,
        contacted_customers: item.contacted_customers,
        uncontacted_customers: item.uncontacted_customers,
        contact_rate: item.contact_rate,
        vip_customers: item.vip_customers,
        new_customers: item.new_customers
      })
    })
    
    // 按时间排序
    return Object.values(timeGroups).sort((a, b) => new Date(a.period_date) - new Date(b.period_date))
  }
  
  const timeSeriesData = getTimeSeriesData()
  
  // 获取所有用户列表（用于图例和系列数据）
  const currentChartData = selectedStaff.value 
    ? chartData.value.filter(item => item.staff_name === selectedStaff.value)
    : chartData.value
  const allStaffs = [...new Set(currentChartData.map(item => item.staff_name).filter(Boolean))].sort()
  
  // 如果选择了特定员工，只显示该员工数据
  const displayStaffs = selectedStaff.value ? [selectedStaff.value] : allStaffs
  
  // 计算选中员工的联系统计信息
  const getStaffContactStats = () => {
    if (!selectedStaff.value || !filteredData.value.length) return null
    
    const latestData = filteredData.value[filteredData.value.length - 1]
    const totalContacted = filteredData.value.reduce((sum, item) => sum + item.contacted_customers, 0)
    const totalCustomers = filteredData.value.reduce((sum, item) => sum + item.total_customers, 0)
    const avgContactRate = totalCustomers > 0 ? (totalContacted / totalCustomers * 100) : 0
    
    return {
      latestContacted: latestData.contacted_customers,
      latestTotal: latestData.total_customers,
      latestRate: latestData.contact_rate,
      avgContactRate: avgContactRate,
      totalContacted,
      totalCustomers
    }
  }
  
  const staffStats = getStaffContactStats()
  const titleText = selectedStaff.value ? `${selectedStaff.value} - 客户维护趋势` : '客户维护趋势'
  const subtext = ''
  
  const option = {
    backgroundColor: 'transparent',
    title: {
      text: titleText,
      subtext: subtext,
      left: 'center',
      textStyle: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold'
      },
      subtextStyle: {
        color: '#9ca3af',
        fontSize: 12
      }
    },
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(0, 0, 0, 0.9)',
      borderColor: '#4b5563',
      borderWidth: 1,
      textStyle: {
        color: '#fff',
        fontSize: 12
      },
      formatter: function(params) {
        let html = `<div class="font-semibold mb-2">${params[0].axisValue}</div>`
        
        // 按用户分组显示数据
        const staffGroups = {}
        
        params.forEach(param => {
          const staffName = param.seriesName
          if (!staffGroups[staffName]) {
            staffGroups[staffName] = {
              staffName,
              contactedCustomers: 0,
              totalCustomers: 0,
              color: param.color
            }
          }
          
          // 获取联系客户数量
          staffGroups[staffName].contactedCustomers = param.value
          
          // 从时间序列数据中获取总客户数
          const timeItem = timeSeriesData.find(item => item.period_date === param.axisValue)
          if (timeItem) {
            const staffData = timeItem.staff_data.find(s => s.staff_name === staffName)
            if (staffData) {
              staffGroups[staffName].totalCustomers = staffData.total_customers
            }
          }
        })
        
        // 为每个用户显示详细数据
        Object.values(staffGroups).forEach(staff => {
          if (staff.totalCustomers > 0) {
            html += `<div class="bg-white/10 rounded-lg p-2 mb-2">
              <div class="flex items-center justify-between">
                <div class="flex items-center">
                  <span class="w-3 h-3 rounded-full mr-2" style="background-color: ${staff.color}"></span>
                  <span class="text-blue-400 font-medium mr-4">${staff.staffName}</span>
                </div>
                <div class="flex gap-4 text-sm">
                  <span class="text-emerald-400">总客户: ${staff.totalCustomers}</span>
                  <span class="text-purple-400">已联系: ${staff.contactedCustomers}</span>
                </div>
              </div>
            </div>`
          }
        })
        
        return html
      }
    },
    legend: {
      data: displayStaffs,
      top: 40,
      textStyle: {
        color: '#9ca3af',
        fontSize: 12
      },
      icon: 'circle',
      itemWidth: 10,
      itemHeight: 10
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '8%',
      top: '20%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: timeSeriesData.map(item => item.period_date),
      axisLine: {
        lineStyle: {
          color: '#6b7280'
        }
      },
      axisLabel: {
        color: '#9ca3af',
        fontSize: 11,
        rotate: timeSeriesData.length > 10 ? 45 : 0
      },
      axisTick: {
        show: false
      }
    },
    yAxis: {
      type: 'value',
      name: '联系次数',
      position: 'left',
      axisLine: {
        show: false
      },
      axisLabel: {
        color: '#9ca3af',
        fontSize: 11
      },
      splitLine: {
        lineStyle: {
          color: 'rgba(255, 255, 255, 0.1)',
          type: 'dashed'
        }
      }
    },
    dataZoom: [
      {
        type: 'inside',
        xAxisIndex: 0,
        start: 0,
        end: 100
      }
    ],
    series: [
      // 为每个用户创建联系客户次数系列
      ...displayStaffs.map((staff, index) => ({
        name: staff,
        type: 'line',
        data: timeSeriesData.map(timeItem => {
          const staffData = timeItem.staff_data.find(s => s.staff_name === staff)
          return staffData ? staffData.contacted_customers : 0
        }),
        smooth: true,
        symbol: 'circle',
        symbolSize: 6,
        lineStyle: {
          color: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'][index % 6],
          width: 2
        },
        itemStyle: {
          color: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'][index % 6],
          borderWidth: 2,
          borderColor: ['#1e40af', '#059669', '#d97706', '#dc2626', '#7c3aed', '#0891b2'][index % 6]
        }
      }))
    ]
  }

  chartInstance.setOption(option)
  return true
}

// 加载数据
const loadData = async () => {
  if (!props.startDate || !props.endDate) {
    return
  }

  loading.value = true
  emit('loading', true)
  chartError.value = ''

  try {
    const params = {
      startDate: props.startDate,
      endDate: props.endDate,
      staffName: props.staffName,
      timeDimension: props.timeDimension
    }

    const res = await getCustomerMaintenanceTrend(params)
    
    if (res.success) {
      loading.value = false
      chartData.value = res.data || []
      tableData.value = res.data || []
      total.value = (res.data || []).length
      
      // 更新员工列表
      const staffs = [...new Set(res.data.map(item => item.staff_name).filter(Boolean))]
      uniqueStaffs.value = staffs.sort()
      
      if (chartData.value.length > 0) {
        await nextTick()
        await initChart()
      }
    } else {
      chartData.value = []
      tableData.value = []
      total.value = 0
      chartError.value = res.message || '暂无数据'
    }
  } catch (error) {
    console.error('加载客户维护趋势数据失败:', error)
    chartError.value = error.message || '加载数据失败'
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

// 更新图表（当员工筛选变化时调用）
const updateChart = () => {
  if (chartData.value.length > 0) {
    nextTick(() => {
      initChart()
    })
  }
}

// 导出数据
const exportData = () => {
  if (!tableData.value.length) {
    ElMessage.warning('暂无数据可导出')
    return
  }

  const headers = ['员工', '部门', '时期', '新增客户', '总客户数', 'VIP客户', '已联系客户', '未联系客户', '联系率', '总联系次数', '平均未联系天数']
  const exportData = (selectedStaff.value ? filteredData.value : tableData.value).map(item => [
    item.staff_name || '-',
    item.department_name || '-',
    item.period_date_formatted || formatDate(item.period_date),
    item.new_customers || 0,
    item.total_customers,
    item.vip_customers || 0,
    item.contacted_customers,
    item.uncontacted_customers,
    formatPercentage(item.contact_rate),
    item.total_contacts || 0,
    Math.round(item.avg_days_since_contact)
  ])

  const csvContent = [headers, ...exportData]
    .map(row => row.join(','))
    .join('\n')

  const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = `客户维护趋势_${selectedStaff.value || '全部'}_${new Date().toLocaleDateString('zh-CN')}.csv`
  link.click()

  ElMessage.success('数据导出成功')
}

// 监听参数变化
watch([() => props.startDate, () => props.endDate, () => props.staffName, () => props.timeDimension], () => {
  loadData()
}, { immediate: true })

// 监听员工筛选变化
watch(selectedStaff, () => {
  // 筛选数据时不需要重新获取，直接使用计算属性
  updateChart()
})

// 组件卸载时销毁图表
onMounted(() => {
  window.addEventListener('resize', () => {
    if (chartInstance) {
      chartInstance.resize()
    }
  })
})
</script>

<style scoped>
.chart-container {
  width: 100%;
  height: 400px;
}

.text-primary { color: #3b82f6; }
</style>