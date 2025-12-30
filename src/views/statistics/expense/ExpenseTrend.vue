<!-- 费用趋势统计组件 -->
<template>
  <div class="space-y-6">
    <!-- 图表显示 -->
    <div class="backdrop-blur-lg bg-white/10 rounded-2xl border border-white/20 shadow-xl p-6 transition-all duration-300 hover:shadow-2xl hover:bg-white/15 hover:translate-y-[-2px]">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-xl font-bold text-white flex items-center">
          <i class="fas fa-chart-line mr-3 text-primary"></i>
          费用趋势统计
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
              <th scope="col" class="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">总费用</th>
              <th scope="col" class="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">申请数量</th>
              <th scope="col" class="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">平均费用</th>
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
                <span class="px-3 py-1.5 bg-gradient-to-r from-emerald-500/20 to-green-500/20 text-emerald-300 border border-emerald-400/30 rounded-full text-sm font-bold backdrop-blur-sm">
                  {{ formatAmount(item.totalAmount) }}
                </span>
              </td>
              <td class="px-6 py-4 text-gray-400">
                {{ item.applicationCount }}
              </td>
              <td class="px-6 py-4 text-gray-400">
                <span class="px-3 py-1.5 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-300 border border-blue-400/30 rounded-full text-xs font-medium backdrop-blur-sm">
                  {{ formatAmount(item.avgAmount) }}
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
import { ref, reactive, onMounted, watch, nextTick, computed } from 'vue'
import * as echarts from 'echarts'
import { getExpenseTrend } from '@/api/expenseStatistics'
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
const groupBy = ref('month') // 默认按月分组

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
  // 安全检查 - 只有当chartRef和DOM都可用时才初始化
  if (!chartRef.value) {
    console.error('图表容器未找到')
    return false
  }
  
  try {
    // 先处理已存在的实例
    if (chartInstance) {
      chartInstance.dispose()
      chartInstance = null
    }
    
    // 确保容器有实际尺寸
    const container = chartRef.value
    const rect = container.getBoundingClientRect()
    if (rect.width <= 0 || rect.height <= 0) {
      // 强制设置尺寸，确保图表能正确渲染
      container.style.width = '100%'
      container.style.height = '100%'
    }
    
    chartInstance = echarts.init(container)
    console.log('图表初始化成功')
    return true
  } catch (error) {
    console.error('图表初始化失败:', error)
    // 发生错误时清理实例
    if (chartInstance) {
      try { chartInstance.dispose(); } catch (e) {}
      chartInstance = null
    }
    return false
  }
}

// 获取图表配置
const getChartOption = (data) => {
  const trendData = Array.isArray(data) ? data : (data.data || [])
  
  // 按时间排序
  const sortedData = trendData
    .map(item => ({
      period: item.period || item.time_period || item.timePeriod || '未知',
      totalAmount: parseFloat(item.total_amount || item.totalAmount || 0),
      applicationCount: parseInt(item.application_count || item.applicationCount || 0),
      avgAmount: parseFloat(item.avg_amount || item.avgAmount || 0)
    }))
    .sort((a, b) => a.period.localeCompare(b.period))
  
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
        const dataItem = sortedData[item.dataIndex]
        return `
          <div class="p-3 space-y-2">
            <div class="font-semibold text-white">${item.name}</div>
            <div class="flex items-center space-x-2">
              <div class="w-3 h-3 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600"></div>
              <span>总费用: ${formatAmount(dataItem.totalAmount)}</span>
            </div>
            <div class="flex items-center space-x-2">
              <div class="w-3 h-3 rounded-full bg-gradient-to-r from-emerald-500 to-green-500"></div>
              <span>申请数量: ${dataItem.applicationCount}</span>
            </div>
            <div class="flex items-center space-x-2">
              <div class="w-3 h-3 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500"></div>
              <span>平均费用: ${formatAmount(dataItem.avgAmount)}</span>
            </div>
          </div>
        `
      }
    },
    legend: {
      data: ['总费用', '申请数量'],
      textStyle: { 
        color: '#94a3b8',
        fontSize: 12,
        fontWeight: 500
      },
      top: 10,
      itemWidth: 10,
      itemHeight: 10,
      itemGap: 20,
      icon: 'circle'
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '10%',
      top: '15%',
      containLabel: true,
      backgroundColor: 'transparent'
    },
    xAxis: {
      type: 'category',
      data: sortedData.map(item => item.period),
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
        rotate: sortedData.length > 12 ? 45 : 0,
        padding: [10, 0, 0, 0],
        interval: 0,
        formatter: function(value) {
          // 根据数据量调整显示内容
          if (groupBy.value === 'day' && sortedData.length > 30) {
            // 大数据量时只显示部分标签
            return value.slice(5)
          }
          return value
        }
      }
    },
    yAxis: [
      {
        type: 'value',
        name: '费用金额',
        nameTextStyle: { 
          color: '#94a3b8',
          fontSize: 11,
          padding: [0, 0, 0, 20]
        },
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
      {
        type: 'value',
        name: '申请数量',
        nameTextStyle: { 
          color: '#94a3b8',
          fontSize: 11,
          padding: [0, 20, 0, 0]
        },
        axisLine: { show: false },
        axisTick: { show: false },
        splitLine: { show: false },
        axisLabel: { 
          color: '#94a3b8', 
          fontSize: 11
        }
      }
    ],
    series: [
      {
        name: '总费用',
        type: 'line',
        data: sortedData.map(item => item.totalAmount),
        smooth: true,
        smoothMonotone: 'x', // 保持在x轴方向上的单调性，使平滑更自然
        lineStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
            { offset: 0, color: '#6366f1' },
            { offset: 1, color: '#8b5cf6' }
          ]),
          width: 3,
          shadowBlur: 10,
          shadowColor: 'rgba(99, 102, 241, 0.5)',
          shadowOffsetX: 0,
          shadowOffsetY: 0
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(99, 102, 241, 0.3)' },
            { offset: 1, color: 'rgba(99, 102, 241, 0.05)' }
          ])
        },
        symbol: 'circle',
        symbolSize: 6,
        itemStyle: {
          color: '#6366f1',
          borderColor: '#fff',
          borderWidth: 2,
          shadowBlur: 5,
          shadowColor: 'rgba(99, 102, 241, 0.5)'
        },
        emphasis: {
          itemStyle: {
            symbolSize: 8,
            borderWidth: 2
          }
        },
        animationDuration: 1500,
        animationEasing: 'elasticOut'
      },
      {
        name: '申请数量',
        type: 'bar',
        yAxisIndex: 1,
        data: sortedData.map(item => item.applicationCount),
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#10b981' },
            { offset: 1, color: '#059669' }
          ]),
          borderRadius: [4, 4, 0, 0]
        },
        barWidth: '40%',
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowColor: 'rgba(16, 185, 129, 0.5)'
          }
        },
        animationDuration: 1500,
        animationDelay: function (idx) {
          return idx * 50
        },
        animationEasing: 'cubicOut'
      }
    ],
    animation: true,
    animationDuration: 2000,
    animationEasing: 'cubicOut'
  }
  
  return baseOption
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
      axisLine: { lineStyle: { color: 'rgba(148, 163, 184, 0.3)' } },
      axisLabel: { color: '#94a3b8', fontSize: 11 }
    },
    yAxis: [
      {
        type: 'value',
        name: '费用金额',
        nameTextStyle: { 
          color: '#94a3b8',
          fontSize: 11,
          padding: [0, 0, 0, 20]
        },
        axisLine: { show: false },
        splitLine: { lineStyle: { color: 'rgba(148, 163, 184, 0.1)' } },
        axisLabel: { 
          color: '#94a3b8', 
          fontSize: 11,
          formatter: '{value}'
        }
      },
      {
        type: 'value',
        name: '申请数量',
        nameTextStyle: { 
          color: '#94a3b8',
          fontSize: 11,
          padding: [0, 20, 0, 0]
        },
        axisLine: { show: false },
        splitLine: { show: false },
        axisLabel: { color: '#94a3b8', fontSize: 11 }
      }
    ],
    series: [
      {
        name: '总费用',
        type: 'line',
        data: [],
        smooth: true,
        smoothMonotone: 'x', // 保持在x轴方向上的单调性
        lineStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
            { offset: 0, color: '#6366f1' },
            { offset: 1, color: '#8b5cf6' }
          ]),
          width: 3
        }
      },
      {
        name: '申请数量',
        type: 'line',
        data: [],
        smooth: true,
        smoothMonotone: 'x', // 保持在x轴方向上的单调性
        lineStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
            { offset: 0, color: '#10b981' },
            { offset: 1, color: '#059669' }
          ]),
          width: 3
        }
      }
    ]
  }
}

// 更新图表
const updateChart = async (data) => {
  try {
    // 确保DOM已经更新
    await nextTick()
    
    // 只有当数据存在且容器可见时才初始化图表
    if (!chartRef.value || (!data || data.length === 0)) {
      if (chartInstance) {
        chartInstance.dispose()
        chartInstance = null
      }
      return true
    }
    
    // 检查并初始化图表实例
    if (!chartInstance) {
      const initialized = await initChart()
      if (!initialized) {
        console.error('图表初始化失败，无法更新图表')
        return false
      }
    }
    
    // 安全检查
    if (!chartInstance) return false
    
    // 更新图表数据
    chartInstance.setOption(getChartOption(data))
    console.log('图表更新成功')
    return true
  } catch (error) {
    console.error('图表更新失败:', error)
    // 发生错误时清理实例，防止下次更新继续出错
    if (chartInstance) {
      try { chartInstance.dispose(); } catch (e) {}
      chartInstance = null
    }
    return false
  }
}

// 计算环比增长率
const calculateGrowthRate = (data, index) => {
  if (index === 0) return 0
  
  const currentAmount = data[index].totalAmount
  const previousAmount = data[index - 1].totalAmount
  
  if (previousAmount === 0) return currentAmount > 0 ? 100 : 0
  
  return ((currentAmount - previousAmount) / previousAmount) * 100
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
      groupBy: groupBy.value
    }
    
    if (props.userName) {
      params.userName = props.userName
    }
    
    if (props.mainCategory) {
      params.mainCategory = props.mainCategory
    }
    
    console.log('费用趋势查询参数:', params)
    const res = await getExpenseTrend(params)
    
    if (res.success) {
      const data = res.data || []
      chartData.value = data
      
      // 处理表格数据
      tableData.value = Array.isArray(data) ? data.map((item, index) => ({
        id: `trend_${index}`,
        period: item.period || item.time_period || item.timePeriod || '未知',
        totalAmount: parseFloat(item.total_amount || item.totalAmount || 0),
        applicationCount: parseInt(item.application_count || item.applicationCount || 0),
        avgAmount: parseFloat(item.avg_amount || item.avgAmount || 0),
        growthRate: 0 // 将在后续计算
      })).sort((a, b) => a.period.localeCompare(b.period)) : []
      console.log('处理后的表格数据:', tableData.value)
      // 计算环比增长率
      tableData.value.forEach((item, index) => {
        item.growthRate = calculateGrowthRate(tableData.value, index)
      })
      
      // 按时间段从新到旧排序
      tableData.value = tableData.value.reverse()
      console.log('排序后的表格数据:', tableData.value)

      // 使用增强的更新逻辑，包含重试机制
      await nextTick()
      let updateSuccess = false
      let retryCount = 0
      const maxRetries = 2
      
      while (!updateSuccess && retryCount < maxRetries) {
        retryCount++
        console.log(`尝试更新图表（第${retryCount}次）`)
        
        // 每次尝试前先等待DOM更新
        if (retryCount > 1) {
          await new Promise(resolve => setTimeout(resolve, 200))
          await nextTick()
          
          // 如果是重试，先销毁现有实例
          if (chartInstance) {
            chartInstance.dispose()
            chartInstance = null
          }
        }
        
        updateSuccess = await updateChart(chartData.value)
        if (updateSuccess) break
      }
      
      if (!updateSuccess) {
        console.error('多次尝试后仍无法更新图表')
        chartError.value = '图表更新失败，请刷新页面重试'
        emit('error', chartError.value)
      }

      // 更新总数
      total.value = tableData.value.length
     
    } else {
      chartError.value = res.message || '获取数据失败'
      emit('error', chartError.value)
    }
  } catch (error) {
    console.error('费用趋势查询失败:', error)
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
  if (tableData.value.length === 0) {
    ElMessage.warning('暂无数据可导出')
    return
  }
  
  const exportData = tableData.value.map((item, index) => ({
    '序号': index + 1,
    '时间段': item.period,
    '总费用': item.totalAmount,
    '申请数量': item.applicationCount,
    '平均费用': item.avgAmount,
    '环比增长率': `${item.growthRate > 0 ? '+' : ''}${item.growthRate.toFixed(1)}%`
  }))
  
  const headers = Object.keys(exportData[0])
  const csvContent = [
    headers.join(','),
    ...exportData.map(row => 
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
  link.download = `费用趋势统计_${new Date().toLocaleDateString('zh-CN')}.csv`
  link.click()
  
  ElMessage.success('导出成功')
}

// 监听参数变化
watch([() => props.startDate, () => props.endDate, () => props.userName, () => props.mainCategory, groupBy], () => {
  loadData()
})

// 监听窗口大小变化
const handleResize = () => {
  if (chartInstance) {
    chartInstance.resize()
  }
}

onMounted(() => {
  initChart()
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

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}
</style>