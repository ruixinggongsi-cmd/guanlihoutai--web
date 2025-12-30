<!-- 用户设备分类明细统计组件 -->
<template>
  <div class="space-y-6">
    <!-- 图表区域 -->
    <div class="backdrop-blur-lg bg-white/10 rounded-2xl border border-white/20 shadow-xl p-6">
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-xl font-bold text-white flex items-center">
            <i class="fas fa-chart-bar mr-3 text-primary"></i>
            用户设备分类明细
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
        <h3 class="text-lg font-semibold text-white">设备分类明细</h3>
        <span class="text-sm text-gray-400">共 {{ total }} 条记录</span>
      </div>
      
      <div class="overflow-x-auto">
        <table class="w-full text-sm text-left">
          <thead class="text-xs text-gray-400 uppercase bg-white/5">
            <tr>
              <th scope="col" class="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">用户姓名</th>
              <th scope="col" class="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">主分类</th>
              <th scope="col" class="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">子分类</th>
              <th scope="col" class="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">总数量</th>
              <th scope="col" class="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">申请次数</th>
              <th scope="col" class="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">占比</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in paginatedData" :key="`${item.user_name}_${item.main_category_name}_${item.sub_category_name}`" class="border-b border-white/10 hover:bg-white/5 transition-colors duration-200">
              <td class="px-6 py-4">
                <span class="text-white font-semibold text-sm">
                  {{ item.user_name }}
                </span>
              </td>
              <td class="px-6 py-4">
                <span class="text-gray-300 text-sm">
                  {{ item.main_category_name }}
                </span>
              </td>
              <td class="px-6 py-4">
                <span class="text-gray-300 text-sm">
                  {{ item.sub_category_name }}
                </span>
              </td>
              <td class="px-6 py-4">
                <span class="px-3 py-1.5 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-300 border border-blue-400/30 rounded-full text-sm font-bold backdrop-blur-sm">
                  <i class="fas fa-cubes mr-1 text-blue-400"></i>
                  {{ formatAmount(item.total_quantity) }}
                </span>
              </td>
              <td class="px-6 py-4">
                <span class="px-3 py-1.5 bg-gradient-to-r from-emerald-500/20 to-green-500/20 text-emerald-300 border border-emerald-400/30 rounded-full text-sm font-medium backdrop-blur-sm">
                  <i class="fas fa-file-alt mr-1 text-emerald-400"></i>
                  {{ formatAmount(item.application_count) }}
                </span>
              </td>
              <td class="px-6 py-4">
                <span class="px-3 py-1.5 bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 border border-purple-400/30 rounded-full text-sm font-medium backdrop-blur-sm">
                  <i class="fas fa-percentage mr-1 text-purple-400"></i>
                  {{ formatPercentage(item.percentage_of_total) }}
                </span>
              </td>
            </tr>
            <tr v-if="paginatedData.length === 0">
              <td colspan="6" class="px-6 py-8 text-center text-gray-400">
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
import { getUserEquipmentCategoryBreakdown } from '@/api/equipmentStatistics'

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
const currentPage = ref(1)
const pageSize = ref(10)
const chartData = ref([])

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

// 格式化数量
const formatAmount = (amount) => {
  if (amount === null || amount === undefined || amount === '') return '0'
  
  const num = parseFloat(amount)
  if (isNaN(num)) return '0'
  
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

// 格式化百分比
const formatPercentage = (value) => {
  if (value === null || value === undefined || value === '') return '0%'
  
  const num = parseFloat(value)
  if (isNaN(num)) return '0%'
  
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
  
  // 准备数据 - 按用户分组，每个用户显示其分类组合数据
  const userGroups = {}
  chartData.value.forEach(item => {
    if (!userGroups[item.user_name]) {
      userGroups[item.user_name] = {
        user_name: item.user_name,
        categories: {},
        total_quantity: 0
      }
    }
    const categoryKey = `${item.main_category_name}-${item.sub_category_name}`
    if (!userGroups[item.user_name].categories[categoryKey]) {
      userGroups[item.user_name].categories[categoryKey] = {
        category_key: categoryKey,
        main_category_name: item.main_category_name,
        sub_category_name: item.sub_category_name,
        total_quantity: 0
      }
    }
    userGroups[item.user_name].categories[categoryKey].total_quantity += item.total_quantity
    userGroups[item.user_name].total_quantity += item.total_quantity
  })
  
  // 按用户总数量排序，取前10个用户
  const sortedUsers = Object.values(userGroups)
    .sort((a, b) => b.total_quantity - a.total_quantity)
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
      return user.categories[categoryKey] ? user.categories[categoryKey].total_quantity : '-'
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
  
  return {
    backgroundColor: 'transparent',
    title: {
      text: '用户设备分类分布统计',
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
            content += `<div>${param.seriesName}: ${param.value}</div>`
          }
        })
        
        content += `<div style="margin-top: 4px; font-weight: bold;">总计: ${user.total_quantity}</div></div>`
        return content
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
}

// 加载数据
const loadData = async () => {
  if (loading.value) return
  

  
  loading.value = true
  chartError.value = ''
  emit('loading', true)
  
  try {
    // 构建查询参数 - 匹配API接口参数格式
    const params = {
      startDate: props.startDate,
      endDate: props.endDate,
      userName: props.userName || null,
      mainCategory: props.mainCategory || null
    }
    
    console.log('查询参数:', params)
    
    // 调用API
    const response = await getUserEquipmentCategoryBreakdown(params)
    
    if (response.success && response.data) {
       loading.value = false
      // 直接使用API返回的数据
      tableData.value = response.data
      chartData.value = response.data
      total.value = response.data.length || 0
      
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
    console.error('加载用户设备分类申请明细数据失败:', error)
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
  currentPage.value = 1
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
    // 构建查询参数
    const params = {
      startDate: props.startDate,
      endDate: props.endDate,
      userName: props.userName || null,
      mainCategory: props.mainCategory || null
    }
    
    ElMessage.info('正在准备导出数据，请稍候...')
    
    // 调用API获取全部数据
    const response = await getUserEquipmentCategoryBreakdown(params)
    
    if (response.success && response.data && Array.isArray(response.data)) {
      loading.value = false
      // 构建CSV数据
      const headers = ['用户姓名', '主分类', '子分类', '总数量', '申请次数', '占比(%)']
      const csvContent = [
        headers.join(','),
        ...response.data.map(item => [
          item.user_name,
          item.main_category_name,
          item.sub_category_name,
          item.total_quantity,
          item.application_count,
          item.percentage_of_total
        ].join(','))
      ].join('\n')
      
      // 创建下载链接
      const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', `用户设备分类统计_${new Date().toISOString().split('T')[0]}.csv`)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      ElMessage.success('数据导出成功')
    } else {
      ElMessage.warning('获取导出数据失败')
    }
  } catch (error) {
    console.error('导出数据失败:', error)
    ElMessage.error('导出数据失败，请稍后重试')
  }
}

// 监听props变化
watch([() => props.startDate, () => props.endDate, () => props.userName, () => props.mainCategory], () => {
  currentPage.value = 1
  loadData()
})

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