<!-- 用户设备申请总量统计组件 -->
<template>
  <div class="space-y-6">
    <!-- 图表显示 -->
    <div class="backdrop-blur-lg bg-white/10 rounded-2xl border border-white/20 shadow-xl p-6">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-xl font-bold text-white flex items-center">
          <i class="fas fa-user-cog mr-3 text-primary"></i>
          用户设备申请总量统计
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
              <th scope="col" class="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">申请数量</th>
              <th scope="col" class="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">申请次数</th>
              <th scope="col" class="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">平均数量</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in tableData" :key="item.id" class="border-b border-white/10 hover:bg-white/5 transition-colors duration-200">
              <td class="px-6 py-4">
                <span class="text-white font-semibold text-sm">
                  {{ item.user_name }}
                </span>
              </td>
              <td class="px-6 py-4 text-gray-400">
                {{ item.department_name || '-' }}
              </td>
              <td class="px-6 py-4">
                <span class="px-3 py-1.5 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-300 border border-blue-400/30 rounded-full text-sm font-bold backdrop-blur-sm">
                  <i class="fas fa-cubes mr-1 text-blue-400"></i>
                  {{ item.total_quantity }}
                </span>
              </td>
              <td class="px-6 py-4 text-gray-400">
                {{ item.application_count }}
              </td>
              <td class="px-6 py-4">
                <span class="px-3 py-1.5 bg-gradient-to-r from-emerald-500/20 to-green-500/20 text-emerald-300 border border-emerald-400/30 rounded-full text-xs font-medium backdrop-blur-sm">
                  <i class="fas fa-calculator mr-1 text-emerald-400"></i>
                  {{ Math.round(item.avg_quantity * 100) / 100 }}
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
import { getUserEquipmentTotal } from '@/api/equipmentStatistics'
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

// 格式化数量
const formatAmount = (amount) => {
  if (amount === null || amount === undefined || amount === '') return '0'
  
  const num = parseFloat(amount)
  if (isNaN(num)) return '0'
  
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
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
  
  // 准备数据
  const xAxisData = chartData.value.map(item => item.user_name)
  const seriesData = chartData.value.map(item => ({
    value: item.total_quantity,
    itemStyle: {
      color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        { offset: 0, color: '#3B82F6' },
        { offset: 1, color: '#1E40AF' }
      ])
    }
  }))
  
  return {
    backgroundColor: 'transparent',
    title: {
      text: '用户设备申请数量统计',
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
        const data = params[0]
        return `
          <div style="padding: 8px;">
            <div style="font-weight: bold; margin-bottom: 4px;">${data.name}</div>
            <div>申请数量: <span style="color: #3B82F6; font-weight: bold;">${formatAmount(data.value)}</span></div>
          </div>
        `
      }
    },
    legend: {
      data: ['申请数量'],
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
    series: [{
      name: '申请数量',
      type: 'bar',
      data: seriesData,
      barWidth: '60%',
      itemStyle: {
        borderRadius: [4, 4, 0, 0]
      },
      label: {
        show: true,
        position: 'top',
        color: '#FFFFFF',
        fontSize: 12,
        formatter: '{c}'
      }
    }]
  }
}

// 加载数据
const loadData = async () => {
  if (loading.value) return
  
  if (!props.startDate || !props.endDate) {
    return
  }
  
  loading.value = true
  emit('loading', true)
  
  try {
    // 构建查询参数
    const params = {
      startDate: props.startDate,
      endDate: props.endDate,
      userName: props.userName || null
    }
    
    console.log('查询参数:', params)
    
    // 调用API
    const response = await getUserEquipmentTotal(params)
    
    if (response.success && response.data) {
      loading.value = false
      emit('loading', false)
      // 直接使用API返回的数据
      chartData.value = response.data
      tableData.value = response.data
      total.value = response.data.length || 0
      
      // 初始化图表
      await nextTick()
      await initChart()
      
    } else {
      chartData.value = []
      tableData.value = []
      total.value = 0
      ElMessage.warning('未获取到数据')
    }
  } catch (error) {
    console.error('加载用户设备申请总量数据失败:', error)
    chartData.value = []
    tableData.value = []
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
    // 构建查询参数
    const params = {
      startDate: props.startDate,
      endDate: props.endDate,
      userName: props.userName || null
    }
    
    ElMessage.info('正在准备导出数据，请稍候...')
    
    // 调用API获取全部数据
    const response = await getUserEquipmentTotal(params)
    
    if (response.success && response.data && Array.isArray(response.data)) {
      // 构建CSV数据
      const headers = ['用户姓名', '部门', '申请数量', '申请次数', '平均数量']
      const csvContent = [
        headers.join(','),
        ...response.data.map(item => [
          item.user_name,
          item.department_name || '-',
          item.total_quantity,
          item.application_count,
          Math.round(item.avg_quantity * 100) / 100
        ].join(','))
      ].join('\n')
      
      // 创建下载链接
      const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', `用户设备申请总量统计_${new Date().toLocaleDateString('zh-CN')}.csv`)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      ElMessage.success('数据导出成功')
    } else {
      ElMessage.warning('导出失败：未获取到有效数据')
    }
  } catch (error) {
    console.error('导出数据失败:', error)
    ElMessage.error('数据导出失败，请稍后重试')
  }
}

// 监听props变化
watch([() => props.startDate, () => props.endDate, () => props.userName], () => {
  loadData()
}, { immediate: true })

// 组件卸载时清理
onMounted(() => {
  return () => {
    if (chartInstance) {
      chartInstance.dispose()
      chartInstance = null
    }
  }
})
</script>

<style scoped>
.chart-container {
  width: 100%;
  height: 400px;
}
</style>