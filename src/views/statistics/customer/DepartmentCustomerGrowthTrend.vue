<!-- 部门客户增长趋势组件 -->
<template>
  <div class="space-y-6">
    <!-- 图表显示 -->
    <div class="backdrop-blur-lg bg-white/10 rounded-2xl border border-white/20 shadow-xl p-6">
      <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 space-y-4 lg:space-y-0">
        <div class="flex items-center space-x-4">
          <h3 class="text-xl font-bold text-white flex items-center">
            <i class="fas fa-building-trending-up mr-3 text-primary"></i>
            部门客户增长趋势
          </h3>
          <div class="hidden lg:block text-sm text-gray-400">
            <i class="fas fa-info-circle mr-1"></i>
            支持鼠标滚轮缩放和拖拽
          </div>
        </div>
        <div class="flex flex-wrap items-center gap-2">
          <div class="flex items-center text-xs text-gray-400 bg-white/5 px-3 py-1.5 rounded-full">
            <i class="fas fa-chart-line mr-2"></i>
            各部门新增客户趋势
          </div>
          <button
            @click="refreshData"
            class="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all duration-300 flex items-center space-x-2 text-sm"
          >
            <i class="fas fa-sync-alt" :class="{ 'fa-spin': loading }"></i>
            <span>刷新</span>
          </button>
          <button
            @click="exportData"
            class="px-3 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-400/30 rounded-lg transition-all duration-300 flex items-center space-x-2 text-sm"
          >
            <i class="fas fa-download"></i>
            <span>导出</span>
          </button>
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
      
      <div v-if="!loading" ref="chartRef" class="chart-container relative">
        <div v-if="chartData.length > 10" class="absolute top-2 right-2 z-10 bg-black/50 backdrop-blur-sm rounded-lg px-2 py-1 text-xs text-gray-300">
          <i class="fas fa-search-plus mr-1"></i>
          滚轮缩放 | 拖拽平移
        </div>
      </div>
    </div>
    
    <!-- 数据列表 -->
    <div class="backdrop-blur-lg bg-white/10 rounded-2xl border border-white/20 shadow-xl p-6">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold text-white">详细数据</h3>
        <span class="text-sm text-gray-400">共 {{ total }} 条记录</span>
      </div>
      
      <div class="overflow-x-auto">
        <table class="w-full text-sm text-left">
          <thead class="text-xs text-gray-400 uppercase bg-white/5">
            <tr>
              <th scope="col" class="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">日期</th>
              <th scope="col" class="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">部门名称</th>
              <th scope="col" class="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">新增客户数</th>
              <th scope="col" class="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">累计客户数</th>
              <th scope="col" class="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">增长率</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in tableData" :key="item.date" class="border-b border-white/10 hover:bg-white/5 transition-colors duration-200">
              <td class="px-6 py-4">
                <span class="text-white font-semibold text-sm">
                  {{ item.period_date_formatted || formatDate(item.date) }}
                </span>
              </td>
              <td class="px-6 py-4 text-gray-400">
                {{ item.departmentName }}
              </td>
              <td class="px-6 py-4">
                <span class="px-3 py-1.5 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-300 border border-blue-400/30 rounded-full text-sm font-bold backdrop-blur-sm">
                  {{ item.newCustomers }}
                </span>
              </td>
              <td class="px-6 py-4">
                <span class="px-3 py-1.5 bg-gradient-to-r from-emerald-500/20 to-green-500/20 text-emerald-300 border border-emerald-400/30 rounded-full text-sm font-bold backdrop-blur-sm">
                  {{ item.totalCustomers }}
                </span>
              </td>
              <td class="px-6 py-4">
                <span :class="getGrowthRateClass(item.growthRate)" class="px-3 py-1.5 rounded-full text-xs font-medium backdrop-blur-sm">
                  {{ formatPercentage(item.growthRate) }}
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
import { ref, reactive, onMounted, onUnmounted, watch, nextTick } from 'vue'
import * as echarts from 'echarts'
import { getDepartmentCustomerGrowthTrend } from '@/api/customerStatistics'
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
  departmentName: {
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

// 部门筛选（响应式引用）
const selectedDepartment = ref('')

// 格式化日期
const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('zh-CN')
}

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

// 获取增长率样式
const getGrowthRateClass = (rate) => {
  const num = parseFloat(rate)
  if (isNaN(num)) return 'bg-gray-500/20 text-gray-300 border border-gray-400/30'
  
  if (num > 0) {
    return 'bg-gradient-to-r from-emerald-500/20 to-green-500/20 text-emerald-300 border border-emerald-400/30'
  } else if (num < 0) {
    return 'bg-gradient-to-r from-red-500/20 to-rose-500/20 text-red-300 border border-red-400/30'
  } else {
    return 'bg-gray-500/20 text-gray-300 border border-gray-400/30'
  }
}

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

  // 获取筛选后的数据
  const filteredData = selectedDepartment.value
    ? chartData.value.filter(item => item.departmentName === selectedDepartment.value)
    : chartData.value

  // 按日期排序
  const sortedDates = [...new Set(filteredData.map(item => item.date).filter(Boolean))].sort()

  // 创建日期格式化映射
  const dateFormattedMap = {}
  filteredData.forEach(item => {
    if (item.date && item.period_date_formatted) {
      dateFormattedMap[item.date] = item.period_date_formatted
    }
  })

  // 准备部门数据 - 只显示新增客户数
  const departmentGroups = {}
  filteredData.forEach(item => {
    if (!departmentGroups[item.departmentName]) {
      departmentGroups[item.departmentName] = {
        name: item.departmentName,
        data: []
      }
    }
  })

  // 为每个部门创建系列数据
  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#84cc16', '#f97316']
  const series = []
  const legendData = []
  
  Object.keys(departmentGroups).forEach((deptName, index) => {
    series.push({
      name: deptName,
      type: 'line',
      data: sortedDates.map(date => {
        const dayData = filteredData.filter(item => item.date === date && item.departmentName === deptName)
        return dayData.reduce((sum, item) => sum + item.newCustomers, 0)
      }),
      smooth: true,
      symbol: 'circle',
      symbolSize: 4,
      itemStyle: {
        color: colors[index % colors.length]
      },
      lineStyle: {
        width: 2
      },
      emphasis: {
        focus: 'series',
        lineStyle: {
          width: 3
        },
        itemStyle: {
          borderWidth: 2,
          borderColor: '#fff'
        }
      }
    })
    legendData.push(deptName)
  })

  // 更新图表标题
  const chartTitle = selectedDepartment.value ? `${selectedDepartment.value} 新增客户趋势` : '各部门新增客户趋势'

  const option = {
    backgroundColor: 'transparent',
    title: {
      text: chartTitle,
      left: 'center',
      textStyle: {
        color: '#fff',
        fontSize: 14
      }
    },
    tooltip: {
      trigger: 'axis',
      formatter: function(params) {
        let result = `${params[0].axisValue}<br/>`
        params.forEach(param => {
          result += `${param.seriesName}: ${param.value} 人<br/>`
        })
        return result
      }
    },
    legend: {
      data: legendData,
      textStyle: {
        color: '#fff'
      },
      top: 30,
      type: 'scroll'
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '10%',
      top: '15%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: sortedDates.map(date => dateFormattedMap[date] || formatDate(date)),
      axisLabel: {
        color: '#fff',
        fontSize: 12
      },
      axisLine: {
        lineStyle: {
          color: '#fff'
        }
      }
    },
    yAxis: {
      type: 'value',
      name: '新增客户数量',
      nameTextStyle: {
        color: '#fff'
      },
      axisLabel: {
        color: '#fff'
      },
      splitLine: {
        lineStyle: {
          color: 'rgba(255, 255, 255, 0.1)'
        }
      }
    },
    dataZoom: [
      {
        type: 'inside',
        xAxisIndex: 0,
        start: 0,
        end: 100,
        zoomOnMouseWheel: true,
        moveOnMouseMove: true,
        moveOnMouseWheel: false,
        preventDefaultMouseMove: false,
        filterMode: 'filter',
        throttle: 0
      }
    ],
    series: series
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
      departmentName: props.departmentName,
      timeDimension: props.timeDimension
    }

    const res = await getDepartmentCustomerGrowthTrend(params)
    
    if (res.success) {
      loading.value = false
      const rawData = res.data || []
      
      // 转换数据格式以适配组件需求
      const transformedData = rawData.map(item => ({
        date: item.period_date,
        period_date_formatted: item.period_date_formatted,
        departmentId: item.department_id,
        departmentName: item.department_name,
        newCustomers: item.new_customers,
        totalCustomers: item.cumulative_customers,
        activeCustomers: item.active_customers,
        vipCustomers: item.vip_customers,
        timeDimension: item.time_dimension,
        // 计算环比增长率（需要对比上期数据）
        growthRate: 0 // 暂时设为0，后续可以计算
      }))
      
      // 按日期排序（升序）
      transformedData.sort((a, b) => new Date(a.date) - new Date(b.date))
      
      // 计算环比增长率
      for (let i = 1; i < transformedData.length; i++) {
        const current = transformedData[i]
        const previous = transformedData[i - 1]
        if (previous.totalCustomers > 0) {
          current.growthRate = ((current.totalCustomers - previous.totalCustomers) / previous.totalCustomers * 100)
        }
      }
      
      chartData.value = transformedData
      tableData.value = transformedData
      total.value = transformedData.length
      
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
    console.error('加载部门客户增长趋势数据失败:', error)
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

// 导出数据
const exportData = () => {
  if (!tableData.value.length) {
    ElMessage.warning('暂无数据可导出')
    return
  }

  const headers = ['日期', '部门名称', '新增客户数', '累计客户数', '增长率']
  const data = tableData.value.map(item => [
    item.period_date_formatted || formatDate(item.date),
    item.departmentName,
    item.newCustomers,
    item.totalCustomers,
    formatPercentage(item.growthRate)
  ])

  const csvContent = [headers, ...data]
    .map(row => row.join(','))
    .join('\n')

  const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = `部门客户增长趋势_${new Date().toLocaleDateString('zh-CN')}.csv`
  link.click()

  ElMessage.success('数据导出成功')
}

// 监听参数变化
watch([() => props.startDate, () => props.endDate, () => props.departmentName, () => props.timeDimension], () => {
  // 更新选中的部门
  selectedDepartment.value = props.departmentName
  loadData()
}, { immediate: true })

// 监听部门筛选变化
watch(selectedDepartment, () => {
  if (chartData.value.length > 0) {
    nextTick(() => {
      initChart()
    })
  }
})

// 组件挂载时初始化
onMounted(() => {
  // 初始化选中的部门
  selectedDepartment.value = props.departmentName
  
  window.addEventListener('resize', () => {
    if (chartInstance) {
      chartInstance.resize()
    }
  })
})

onUnmounted(() => {
  if (chartInstance) {
    chartInstance.dispose()
    chartInstance = null
  }
  window.removeEventListener('resize', () => {
    if (chartInstance) {
      chartInstance.resize()
    }
  })
})
</script>

<style scoped>
.chart-container {
  width: 100%;
  height: 450px;
  min-height: 350px;
}

.text-primary { color: #3b82f6; }

/* 响应式调整 */
@media (max-width: 768px) {
  .chart-container {
    height: 350px;
  }
}

/* 图表动画效果 */
.chart-container {
  transition: all 0.3s ease;
}

/* 数据缩放控制样式 */
.echarts-data-zoom {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 4px;
}

/* 图例悬停效果 */
.legend-item {
  transition: all 0.2s ease;
}

.legend-item:hover {
  transform: translateY(-1px);
}
</style>