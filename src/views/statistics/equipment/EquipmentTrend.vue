<!-- 设备申请趋势统计组件 -->
<template>
  <div class="space-y-6">
    <!-- 图表显示 -->
    <div class="backdrop-blur-lg bg-white/10 rounded-2xl border border-white/20 shadow-xl p-6 transition-all duration-300 hover:shadow-2xl hover:bg-white/15 hover:translate-y-[-2px]">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-xl font-bold text-white flex items-center">
          <i class="fas fa-chart-line mr-3 text-primary"></i>
          设备申请趋势统计
        </h3>
        <div class="flex items-center space-x-4">
          <div class="flex items-center space-x-2">
            <label class="text-sm text-gray-400">分组方式:</label>
            <select
              v-model="groupBy"
              class="px-3 py-1.5 bg-white/10 border border-white/20 text-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-300"
            >
              <option value="day">按日</option>
              <option value="month">按月</option>
              <option value="year">按年</option>
            </select>
          </div>
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
              :disabled="!tableData || tableData.length === 0"
              class="px-4 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-400/30 rounded-lg transition-all duration-300 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <i class="fas fa-download"></i>
              <span>导出</span>
            </button>
          </div>
        </div>
      </div>
      
      <div class="chart-container-wrapper">
        <!-- 图表加载状态 -->
        <div v-if="loading" class="flex items-center justify-center h-full text-gray-400">
          <div class="text-center space-y-4">
            <div class="inline-block p-3 rounded-full bg-white/5 animate-pulse">
              <i class="fas fa-spinner fa-spin text-4xl"></i>
            </div>
            <p>图表加载中...</p>
          </div>
        </div>
        
        <!-- 图表错误状态 -->
        <div v-else-if="chartError" class="flex items-center justify-center h-full text-red-400">
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
        
        <!-- 空数据状态 -->
        <div v-else-if="!chartData || chartData.length === 0" class="flex items-center justify-center h-full text-gray-400">
          <div class="text-center space-y-4">
            <div class="inline-block p-3 rounded-full bg-white/5">
              <i class="fas fa-inbox text-4xl opacity-50"></i>
            </div>
            <p class="text-lg">暂无数据</p>
            <p class="text-sm text-gray-500">请调整查询条件后重试</p>
          </div>
        </div>
        
        <!-- 图表容器 -->
        <div ref="chartRef" class="chart-container w-full h-full"></div>
      </div>
    </div>
    
    <!-- 数据列表 -->
    <div class="backdrop-blur-lg bg-white/10 rounded-2xl border border-white/20 shadow-xl p-6 transition-all duration-300 hover:shadow-2xl hover:bg-white/15 hover:translate-y-[-2px]">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold text-white">详细数据</h3>
        <span class="text-sm text-gray-400">共 {{ total }} 条记录</span>
      </div>
      
      <div class="overflow-x-auto data-table-wrapper">
        <table class="w-full text-sm text-left">
          <thead class="text-xs text-gray-400 uppercase bg-white/5">
            <tr>
              <th scope="col" class="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">时间段</th>
              <th scope="col" class="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">总数量</th>
              <th scope="col" class="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">申请次数</th>
              <th scope="col" class="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">平均数量</th>
              <th scope="col" class="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">环比</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in tableData" :key="item.id" class="border-b border-white/10 hover:bg-white/5 transition-colors duration-200">
              <td class="px-6 py-4">
                <span class="text-white font-semibold text-sm">
                  <i class="fas fa-calendar-alt mr-2 text-blue-400"></i>
                  {{ item.period }}
                </span>
              </td>
              <td class="px-6 py-4">
                <span class="px-3 py-1.5 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-300 border border-blue-400/30 rounded-full text-sm font-bold backdrop-blur-sm">
                  <i class="fas fa-cubes mr-1 text-blue-400"></i>
                  {{ formatAmount(item.total_quantity) }}
                </span>
              </td>
              <td class="px-6 py-4 text-gray-400">
                {{ item.application_count }}
              </td>
              <td class="px-6 py-4">
                <span class="px-3 py-1.5 bg-gradient-to-r from-emerald-500/20 to-green-500/20 text-emerald-300 border border-emerald-400/30 rounded-full text-xs font-medium backdrop-blur-sm">
                  <i class="fas fa-chart-line mr-1 text-emerald-400"></i>
                  {{ formatAmount(item.avg_quantity) }}
                </span>
              </td>
              <td class="px-6 py-4">
                <span :class="[
                  'px-3 py-1.5 rounded-full text-xs font-medium backdrop-blur-sm',
                  item.growthRate > 0 
                    ? 'bg-gradient-to-r from-red-500/20 to-red-600/20 text-red-300 border border-red-400/30'
                    : item.growthRate < 0
                    ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-300 border border-green-400/30'
                    : 'bg-gradient-to-r from-gray-500/20 to-gray-600/20 text-gray-300 border border-gray-400/30'
                ]">
                  <i :class="[
                    'mr-1',
                    item.growthRate > 0 ? 'fas fa-arrow-up text-red-400' : 
                    item.growthRate < 0 ? 'fas fa-arrow-down text-green-400' : 
                    'fas fa-minus text-gray-400'
                  ]"></i>
                  {{ item.growthRate > 0 ? '+' : '' }}{{ item.growthRate.toFixed(1) }}%
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
import { ElMessage } from 'element-plus'
import { getEquipmentTrend } from '@/api/equipmentStatistics'

// Props
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

// Emits
const emit = defineEmits(['loading', 'error'])

// 响应式数据
const tableData = ref([])
const loading = ref(false)
const chartError = ref('')
const chartRef = ref(null)
let chartInstance = null
const total = ref(0)
const chartData = ref([])
const groupBy = ref('month') // 默认按月分组

// 计算环比增长率
const calculateGrowthRate = (data, index) => {
  if (index === 0) return 0
  
  const currentQuantity = data[index].total_quantity
  const previousQuantity = data[index - 1].total_quantity
  
  if (previousQuantity === 0) return currentQuantity > 0 ? 100 : 0
  
  return ((currentQuantity - previousQuantity) / previousQuantity) * 100
}

// 格式化日期
const formatDate = (date) => {
  if (!date) return ''
  
  try {
    const dateObj = new Date(date)
    return dateObj.toLocaleDateString('zh-CN')
  } catch (error) {
    return date.replace(/-/g, '/')
  }
}

// 格式化数量
const formatAmount = (amount) => {
  if (amount === null || amount === undefined || amount === '') return '0'
  
  const num = parseFloat(amount)
  if (isNaN(num)) return '0'
  
  return num.toLocaleString()
}

// 格式化数字（用于图表tooltip）
const formatNumber = (number) => {
  if (number === null || number === undefined || number === '') return '0'
  
  const num = parseFloat(number)
  if (isNaN(num)) return '0'
  
  return num.toLocaleString()
}

// 格式化增长率
const formatGrowthRate = (rate) => {
  if (rate === null || rate === undefined || rate === '') return '0.0%'
  
  const num = parseFloat(rate)
  if (isNaN(num)) return '0.0%'
  
  return `${num > 0 ? '+' : ''}${num.toFixed(1)}%`
}

// 格式化批准率
const formatApprovalRate = (rate) => {
  if (rate === null || rate === undefined || rate === '') return '0.0%'
  
  const num = parseFloat(rate)
  if (isNaN(num)) return '0.0%'
  
  return `${num.toFixed(1)}%`
}

// 初始化图表
const initChart = async () => {
  console.log('initChart chartRef.value:', chartRef.value)
  
  // 检查主容器是否可用，添加重试机制
  let container = null
  let retryCount = 0
  const maxRetries = 3
  
  while (!container && retryCount < maxRetries) {
    if (chartRef.value) {
      container = chartRef.value
      break
    }
    
    retryCount++
    console.warn(`图表容器未找到，第${retryCount}次尝试等待DOM更新后重试`)
    
    // 使用setTimeout增加等待时间，让DOM有足够时间更新
    await new Promise(resolve => setTimeout(resolve, 100 * retryCount))
    await nextTick()
  }
  
  if (!container) {
    console.error('多次重试后仍未找到图表容器')
    chartError.value = '图表容器未找到，请刷新页面重试'
    emit('error', chartError.value)
    return false
  }
  
  // 获取容器尺寸，用于更精确的自适应计算
  const containerWidth = container.offsetWidth
  const containerHeight = container.offsetHeight
  console.log('图表容器尺寸:', { containerWidth, containerHeight })
  
  // 如果已有实例，先销毁
  if (chartInstance) {
    chartInstance.dispose()
    chartInstance = null
  }
  
  try {
    chartInstance = echarts.init(container)
    
    const option = getChartOption()
    chartInstance.setOption(option)
    
    // 响应式处理
    const resizeChart = () => {
      if (chartInstance) {
        chartInstance.resize()
      }
    }
    
    window.addEventListener('resize', resizeChart)
    
    // 返回清理函数
    return () => {
      window.removeEventListener('resize', resizeChart)
      if (chartInstance) {
        chartInstance.dispose()
        chartInstance = null
      }
    }
  } catch (error) {
    console.error('图表初始化失败:', error)
    chartError.value = '图表初始化失败，请稍后重试'
    emit('error', chartError.value)
    return false
  }
}

// 获取图表配置
const getChartOption = () => {
  if (!chartData.value || chartData.value.length === 0) {
    return {
      title: {
        text: '暂无数据',
        left: 'center',
        top: 'middle',
        textStyle: {
          color: '#9CA3AF',
          fontSize: 16
        }
      },
      backgroundColor: 'transparent'
    }
  }
  
  // 准备数据 - 按日期排序
  const sortedData = [...chartData.value].sort((a, b) => new Date(a.period) - new Date(b.period))
  const xAxisData = sortedData.map(item => item.period)
  
  // 确保数据有效性，避免null或undefined
  const totalSeries = sortedData.map(item => {
    const value = parseFloat(item.total_quantity)
    return isNaN(value) ? 0 : value
  })
  const applicationCountSeries = sortedData.map(item => {
    const value = parseFloat(item.application_count)
    return isNaN(value) ? 0 : value
  })
  const avgSeries = sortedData.map(item => {
    const value = parseFloat(item.avg_quantity)
    return isNaN(value) ? 0 : value
  })
  
  // 调试信息：输出数据范围
  console.log('图表数据调试信息:')
  console.log('总数量范围:', Math.min(...totalSeries), '-', Math.max(...totalSeries))
  console.log('申请次数范围:', Math.min(...applicationCountSeries), '-', Math.max(...applicationCountSeries))
  console.log('平均数量范围:', Math.min(...avgSeries), '-', Math.max(...avgSeries))
  
  // 根据数据量动态计算柱状图宽度
  const dataCount = sortedData.length
  let barWidth = '40%' // 默认宽度
  let barMaxWidth = 60 // 默认最大宽度
  let barGap = '30%' // 默认间距
  let barCategoryGap = '20%' // 默认类目间距
  
  // 获取图表容器尺寸（如果可用）
  let containerWidth = 800 // 默认宽度
  if (chartRef.value) {
    containerWidth = chartRef.value.offsetWidth || 800
  }
  
  // 计算每个类目的理论宽度
  const categoryWidth = containerWidth / dataCount
  
  if (dataCount <= 5) {
    // 数据量很少时，使用较宽的柱状图
    barWidth = Math.min(categoryWidth * 0.6, 80) // 最大80px
    barMaxWidth = 80
    barGap = '20%'
    barCategoryGap = '30%'
  } else if (dataCount <= 10) {
    // 数据量适中时，使用标准宽度
    barWidth = Math.min(categoryWidth * 0.5, 60) // 最大60px
    barMaxWidth = 60
    barGap = '30%'
    barCategoryGap = '20%'
  } else if (dataCount <= 20) {
    // 数据量较多时，使用较窄的柱状图
    barWidth = Math.min(categoryWidth * 0.4, 40) // 最大40px
    barMaxWidth = 40
    barGap = '40%'
    barCategoryGap = '15%'
  } else {
    // 数据量很多时，使用最窄的柱状图
    barWidth = Math.min(categoryWidth * 0.3, 25) // 最大25px
    barMaxWidth = 25
    barGap = '50%'
    barCategoryGap = '10%'
  }
  
  // 确保柱状图不会太窄
  if (barWidth < 15) {
    barWidth = 15
    barMaxWidth = 15
  }
  
  console.log('柱状图宽度配置:', { dataCount, barWidth, barMaxWidth, barGap, barCategoryGap })
  
  return {
    backgroundColor: 'transparent',
    title: {
      text: '设备申请趋势分析',
      left: 'center',
      textStyle: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold'
      }
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross'
      },
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      borderColor: '#374151',
      textStyle: {
        color: '#FFFFFF'
      },
      formatter: function(params) {
        let html = `<div style="padding: 8px;">`
        html += `<div style="font-weight: bold; margin-bottom: 4px;">${params[0].axisValue}</div>`
        params.forEach(param => {
          html += `<div>${param.marker} ${param.seriesName}: <span style="color: ${param.color}; font-weight: bold;">${formatNumber(param.value)}</span></div>`
        })
        html += `</div>`
        return html
      }
    },
    legend: {
      data: ['总数量', '申请次数', '平均数量'],
      top: 40,
      textStyle: {
        color: '#FFFFFF'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '20%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: true, // 改为true，给柱状图留出边界间隙
      data: xAxisData,
      axisLine: {
        lineStyle: {
          color: '#6B7280'
        }
      },
      axisLabel: {
        color: '#9CA3AF',
        rotate: 45,
        interval: 0
      }
    },
    yAxis: [
      {
        type: 'value',
        name: '数量',
        nameTextStyle: { color: '#9CA3AF' },
        axisLine: {
          lineStyle: {
            color: '#6B7280'
          }
        },
        axisLabel: {
          color: '#9CA3AF',
          formatter: '{value}'
        },
        splitLine: {
          lineStyle: {
            color: '#374151',
            type: 'dashed'
          }
        },
        // 设置最小值和最大值，避免柱状图超出边界
        min: function(value) {
          return Math.max(0, Math.floor(value.min * 0.9))
        },
        max: function(value) {
          return Math.ceil(value.max * 1.1)
        }
      },
      {
        type: 'value',
        name: '申请次数/平均数量',
        nameTextStyle: { color: '#9CA3AF' },
        axisLine: {
          lineStyle: {
            color: '#6B7280'
          }
        },
        axisLabel: {
          color: '#9CA3AF',
          formatter: '{value}'
        },
        splitLine: {
          show: false
        },
        // 设置最小值和最大值，避免柱状图超出边界
        min: function(value) {
          return Math.max(0, Math.floor(value.min * 0.9))
        },
        max: function(value) {
          return Math.ceil(value.max * 1.1)
        }
      }
    ],
    series: [
      {
        name: '总数量',
        type: 'line',
        yAxisIndex: 0,
        data: totalSeries,
        smooth: true,
        lineStyle: {
          color: '#3B82F6',
          width: 3
        },
        itemStyle: {
          color: '#3B82F6'
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(59, 130, 246, 0.3)' },
            { offset: 1, color: 'rgba(59, 130, 246, 0.05)' }
          ])
        }
      },
      {
        name: '申请次数',
        type: 'bar',
        yAxisIndex: 1,
        data: applicationCountSeries,
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#10b981' },
            { offset: 1, color: '#059669' }
          ])
        },
        barWidth: barWidth,
        barMaxWidth: barMaxWidth, // 设置最大宽度，防止柱状图过宽
        // 添加柱状图显示优化配置
        barGap: barGap, // 柱状图之间的间距
        barCategoryGap: barCategoryGap, // 类目间的间距
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowColor: 'rgba(16, 185, 129, 0.5)'
          }
        },
      },
      {
        name: '平均数量',
        type: 'line',
        yAxisIndex: 1,
        data: avgSeries,
        smooth: true,
        lineStyle: {
          color: '#F59E0B',
          width: 2,
          type: 'dashed'
        },
        itemStyle: {
          color: '#F59E0B'
        },
        symbol: 'circle',
        symbolSize: 6
      }
    ]
  }
}

// 加载数据
const loadData = async () => {
  if (loading.value) return
  
  if (!props.startDate || !props.endDate) {
    return
  }
  
  loading.value = true
  chartError.value = ''
  emit('loading', true)
  
  try {
    // 构建查询参数 - 匹配API接口参数格式
    const params = {
      startDate: props.startDate,
      endDate: props.endDate,
      userName: props.userName || null,
      mainCategory: props.mainCategory || null,
      groupBy: groupBy.value // 添加分组参数
    }
    
    console.log('查询参数:', params)
    
    // 调用API
    const response = await getEquipmentTrend(params)
    
    if (response.success && response.data) {
      // 处理数据，添加环比增长率
      const processedData = response.data.map((item, index) => {
        const growthRate = calculateGrowthRate(response.data, index)
        return {
          ...item,
          growthRate: growthRate
        }
      })
      
      tableData.value = processedData
      chartData.value = processedData
      total.value = processedData.length || 0
      
      // 初始化图表
      await nextTick()
      await initChart()
      
    } else {
      tableData.value = []
      chartData.value = []
      total.value = 0
      ElMessage.warning('未获取到数据')
    }
  } catch (error) {
    console.error('加载设备申请趋势数据失败:', error)
    tableData.value = []
    chartData.value = []
    total.value = 0
    chartError.value = '数据加载失败，请稍后重试'
    emit('error', error)
    ElMessage.error('数据加载失败，请稍后重试')
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
const exportData = async () => {
  if (loading.value) {
    ElMessage.warning('数据加载中，请稍候再试')
    return
  }
  
  if (tableData.value.length === 0) {
    ElMessage.warning('暂无数据可导出')
    return
  }
  
  try {
    // 构建CSV数据
    const headers = ['时间段', '总数量', '申请次数', '平均数量', '环比']
    const csvContent = [
      headers.join(','),
      ...tableData.value.map((item, index) => [
        item.period || '',
        item.total_quantity || 0,
        item.application_count || 0,
        item.avg_quantity || 0,
        formatGrowthRate(calculateGrowthRate(tableData.value, index))
      ].join(','))
    ].join('\n')
    
    // 创建下载链接
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `设备申请趋势统计_${new Date().toLocaleString('zh-CN').replace(/[/:]/g, '-').replace(/ /g, '_')}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    
    ElMessage.success('数据导出成功')
  } catch (error) {
    console.error('导出失败:', error)
    ElMessage.error('数据导出失败')
  }
}

// 监听props变化
watch([() => props.startDate, () => props.endDate, () => props.userName, () => props.mainCategory, groupBy], () => {
  loadData()
}, { immediate: true })

// 暴露方法给父组件
defineExpose({
  refreshData,
  exportData
})

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.chart-container {
  width: 100%;
  height: 400px;
}
</style>