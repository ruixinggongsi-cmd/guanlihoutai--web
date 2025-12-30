<!-- 用户费用总额统计组件 -->
<template>
  <div class="space-y-6">
    <!-- 图表显示 -->
    <div class="backdrop-blur-lg bg-white/10 rounded-2xl border border-white/20 shadow-xl p-6">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-xl font-bold text-white flex items-center">
          <i class="fas fa-user-dollar mr-3 text-primary"></i>
          用户费用总额统计
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
      
      <div v-if="!chartData || chartData.length === 0" class="flex items-center justify-center h-96 text-gray-400">
        <div class="text-center space-y-4">
          <i class="fas fa-inbox text-4xl opacity-50"></i>
          <p class="text-lg">暂无数据</p>
          <p class="text-sm text-gray-500">请调整查询条件后重试</p>
        </div>
      </div>
      
      <div v-if="!loading" ref="chartRef" class="chart-container">
          
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
              <th scope="col" class="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">用户姓名</th>
              <th scope="col" class="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">部门</th>
              <th scope="col" class="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">总金额</th>
              <th scope="col" class="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">申请数量</th>
              <th scope="col" class="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">平均金额</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in tableData" :key="item.id" class="border-b border-white/10 hover:bg-white/5 transition-colors duration-200">
              <td class="px-6 py-4">
                <span class="text-white font-semibold text-sm">
                  {{ item.userName }}
                </span>
              </td>
              <td class="px-6 py-4 text-gray-400">
                {{ item.departmentName || '-' }}
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
                  {{ formatAmount(item.avgAmount) }}
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
import { ref, reactive, onMounted, watch, nextTick } from 'vue'
import * as echarts from 'echarts'
import { getUserExpenseTotal } from '@/api/expenseStatistics'
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
  
  // 确保容器有实际尺寸
  const rect = container.getBoundingClientRect()
  if (rect.width <= 0 || rect.height <= 0) {
    console.warn('图表容器尺寸无效，可能被隐藏或样式未正确应用')
    // 尝试设置最小尺寸
    container.style.minWidth = '400px'
    container.style.minHeight = '300px'
    
    // 再次检查尺寸
    const newRect = container.getBoundingClientRect()
    if (newRect.width <= 0 || newRect.height <= 0) {
      console.error('图表容器尺寸仍然无效')
      chartError.value = '图表容器尺寸无效'
      emit('error', chartError.value)
      return false
    }
  }
  
  if (chartInstance) {
    chartInstance.dispose()
    chartInstance = null
  }
  
  try {
    chartInstance = echarts.init(container)
    console.log('图表初始化成功')
    return true
  } catch (error) {
    console.error('图表初始化失败:', error)
    chartError.value = '图表初始化失败'
    emit('error', chartError.value)
    return false
  }
}

// 获取图表配置
const getChartOption = (data) => {
  console.log('chartData:', data) 
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
      formatter: function(params) {
        const item = params[0]
        return `
          <div class="p-3 space-y-2">
            <div class="font-semibold text-white">${item.name}</div>
            <div class="flex items-center space-x-2">
              <div class="w-3 h-3 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600"></div>
              <span>费用总额: ${formatAmount(item.value)}</span>
            </div>
          </div>
        `
      },
      padding: 12,
      borderWidth: 1,
      borderColor: 'rgba(99, 102, 241, 0.5)',
      shadowBlur: 10,
      shadowColor: 'rgba(0, 0, 0, 0.3)'
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '8%', // 增加底部空间
      top: '12%',
      containLabel: true,
      backgroundColor: 'transparent'
    },
    xAxis: {
      type: 'category',
      data: data.map(item => item.userName || item.user_name || item.name || '未知用户'),
      axisLine: { lineStyle: { color: 'rgba(148, 163, 184, 0.3)' } },
      axisLabel: { 
        color: '#94a3b8', 
        fontSize: 12, // 增大字体
        interval: 0, // 强制显示所有标签
        rotate: 30, // 旋转标签避免重叠
        fontWeight: '500'
      },
      axisTick: {
        show: true,
        length: 6,
        lineStyle: {
          color: 'rgba(148, 163, 184, 0.2)'
        }
      }
    },
    yAxis: {
      type: 'value',
      axisLine: { show: false },
      splitLine: {
        lineStyle: {
          color: 'rgba(148, 163, 184, 0.1)',
          type: 'dashed'
        }
      },
      axisLabel: { 
        color: '#94a3b8', 
        fontSize: 12,
        formatter: '{value}',
        fontWeight: '500'
      },
      axisTick: {
        show: false
      }
    },
    series: [{
      name: '费用总额',
      type: 'bar',
      data: data.map(item => ({
        value: parseFloat(item.totalAmount || item.total_amount || item.amount || 0),
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#6366f1' },
            { offset: 1, color: '#8b5cf6' }
          ])
        }
      })),
      barWidth: '60%', // 增加柱子宽度
      itemStyle: {
        borderRadius: [8, 8, 0, 0], // 增大圆角
        shadowBlur: 12, // 添加阴影
        shadowColor: 'rgba(99, 102, 241, 0.5)', // 阴影颜色
        shadowOffsetY: 4 // 阴影偏移
      },
      emphasis: {
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#818cf8' },
            { offset: 1, color: '#a78bfa' }
          ]),
          shadowBlur: 20,
          shadowColor: 'rgba(99, 102, 241, 0.8)'
        },
        animationDuration: 200 // 悬停动画持续时间
      },
      animationEasing: 'elasticOut',
      animationDelay: function (idx) {
        return idx * 100;
      },
      // 在柱子顶部显示数值标签
      label: {
        show: true,
        position: 'top',
        formatter: function(params) {
          return formatAmount(params.value);
        },
        color: '#e2e8f0',
        fontSize: 11,
        fontWeight: 'bold',
        distance: 8,
        backgroundColor: 'rgba(15, 23, 42, 0.7)',
        padding: [4, 8],
        borderRadius: 4
      }
    }]
  }
  
  return baseOption
}

// 更新图表
const updateChart = async (data) => {
  console.log('updateChart data:', data)
  
  // 确保DOM已经更新
  await nextTick()
  
  // 检查并初始化图表实例
  
    const initialized = await initChart()
    if (!initialized) {
      console.error('图表初始化失败，无法更新图表')
      chartError.value = '图表初始化失败'
      return false
    }
 
  
  console.log('chartInstance:', chartInstance)
  if (!chartInstance) return false
  
  try {
    if (!data || data.length === 0) {
      chartInstance.setOption(getEmptyChartOption())
    } else {
      chartInstance.setOption(getChartOption(data))
    }
    console.log('图表更新成功')
    return true
  } catch (error) {
    console.error('图表更新失败:', error)
    chartError.value = '图表更新失败'
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
        fontSize: 16
      }
    },
    xAxis: {
      type: 'category',
      data: [],
      axisLine: { lineStyle: { color: 'rgba(148, 163, 184, 0.3)' } },
      axisLabel: { color: '#94a3b8', fontSize: 11 }
    },
    yAxis: {
      type: 'value',
      axisLine: { show: false },
      splitLine: { lineStyle: { color: 'rgba(148, 163, 184, 0.1)' } },
      axisLabel: { color: '#94a3b8', fontSize: 11 }
    },
    series: [{
      name: '费用总额',
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
      endDate: props.endDate
    }
    
    if (props.userName) {
      params.userName = props.userName
    }
    
    if (props.mainCategory) {
      params.mainCategory = props.mainCategory
    }
    
    console.log('用户费用总额查询参数:', params)
    const res = await getUserExpenseTotal(params)
    
    if (res.success) {
      loading.value = false
      const data = res.data || []
      chartData.value = data
      tableData.value = data.map((item, index) => ({
        id: `${item.user_id || item.userName || 'unknown'}_${Date.now()}_${index}`,
        userName: item.user_name || item.userName || item.name || '-',
        departmentName: item.department_name || item.departmentName || '-',
        totalAmount: parseFloat(item.total_amount || item.totalAmount || item.amount || 0),
        applicationCount: parseInt(item.application_count || item.applicationCount || 0),
        avgAmount: parseFloat(item.avg_amount || item.avgAmount || 0)
      }))
      total.value = data.length
      console.log('用户费用总额查询成功:', data)
      
      // 等待DOM更新，确保图表容器可能被渲染
      await nextTick()
      
      // 使用增强的更新逻辑，包含重试机制
      let updateSuccess = false
      let retryCount = 0
      const maxRetries = 2
       updateSuccess = await updateChart(data)
     
    } else {
      chartError.value = res.message || '获取数据失败'
      emit('error', chartError.value)
    }
  } catch (error) {
    console.error('用户费用总额查询失败:', error)
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
    '用户姓名': item.userName,
    '部门': item.departmentName,
    '总金额': item.totalAmount,
    '申请数量': item.applicationCount,
    '平均金额': item.avgAmount
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
  link.download = `用户费用总额统计_${new Date().toLocaleDateString('zh-CN')}.csv`
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
  // 等待DOM完全渲染，增加一个小延迟确保父组件也完成渲染
  await nextTick()
  await new Promise(resolve => setTimeout(resolve, 100))
  
  // 先加载数据，确保图表容器可能被渲染
  loadData()
  
  // 添加窗口大小变化监听
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
.chart-container {
  position: relative;
  width: 100%;
  height: 500px;
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}
</style>