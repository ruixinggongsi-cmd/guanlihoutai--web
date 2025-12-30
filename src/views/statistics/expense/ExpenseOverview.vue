<!-- 费用概览统计组件 -->
<template>
  <div class="space-y-6">
    <!-- 图表显示 -->
    <div class="backdrop-blur-lg bg-white/10 rounded-2xl border border-white/20 shadow-xl p-6 transition-all duration-300 hover:shadow-2xl hover:bg-white/15 hover:translate-y-[-2px]">
      <div class="flex items-center justify-between mb-4">
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
            :disabled="!tableData || tableData.length === 0"
            class="px-4 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-400/30 rounded-lg transition-all duration-300 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <i class="fas fa-download"></i>
            <span>导出</span>
          </button>
        </div>
      </div>
      
      
      
      <div class="chart-container-wrapper">
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
      
      <div v-if="!chartData || chartData.length === 0" class="flex items-center justify-center h-96 text-gray-400">
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
                  item.statType === '部门' 
                    ? 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-300 border border-blue-400/30'
                    : 'bg-gradient-to-r from-purple-500/20 to-purple-600/20 text-purple-300 border border-purple-400/30'
                ]">
                  <i :class="[
                    'mr-1',
                    item.statType === '部门' ? 'fas fa-building text-blue-400' : 'fas fa-tag text-purple-400'
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
import { ref, reactive, onMounted, watch, nextTick } from 'vue'
import * as echarts from 'echarts'
import { getExpenseOverview } from '@/api/expenseStatistics'
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

// 获取图表配置
const getChartOption = (data) => {
  let overviewData = []
  
  // 检查数据结构
  if (data && typeof data === 'object' && !Array.isArray(data)) {
    // 如果返回的是分组数据对象
    const departmentData = data.department || data.departments || []
    const categoryData = data.category || data.categories || []
    
    // 合并部门数据和分类数据
    const allData = [
      ...departmentData.map((item, index) => ({
        name: item.department_name || item.name || `部门${index + 1}`,
        amount: parseFloat(item.total_amount || item.amount || 0),
        type: '部门',
        applicationCount: parseInt(item.application_count || item.applicationCount || 0),
        percentage: parseFloat(item.percentage || 0)
      })),
      ...categoryData.map((item, index) => ({
        name: item.category_name || item.name || `分类${index + 1}`,
        amount: parseFloat(item.total_amount || item.amount || 0),
        type: '分类',
        applicationCount: parseInt(item.application_count || item.applicationCount || 0),
        percentage: parseFloat(item.percentage || 0)
      }))
    ].sort((a, b) => b.amount - a.amount).slice(0, 10)
    
    overviewData = allData
  } else if (Array.isArray(data)) {
    // 如果已经是数组格式，直接使用
    overviewData = data.map((item, index) => ({
      name: item.name || item.department_name || item.category_name || '未知',
      amount: parseFloat(item.total_amount || item.amount || 0),
      type: item.stat_type || '其他',
      applicationCount: parseInt(item.application_count || item.applicationCount || 0),
      percentage: parseFloat(item.percentage || 0)
    })).sort((a, b) => b.amount - a.amount).slice(0, 10)
  } else {
    overviewData = []
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
              <div class="w-3 h-3 rounded-full" style="background: ${dataItem.type === '部门' ? '#6366f1' : dataItem.type === '分类' ? '#ec4899' : '#10b981'}"></div>
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
    if (!data || data.length === 0) {
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
      endDate: props.endDate
    }
    
    if (props.userName) {
      params.userName = props.userName
    }
    
    if (props.mainCategory) {
      params.mainCategory = props.mainCategory
    }
    
    console.log('费用概览查询参数:', params)
    const res = await getExpenseOverview(params)
    
    if (res.success) {
       loading.value = false
      const data = res.data || []
      chartData.value = data
      
      // 处理表格数据
      let tableItems = []
      if (data && typeof data === 'object' && !Array.isArray(data)) {
        const departmentData = data.department || data.departments || []
        const categoryData = data.category || data.categories || []
        
        tableItems = [
          ...departmentData.map((item, index) => ({
            id: `dept_${index}`,
            statType: '部门',
            name: item.department_name || item.name || `部门${index + 1}`,
            totalAmount: parseFloat(item.total_amount || item.amount || 0),
            applicationCount: parseInt(item.application_count || item.applicationCount || 0),
            percentage: parseFloat(item.percentage || 0)
          })),
          ...categoryData.map((item, index) => ({
            id: `cat_${index}`,
            statType: '分类',
            name: item.category_name || item.name || `分类${index + 1}`,
            totalAmount: parseFloat(item.total_amount || item.amount || 0),
            applicationCount: parseInt(item.application_count || item.applicationCount || 0),
            percentage: parseFloat(item.percentage || 0)
          }))
        ].sort((a, b) => b.totalAmount - a.totalAmount)
      } else if (Array.isArray(data)) {
        tableItems = data.map((item, index) => ({
          id: `item_${index}`,
          statType: item.stat_type || '其他',
          name: item.name || '未知',
          totalAmount: parseFloat(item.total_amount || item.amount || 0),
          applicationCount: parseInt(item.application_count || item.applicationCount || 0),
          percentage: parseFloat(item.percentage || 0)
        })).sort((a, b) => b.totalAmount - a.totalAmount)
      }
      
      // 按总金额排序，降序排列
      tableData.value = tableItems.sort((a, b) => b.totalAmount - a.totalAmount)
      total.value = tableItems.length
      await nextTick()
      const updateSuccess = await updateChart(data)
      
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
  if (tableData.value.length === 0) {
    ElMessage.warning('暂无数据可导出')
    return
  }
  
  const exportData = tableData.value.map((item, index) => ({
    '序号': index + 1,
    '统计类型': item.statType,
    '名称': item.name,
    '总金额': item.totalAmount,
    '申请数量': item.applicationCount,
    '占比': `${item.percentage}%`
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
  link.download = `费用概览统计_${new Date().toLocaleDateString('zh-CN')}.csv`
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

onMounted(() => {
  // 先加载数据，数据加载后会自动初始化和更新图表
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