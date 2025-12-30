<!-- 用户分类费用占比组件 -->
<template>
  <div class="space-y-6">
    <!-- 图表显示 -->
    <div class="backdrop-blur-lg bg-white/10 rounded-2xl border border-white/20 shadow-xl p-6 transition-all duration-500 hover:shadow-primary/20">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-xl font-bold text-white flex items-center">
          <i class="fas fa-users mr-3 text-primary"></i>
          用户分类费用占比
        </h3>
        <div class="flex space-x-2">
          <button
            @click="refreshData"
            class="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all duration-300 flex items-center space-x-2"
            :disabled="loading"
          >
            <i class="fas fa-sync-alt" :class="{ 'fa-spin': loading }"></i>
            <span>刷新</span>
          </button>
          <button
            @click="exportData"
            class="px-4 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-400/30 rounded-lg transition-all duration-300 flex items-center space-x-2"
            :disabled="tableData.length === 0"
          >
            <i class="fas fa-download"></i>
            <span>导出</span>
          </button>
        </div>
      </div>
      
      
      
      <div class="chart-container-wrapper fade-in">
        <div v-if="loading" class="flex items-center justify-center h-96 text-gray-400">
          <div class="text-center space-y-4">
            <i class="fas fa-spinner fa-spin text-4xl"></i>
            <p>图表加载中...</p>
          </div>
        </div>
        
        <div v-if="chartError" class="flex items-center justify-center h-96 text-red-400">
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
            <p class="text-sm text-gray-500">请选择具体用户后查看分类占比</p>
          </div>
        </div>
        
        <div v-show="!loading && !chartError && chartData && chartData.length > 0" ref="chartRef" style="width: 100%; height: 500px;"></div>
      </div>
    </div>
    
    <!-- 数据列表 -->
    <div class="backdrop-blur-lg bg-white/10 rounded-2xl border border-white/20 shadow-xl p-6 transition-all duration-500 hover:shadow-primary/20">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold text-white">详细数据</h3>
        <span class="text-sm text-gray-400">共 {{ total }} 条记录</span>
      </div>
      
      <div class="overflow-x-auto">
        <table class="w-full text-sm text-left">
          <thead class="text-xs text-gray-400 uppercase bg-white/5">
            <tr>
              <th scope="col" class="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">用户</th>
               <th scope="col" class="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">主分类</th>
              <th scope="col" class="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">子分类</th>
              <th scope="col" class="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">总金额</th>
              <th scope="col" class="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">申请数量</th>
              <th scope="col" class="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">占比</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in paginatedData" :key="`${item.userName}_${item.main_category_name}_${item.sub_category_name}`" class="border-b border-white/10 hover:bg-white/5 transition-colors duration-200">
              <td class="px-6 py-4">
                <div class="flex items-center space-x-2">
                  <div class="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                    {{ item.userName.substring(0, 1) }}
                  </div>
                  <span class="text-white font-semibold text-sm">
                    {{ item.userName }}
                  </span>
                </div>
              </td>
               <td class="px-6 py-4">
                <span class="px-3 py-1.5 bg-gradient-to-r from-purple-500/20 to-purple-600/20 text-purple-300 border border-purple-400/30 rounded-full text-xs font-medium backdrop-blur-sm">
                  <i class="fas fa-tag mr-1 text-purple-400"></i>
                  {{ item.main_category_name }}
                </span>
              </td>
              <td class="px-6 py-4">
                <span class="px-3 py-1.5 bg-gradient-to-r from-purple-500/20 to-purple-600/20 text-purple-300 border border-purple-400/30 rounded-full text-xs font-medium backdrop-blur-sm">
                  <i class="fas fa-tag mr-1 text-purple-400"></i>
                  {{ item.sub_category_name }}
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
            <tr v-if="paginatedData.length === 0">
              <td colspan="6" class="px-6 py-8 text-center text-gray-400">
                <div class="flex flex-col items-center justify-center space-y-4">
                  <i class="fas fa-inbox text-4xl text-gray-500 opacity-50"></i>
                  <p class="text-lg">暂无数据</p>
                  <p class="text-sm text-gray-500">请选择具体用户后查看分类占比</p>
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
import { ref, reactive, onMounted, onUnmounted, watch, nextTick, computed } from 'vue'
import * as echarts from 'echarts'
import { getUserCategoryBreakdown } from '@/api/expenseStatistics'
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
    required: true
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
const currentPage = ref(1)
const pageSize = ref(10)

// 计算分页数据
const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return tableData.value.slice(start, end)
})

// 计算总页数
const totalPages = computed(() => {
  return Math.ceil(total.value / pageSize.value)
})

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
  
  // 如果已有实例，先销毁
  if (chartInstance) {
    chartInstance.dispose()
    chartInstance = null
  }
  
  // 检查容器是否存在且尺寸有效
  if (!container) {
    console.warn('图表容器未找到')
    chartError.value = '图表容器初始化失败'
    emit('error', chartError.value)
    return false
  }
  
  try {
    // 确保容器有正确的尺寸
    if (container.offsetWidth === 0 || container.offsetHeight === 0) {
      console.warn('图表容器尺寸无效，等待重试')
      await new Promise(resolve => setTimeout(resolve, 200))
    }
    
    chartInstance = echarts.init(container)
    console.log('图表初始化成功')
    
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
const getChartOption = (data) => {
  if (!data || data.length === 0) {
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
  
  // 按用户分组，每个用户显示其分类组合数据（类似设备分类组件的逻辑）
  const userGroups = {}
  data.forEach(item => {
    const userName = item.userName || item.user_name || item.name || '未知用户'
    if (!userGroups[userName]) {
      userGroups[userName] = {
        user_name: userName,
        categories: {},
        total_amount: 0
      }
    }
    const categoryKey = `${item.main_category_name || '主分类'}-${item.sub_category_name || '子分类'}`
    if (!userGroups[userName].categories[categoryKey]) {
      userGroups[userName].categories[categoryKey] = {
        category_key: categoryKey,
        main_category_name: item.main_category_name || '主分类',
        sub_category_name: item.sub_category_name || '子分类',
        total_amount: 0
      }
    }
    const amount = parseFloat(item.total_amount || item.totalAmount || item.amount || 0)
    userGroups[userName].categories[categoryKey].total_amount += amount
    userGroups[userName].total_amount += amount
  })
  
  // 按用户总金额排序，取前10个用户
  const sortedUsers = Object.values(userGroups)
    .sort((a, b) => b.total_amount - a.total_amount)
    .slice(0, 10)
  
  // 获取所有分类组合
  const allCategories = new Set()
  sortedUsers.forEach(user => {
    Object.keys(user.categories).forEach(categoryKey => {
      allCategories.add(categoryKey)
    })
  })
  
  const categoryArray = Array.from(allCategories).slice(0, 8) // 限制分类数量避免图表过于复杂
  
  const xAxisData = sortedUsers.map(item => item.user_name)
  
  // 为每个分类组合创建系列数据，使用堆叠柱状图并过滤空值
  const series = categoryArray.map((categoryKey, index) => {
    const categoryData = sortedUsers.map(user => {
      return user.categories[categoryKey] ? user.categories[categoryKey].total_amount : '-'
    })
    
    // 生成不同颜色
    const colors = [
      ['#10B981', '#059669'],
      ['#3B82F6', '#2563EB'],
      ['#8B5CF6', '#7C3AED'],
      ['#F59E0B', '#D97706'],
      ['#EF4444', '#DC2626'],
      ['#06B6D4', '#0891B2'],
      ['#84CC16', '#65A30D'],
      ['#F97316', '#EA580C']
    ]
    const colorPair = colors[index % colors.length]
    
    return {
      name: categoryKey,
      type: 'bar',
      data: categoryData,
      stack: 'total',
      itemStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: colorPair[0] },
          { offset: 1, color: colorPair[1] }
        ])
      },
      barWidth: '60%',
      emphasis: {
        focus: 'series'
      }
    }
  })
  
  const baseOption = {
    backgroundColor: 'transparent',
    textStyle: {
      color: '#e2e8f0',
      fontFamily: 'Inter, system-ui, sans-serif'
    },
    // 添加动画配置
    animation: true,
    animationDuration: 1500, // 增加动画时长，使效果更流畅
    animationEasing: 'cubicOut',
    animationDelay: function (idx) {
      return idx * 30;
    },
    // 增强tooltip样式
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      },
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      borderColor: '#374151',
      textStyle: {
        color: '#FFFFFF'
      },
      formatter: function(params) {
        const userIndex = params[0].dataIndex
        const userName = xAxisData[userIndex]
        const user = sortedUsers[userIndex]
        
        let content = `<div style="padding: 8px;">
          <div style="font-weight: bold; margin-bottom: 4px;">${userName}</div>`
        
        // 只显示该用户实际拥有的分类组合（值不为'-'且大于0）
        params.forEach(param => {
          if (param.value !== '-' && param.value > 0) {
            content += `<div>${param.seriesName}: ${formatAmount(param.value)}</div>`
          }
        })
        
        content += `<div style="margin-top: 4px; font-weight: bold;">总计: ${formatAmount(user.total_amount)}</div></div>`
        return content
      }
    },
    title: {
      text: '用户分类费用分布统计',
      left: 'center',
      textStyle: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold'
      }
    },
    legend: {
      data: categoryArray,
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
    yAxis: {
      type: 'value',
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
      }
    },
    series: series
  }
  
  return baseOption
}

// 更新图表
const updateChart = async (data) => {
  // 确保DOM完全更新
  await nextTick()
  
  // 等待一小段时间确保容器完全渲染
  await new Promise(resolve => setTimeout(resolve, 100))

  if (!chartInstance) {
    const initialized = await initChart()
    if (!initialized) {
      console.error('图表初始化失败，无法更新图表')
      chartError.value = '图表初始化失败'
      return false
    }
  }

  try {
    const option = (!data || data.length === 0) ? getEmptyChartOption() : getChartOption(data)
    chartInstance.setOption(option, true) // 使用true强制重新渲染
    console.log('图表更新成功')
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
        fontWeight: 'normal'
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
      splitLine: { lineStyle: { color: 'rgba(148, 163, 184, 0.1)', type: 'dashed' } },
      axisLabel: {
        color: '#94a3b8',
        fontSize: 11,
        formatter: function(value) {
          if (value >= 10000) {
            return `${(value / 10000).toFixed(1)}万`;
          }
          return `${value}`;
        }
      }
    },
    series: []
  }
}

// 加载数据
const loadData = async () => {
  if (!props.startDate || !props.endDate) return
  
  loading.value = true
  chartError.value = ''
  emit('loading', true)
  
  try {
    const params = {
      startDate: props.startDate,
      endDate: props.endDate,
      userName: props.userName
    }
    if (props.mainCategory) params.mainCategory = props.mainCategory
    
    const res = await getUserCategoryBreakdown(params)
    if (res.success) {
      const data = res.data || []
      chartData.value = data
      tableData.value = data
        .map((item, index) => ({
          id: `${item.user_id || item.userName || 'unknown'}_${item.category_id || item.categoryName || 'unknown'}_${Date.now()}_${index}`,
          userName: item.user_name || item.userName || item.name || '-',
          main_category_name: item.main_category_name|| '-',
          sub_category_name: item.sub_category_name|| '-',
          totalAmount: parseFloat(item.total_amount || item.totalAmount || item.amount || 0),
          applicationCount: parseInt(item.application_count || item.applicationCount || 0),
          percentage: parseFloat(item.percentage || 0)
        }))
        .sort((a, b) => b.totalAmount - a.totalAmount)
      total.value = data.length
      
      // 先设置loading为false，再更新图表
      loading.value = false
      await nextTick()
      await updateChart(data)
    } else {
      chartError.value = res.message || '获取数据失败'
      emit('error', chartError.value)
    }
  } catch (error) {
    chartError.value = error.message || '查询失败'
    emit('error', chartError.value)
  } finally {
    loading.value = false
    emit('loading', false)
  }
}

const refreshData = () => {
  currentPage.value = 1
  // 清理现有图表实例
  if (chartInstance) {
    chartInstance.dispose()
    chartInstance = null
  }
  loadData()
}

const exportData = async () => {
  if (loading.value) return ElMessage.warning('数据加载中，请稍候再试')
  if (!tableData.value.length) return ElMessage.warning('暂无数据可导出')
  
  try {
    const params = {
      startDate: props.startDate,
      endDate: props.endDate,
      userName: props.userName,
      ...(props.mainCategory && { mainCategory: props.mainCategory })
    }
    
    ElMessage.info('正在准备导出数据，请稍候...')
    const { success, data = [] } = await getUserCategoryBreakdown(params)
    
    if (success) {
      const headers = ['用户姓名', '主分类', '子分类', '总金额', '申请数量', '占比(%)']
      const csv = [
        headers.join(','),
        ...data.map(item => [
          item.user_name || item.userName || item.name || '-',
          item.main_category_name || '-',
          item.sub_category_name || '-',
          (item.total_amount || item.totalAmount || item.amount || 0).toFixed(2),
          (item.application_count || item.applicationCount || 0),
          (item.percentage || 0).toFixed(1)
        ].join(','))
      ].join('\n')
      
      const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
      const link = Object.assign(document.createElement('a'), {
        href: URL.createObjectURL(blob),
        download: `用户分类占比统计_${new Date().toISOString().slice(0,10)}.csv`,
        style: 'visibility:hidden'
      })
      document.body.appendChild(link)
      link.click()
      link.remove()
      
      ElMessage.success('数据导出成功')
    } else {
      ElMessage.warning('获取导出数据失败')
    }
  } catch {
    ElMessage.error('导出数据失败，请稍后重试')
  }
}

// 监听参数变化
watch([() => props.startDate, () => props.endDate, () => props.userName, () => props.mainCategory], () => {
  currentPage.value = 1
  loadData()
})

// 监听窗口大小变化
const handleResize = () => chartInstance?.resize()

onMounted(() => {
  console.log('UserCategoryBreakdown mounted')
  // 延迟加载数据，确保DOM完全加载
  setTimeout(() => {
    loadData()
  }, 300)
  
  // 添加窗口大小变化监听
  window.addEventListener('resize', handleResize)
})

// 组件卸载时清理图表实例
onUnmounted(() => {
  if (chartInstance) {
    chartInstance.dispose()
    chartInstance = null
  }
  
  window.removeEventListener('resize', handleResize)
})

// 清理方法（也可通过API调用）
const cleanup = () => {
  chartInstance?.dispose()
  chartInstance = null
  window.removeEventListener('resize', handleResize)
}

// 暴露方法
defineExpose({
  refreshData,
  exportData
})
</script>

<style scoped>
.chart-container-wrapper {
  width: 100%;
  height: 500px;
  position: relative;
}

/* 淡入动画 */
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
  animation: fadeIn 0.5s ease-in;
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .chart-container-wrapper {
    height: 400px;
  }
  
  .space-y-6 {
    gap: 1.5rem;
  }
  
  h3 {
    font-size: 1rem !important;
  }
  
  .px-6 {
    padding-left: 1rem !important;
    padding-right: 1rem !important;
  }
  
  button {
    padding: 0.5rem 1rem !important;
    font-size: 0.75rem !important;
  }
  
  button i {
    font-size: 0.75rem !important;
  }
}

@media (max-width: 480px) {
  .chart-container-wrapper {
    height: 350px;
  }
  
  .px-4 {
    padding-left: 0.75rem !important;
    padding-right: 0.75rem !important;
  }
  
  .py-2 {
    padding-top: 0.5rem !important;
    padding-bottom: 0.5rem !important;
  }
}

/* 滚动条样式 */
.overflow-x-auto::-webkit-scrollbar {
  height: 6px;
}

.overflow-x-auto::-webkit-scrollbar-track {
  background: rgba(15, 23, 42, 0.2);
  border-radius: 3px;
}

.overflow-x-auto::-webkit-scrollbar-thumb {
  background: rgba(148, 163, 184, 0.5);
  border-radius: 3px;
}

.overflow-x-auto::-webkit-scrollbar-thumb:hover {
  background: rgba(148, 163, 184, 0.7);
}
</style>