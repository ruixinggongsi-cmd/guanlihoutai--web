<!-- 客户增长按来源统计组件 -->
<template>
  <div class="space-y-6">
    <!-- 图表显示 -->
    <div class="backdrop-blur-lg bg-white/10 rounded-2xl border border-white/20 shadow-xl p-6">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-xl font-bold text-white flex items-center">
          <i class="fas fa-user-plus mr-3 text-primary"></i>
          客户增长按来源统计
        </h3>
        <div class="flex space-x-2">
          <button
            @click="refreshData"
            class="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all duration-300 flex items-center space-x-2"
          >
            <i class="fas fa-sync-alt" :class="{ 'fa-spin': loading }"></i>
            <span>刷新</span>
          </button>
          <button
            @click="exportData"
            class="px-4 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-400/30 rounded-lg transition-all duration-300 flex items-center space-x-2"
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
      
      <div v-if="!loading" ref="chartRef" class="chart-container"></div>
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
              <th scope="col" class="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">统计周期</th>
              <th scope="col" class="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">客户来源</th>
              <th scope="col" class="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">新增客户数</th>
              <th scope="col" class="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">累计客户数</th>
              <th scope="col" class="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">总客户数</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in tableData" :key="item.period_date + item.customer_source" class="border-b border-white/10 hover:bg-white/5 transition-colors duration-200">
              <td class="px-6 py-4">
                <span class="text-white font-semibold text-sm">
                  {{ item.period_date_formatted || formatDate(item.period_date) }}
                </span>
              </td>
              <td class="px-6 py-4">
                <span class="px-3 py-1.5 bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 border border-purple-400/30 rounded-full text-xs font-medium backdrop-blur-sm">
                  {{ item.customer_source }}
                </span>
              </td>
              <td class="px-6 py-4">
                <span class="px-3 py-1.5 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-300 border border-blue-400/30 rounded-full text-sm font-bold backdrop-blur-sm">
                  {{ item.new_customers }}
                </span>
              </td>
              <td class="px-6 py-4">
                <span class="px-3 py-1.5 bg-gradient-to-r from-emerald-500/20 to-green-500/20 text-emerald-300 border border-emerald-400/30 rounded-full text-sm font-bold backdrop-blur-sm">
                  {{ item.cumulative_customers }}
                </span>
              </td>
              <td class="px-6 py-4">
                <span class="px-3 py-1.5 bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-300 border border-amber-400/30 rounded-full text-sm font-bold backdrop-blur-sm">
                  {{ item.total_customers }}
                </span>
              </td>
            </tr>
            <tr v-if="tableData.length === 0">
              <td colspan="4" class="px-6 py-8 text-center text-gray-400">
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
import { ref, reactive, onMounted, watch, nextTick } from 'vue'
import * as echarts from 'echarts'
import { getCustomerGrowthBySource } from '@/api/customerStatistics'
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
  creatorName: {
    type: String,
    default: ''
  },
  customerSource: {
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

  // 按客户来源分组数据，并按时间排序
  const sourceGroups = {}
  chartData.value.forEach(item => {
    if (!sourceGroups[item.customer_source]) {
      sourceGroups[item.customer_source] = []
    }
    sourceGroups[item.customer_source].push(item)
  })

  // 对每个来源的数据按时间排序
  Object.keys(sourceGroups).forEach(source => {
    sourceGroups[source].sort((a, b) => new Date(a.period_date) - new Date(b.period_date))
  })

  // 准备图表数据 - 获取所有唯一日期和格式化日期
  const allDates = new Set()
  const dateFormattedMap = {}
  Object.values(sourceGroups).forEach(items => {
    items.forEach(item => {
      allDates.add(item.period_date)
      // 存储格式化日期，优先使用period_date_formatted
      dateFormattedMap[item.period_date] = item.period_date_formatted || formatDate(item.period_date)
    })
  })
  const xAxisData = Array.from(allDates).sort((a, b) => new Date(a) - new Date(b))
    .map(date => dateFormattedMap[date] || formatDate(date))

  // 为每个来源准备数据，确保每个日期都有值
  const series = Object.keys(sourceGroups).map(source => {
    const sourceData = sourceGroups[source]
    const dateMap = {}
    sourceData.forEach(item => {
      dateMap[item.period_date] = item.new_customers || 0
    })
    
    const data = Array.from(allDates).sort((a, b) => new Date(a) - new Date(b))
      .map(date => dateMap[date] || 0)
    
    return {
      name: source,
      type: 'line',
      smooth: true,
      areaStyle: {
        opacity: 0.3
      },
      data: data
    }
  })
  
  const option = {
    backgroundColor: 'transparent',
    title: {
      text: '客户增长趋势分析',
      left: 'center',
      textStyle: {
        color: '#fff',
        fontSize: 16
      }
    },
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(0,0,0,0.8)',
      borderColor: '#333',
      textStyle: {
        color: '#fff'
      },
      formatter: function(params) {
        let result = params[0].axisValue + '<br/>'
        params.forEach(param => {
          result += `${param.seriesName}: ${param.value}人<br/>`
        })
        return result
      }
    },
    legend: {
      data: Object.keys(sourceGroups),
      top: 30,
      textStyle: {
        color: '#fff'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: 80,
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: xAxisData,
      axisLine: {
        lineStyle: {
          color: '#666'
        }
      },
      axisLabel: {
        color: '#999',
        formatter: function(value) {
          return new Date(value).toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' })
        }
      }
    },
    yAxis: {
      type: 'value',
      axisLine: {
        lineStyle: {
          color: '#666'
        }
      },
      axisLabel: {
        color: '#999'
      },
      splitLine: {
        lineStyle: {
          color: '#333'
        }
      }
    },
    series: series
  }

  chartInstance.setOption(option, true)
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
      customerSource: props.customerSource || props.creatorName,
      timeDimension: props.timeDimension
    }

    const res = await getCustomerGrowthBySource(params)
    
    console.log('API响应数据:', res)
    
    if (res.success) {
      loading.value = false
      const rawData = res.data || []
      console.log('原始数据:', rawData)
      console.log('原始数据长度:', rawData.length)
      
      // 按日期+来源聚合，计算新增、累计、总数，保留格式化日期
      const aggregated = {}
      rawData.forEach(item => {
        const key = `${item.period_date}__${item.customer_source}`
        if (!aggregated[key]) {
          aggregated[key] = {
            period_date: item.period_date,
            period_date_formatted: item.period_date_formatted,
            customer_source: item.customer_source,
            new_customers: 0,
            cumulative_customers: 0,
            total_customers: 0
          }
        }
        aggregated[key].new_customers += item.new_customers || 0
        aggregated[key].cumulative_customers += item.cumulative_customers || 0
        aggregated[key].total_customers += item.total_customers || 0
      })
      const finalData = Object.values(aggregated)
      
      // 按日期排序（升序）
      finalData.sort((a, b) => new Date(a.period_date) - new Date(b.period_date))
      
      console.log('聚合后的数据:', finalData)
      console.log('聚合后的数据长度:', finalData.length)
      
      chartData.value = finalData
      tableData.value = finalData
      total.value = finalData.length
      
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
    console.error('加载客户增长数据失败:', error)
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

  const headers = ['统计周期', '客户来源', '新增客户数', '累计客户数', '总客户数']
  const data = tableData.value.map(item => [
    item.period_date_formatted || formatDate(item.period_date),
    item.customer_source,
    item.new_customers,
    item.cumulative_customers,
    item.total_customers
  ])

  const csvContent = [headers, ...data]
    .map(row => row.join(','))
    .join('\n')

  const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = `客户增长来源统计_${new Date().toLocaleDateString('zh-CN')}.csv`
  link.click()

  ElMessage.success('数据导出成功')
}

// 监听参数变化
watch([() => props.startDate, () => props.endDate, () => props.customerSource, () => props.creatorName, () => props.timeDimension], () => {
  loadData()
}, { immediate: true })

// 格式化日期
const formatDate = (dateStr) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' })
}

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